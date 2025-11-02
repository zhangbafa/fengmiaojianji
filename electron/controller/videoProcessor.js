// videoProcessor.js
const os = require('os');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');
const { getVideoDurationInSeconds } = require('get-video-duration');
const ffmpeg = require('fluent-ffmpeg');
// const VideoConfigDB = require('./db');

class OptimizedVideoProcessor {
    constructor(item) {
        // this.db = new VideoConfigDB();
        this.rootDir = item.directory;
        this.filePrefix = item.file_prefix || 'HX';
        this.id = item.id || 1;
        this._totalDurations = 0;

        this.videoExtensions = new Set(['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv']);
        this.audioExtensions = new Set(['.mp3', '.wav', '.aac', '.flac', '.m4a']);
        this.subtitleExtension = '.srt';

        this.processingOptions = {
            scale: item.probability_scale,
            flip: item.probability_flip,
            original: item.probability_original,
            trim3s: item.probability_trim3s,
        };

        this.maxSegmentDuration = 10;
        this.maxWorkers = Math.min(4, os.cpus().length);
        this.useHardwareEncoder = 'libx264'; // 默认软件编码

        this.videoFiles = [];
        this.audioFiles = [];
        this.subtitleFiles = new Map();

        this.durationCache = new Map();
        this.segmentCache = new Map();
        this.maxCacheSize = 50;

        this.tempDir = path.join(os.tmpdir(), `optimized_video_${Date.now()}`);
        fs.ensureDirSync(this.tempDir);

        this._validateProbabilities();
    }

    async initialize() {
        this.useHardwareEncoder = await this._detectHardwareEncoder();
    }

    async _detectHardwareEncoder() {
        return new Promise((resolve) => {
            exec('ffmpeg -encoders', (error, stdout) => {
                if (error) {
                    console.log("无法检测硬件编码器，使用软件编码器 libx264");
                    resolve('libx264');
                    return;
                }
                if (stdout.includes('h264_nvenc')) {
                    console.log("检测到 NVIDIA NVENC 硬件编码器");
                    resolve('h264_nvenc');
                } else if (stdout.includes('h264_videotoolbox')) {
                    console.log("检测到 VideoToolbox 硬件编码器 (macOS)");
                    resolve('h264_videotoolbox');
                } else {
                    console.log("使用软件编码器 libx264");
                    resolve('libx264');
                }
            });
        });
    }

    _validateProbabilities() {
        const total = Object.values(this.processingOptions).reduce((sum, prob) => sum + prob, 0);
        if (total < 0.99 || total > 1.01) {
            throw new Error(`概率总和必须为1，当前为${total.toFixed(2)}`);
        }
    }

    async scanFiles(forceRefresh = false,callback) {
        console.log(`扫描目录: ${this.rootDir}`);
        const allFiles = [];
        const walk = async (dir) => {
            const files = await fs.readdir(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                const stat = await fs.stat(fullPath);
                if (stat.isDirectory()) {
                    await walk(fullPath);
                } else {
                    allFiles.push(fullPath);
                }
            }
        };
        await walk(this.rootDir);

        for (const file of allFiles) {
            const ext = path.extname(file).toLowerCase();
            const stem = path.basename(file, ext);
            if (this.videoExtensions.has(ext)) this.videoFiles.push(file);
            else if (this.audioExtensions.has(ext)) this.audioFiles.push(file);
            else if (ext === this.subtitleExtension) this.subtitleFiles.set(stem, file);
        }

        await this._precacheDurations(forceRefresh);
        
        console.log(`找到 ${this.videoFiles.length} 视频, ${this.audioFiles.length} 音频, ${this.subtitleFiles.size} 字幕`);
        console.log(`总时长: ${this._totalDurations.toFixed(2)}秒`);
        callback(this.videoFiles.length, this.subtitleFiles.size, this.audioFiles.length, this._totalDurations)
        // this.db.updateVideoMeta(this.videoFiles.length, this.subtitleFiles.size, this.audioFiles.length, this._totalDurations, this.id);
    }

    async _precacheDurations(forceRefresh = false) {
        console.log("预缓存媒体文件时长...");
        const allMediaFiles = [...this.videoFiles, ...this.audioFiles];
        const cacheFile = path.join('./', `${this.filePrefix}_media_durations_cache.json`);

        if (!forceRefresh && await fs.pathExists(cacheFile)) {
            try {
                const cachedData = await fs.readJson(cacheFile);
                let validCacheCount = 0;
                for (const [filePath, duration] of Object.entries(cachedData)) {
                    if (await fs.pathExists(filePath) && duration > 0) {
                        this.durationCache.set(filePath, duration);
                        validCacheCount++;
                    }
                }
                console.log(`从缓存加载 ${validCacheCount} 个文件的时长信息`);
            } catch (e) {
                console.error(`缓存文件加载失败，将重新获取时长: ${e.message}`);
            }
        }
        
        this._totalDurations = Array.from(this.durationCache.values()).reduce((a, b) => a + b, 0);
        
        const filesToProcess = allMediaFiles.filter(f => !this.durationCache.has(f));
        if (filesToProcess.length === 0) {
            console.log("所有文件时长信息已从缓存加载");
            return;
        }

        console.log(`发现 ${filesToProcess.length} 个新文件需要获取时长`);

        const promises = filesToProcess.map(async (filePath) => {
            try {
                const duration = await getVideoDurationInSeconds(filePath);
                return { filePath, duration };
            } catch (e) {
                console.error(`获取文件时长失败 ${filePath}: ${e.message}`);
                return { filePath, duration: 0 };
            }
        });

        const results = await Promise.all(promises);
        for (const { filePath, duration } of results) {
            if(duration > 0) {
                this.durationCache.set(filePath, duration);
                this._totalDurations += duration;
            }
        }

        try {
            await fs.writeJson(cacheFile, Object.fromEntries(this.durationCache), { spaces: 2 });
            console.log(`时长信息已保存到缓存文件: ${cacheFile}`);
        } catch (e) {
            console.error(`保存缓存文件失败: ${e.message}`);
        }
    }

    getMediaDuration(filePath) {
        return this.durationCache.get(filePath) || 0;
    }

    selectRandomAudio() {
        if (this.audioFiles.length === 0) throw new Error("没有音频文件");
        const audioPath = this.audioFiles[Math.floor(Math.random() * this.audioFiles.length)];
        const duration = this.getMediaDuration(audioPath);
        console.log(`选中音频: ${audioPath}, 时长: ${duration.toFixed(2)}秒`);
        return { audioPath, duration };
    }

    getMatchingSubtitle(audioPath) {
        const audioName = path.basename(audioPath, path.extname(audioPath));
        return this.subtitleFiles.get(audioName) || null;
    }
    
    _selectProcessingOption() {
        const rand = Math.random();
        let cumulative = 0;
        for (const [option, prob] of Object.entries(this.processingOptions)) {
            cumulative += prob;
            if (rand < cumulative) {
                return option;
            }
        }
        return 'original';
    }

    _generateCacheKey(videoPath, startTime, duration, processing) {
        const relativePath = path.relative(this.rootDir, videoPath);
        const keyString = `${relativePath}_${startTime.toFixed(3)}_${duration.toFixed(3)}_${processing}`;
        return crypto.createHash('md5').update(keyString).digest('hex');
    }

    async processSegmentsParallel(targetDuration) {
        console.log(`开始并行处理片段，目标时长: ${targetDuration.toFixed(2)}秒`);
        
        let segmentsInfo = [];
        let totalDuration = 0;
        let loopCount = 0;
        const maxLoops = 500;

        while (totalDuration < targetDuration && loopCount < maxLoops) {
            const videoPath = this.videoFiles[Math.floor(Math.random() * this.videoFiles.length)];
            const remaining = targetDuration - totalDuration;
            
            const processing = this._selectProcessingOption();
            const videoDuration = this.getMediaDuration(videoPath);
            const baseDuration = Math.min(videoDuration, remaining, this.maxSegmentDuration);

            if (baseDuration <= 0) {
                loopCount++;
                continue;
            }

            const actualDuration = (processing === 'trim3s') ? Math.min(baseDuration, 3) : baseDuration;
            const startTime = Math.random() * Math.max(0, videoDuration - actualDuration);

            segmentsInfo.push({
                videoPath,
                startTime,
                duration: actualDuration,
                processing,
            });

            totalDuration += actualDuration;
            loopCount++;
        }

        const processedSegments = await this._processSegmentsBatch(segmentsInfo);
        return { processedSegments, totalDuration };
    }

    async _processSegmentsBatch(segmentsInfo) {
        const promises = segmentsInfo.map(info => this._processSingleSegment(info));
        const results = await Promise.all(promises);
        return results.filter(Boolean); // 过滤掉处理失败的(null)
    }

    async _processSingleSegment(segmentInfo) {
        const { videoPath, startTime, duration, processing } = segmentInfo;

        if (!await fs.pathExists(videoPath)) {
            console.error(`文件不存在: ${videoPath}`);
            return null;
        }

        const cacheKey = this._generateCacheKey(videoPath, startTime, duration, processing);
        if (this.segmentCache.has(cacheKey)) {
            const cachedPath = this.segmentCache.get(cacheKey);
            if (await fs.pathExists(cachedPath)) {
                console.log(`缓存命中: ${path.basename(videoPath)}`);
                return cachedPath;
            } else {
                this.segmentCache.delete(cacheKey);
            }
        }
        
        const outputPath = path.join(this.tempDir, `segment_${cacheKey}.mp4`);

        return new Promise((resolve) => {
            const command = ffmpeg(videoPath)
                .setStartTime(startTime)
                .setDuration(duration)
                .noAudio();

            let filters = [];
            if (processing === 'scale') {
                filters.push('scale=iw*1.5:ih*1.5,crop=iw/1.5:ih/1.5');
            } else if (processing === 'flip') {
                filters.push('hflip');
            }
            if (filters.length > 0) {
                command.videoFilter(filters);
            }

            // 设置编码器
            if (this.useHardwareEncoder === 'h264_videotoolbox') {
                command.videoCodec('h264_videotoolbox').addOption('-b:v', '2M');
            } else if (this.useHardwareEncoder === 'h264_nvenc') {
                command.videoCodec('h264_nvenc').addOption('-crf', '23');
            } else {
                command.videoCodec('libx264').addOption('-crf', '23').preset('fast');
            }

            command
                .on('error', (err) => {
                    console.error(`处理片段失败 ${videoPath}: ${err.message}`);
                    resolve(null);
                })
                .on('end', () => {
                    if (this.segmentCache.size < this.maxCacheSize) {
                        this.segmentCache.set(cacheKey, outputPath);
                    }
                    resolve(outputPath);
                })
                .save(outputPath);
        });
    }

    async createFinalVideo(segments, audioPath, subtitlePath, targetDuration, outputPath) {
        console.log("创建最终视频...");

        const listPath = path.join(this.tempDir, 'segments_list.txt');
        const content = segments.map(seg => `file '${seg.replace(/'/g, "'\\''")}'`).join('\n');
        await fs.writeFile(listPath, content);
        
        const concatTemp = path.join(this.tempDir, 'concat_temp.mp4');

        // 1. 拼接
        await new Promise((resolve, reject) => {
            ffmpeg()
                .input(listPath)
                .inputOptions(['-f concat', '-safe 0'])
                .outputOptions('-c copy')
                .on('error', reject)
                .on('end', resolve)
                .save(concatTemp);
        });

        // 2. 裁剪到目标时长
        const trimmedTemp = path.join(this.tempDir, "trimmed_temp.mp4");
        await new Promise((resolve, reject) => {
             ffmpeg(concatTemp)
                .setDuration(targetDuration)
                .outputOptions('-c copy')
                .on('error', reject)
                .on('end', resolve)
                .save(trimmedTemp);
        });
        
        // 3. 合并音视频和字幕
        return new Promise((resolve, reject) => {
            const command = ffmpeg(trimmedTemp).input(audioPath);

            // 编码
            if (this.useHardwareEncoder === 'h264_videotoolbox') {
                command.videoCodec('h264_videotoolbox').addOption('-b:v', '2M');
            } else if (this.useHardwareEncoder === 'h264_nvenc') {
                command.videoCodec('h264_nvenc').addOption('-crf', '23');
            } else {
                command.videoCodec('libx264').addOption('-crf', '23').preset('fast');
            }
            command.audioCodec('aac').audioBitrate('192k');

            // 字幕
            if (subtitlePath && fs.existsSync(subtitlePath)) {
                const style = "Alignment=2,MarginV=60,FontSize=12,PrimaryColour=&HFFFFFF";
                // fluent-ffmpeg正确处理Windows路径需要特殊转义
                const escapedSubtitlePath = subtitlePath.replace(/\\/g, '/').replace(/:/g, '\\:');
                command.videoFilter(`subtitles=${escapedSubtitlePath}:force_style='${style}'`);
            }

            command
                .on('error', (err) => {
                    console.error(`最终合成失败: ${err.message}`);
                    reject(err);
                })
                .on('end', () => {
                    console.log(`优化视频生成成功: ${outputPath}`);
                    resolve(outputPath);
                })
                .save(outputPath);
        });
    }
    
    async generateMultipleVideos(count, outputDir, filePrefix = 'HX', forceRefresh = false,callback,progressCallBack) {
        console.log(`开始生成 ${count} 个视频...`);
        if (forceRefresh) {
            console.log("强制刷新媒体文件时长缓存");
        }

        const results = [];
        await this.scanFiles(forceRefresh,callback);

        for (let i = 0; i < count; i++) {
            console.log(`\n--------------------\n生成第 ${i + 1} 个视频...\n--------------------`);
            
            const now = new Date();
            const timestamp = now.toISOString().slice(0, 13).replace(/[-T]/g, '');
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            const filename = `${filePrefix}_${timestamp}_${randomNum}.mp4`;
            
            const groupIdx = Math.floor(i / 10);
            const subdirName = `${filePrefix}_${groupIdx}`;
            const subdirPath = path.join(outputDir, subdirName);
            await fs.ensureDir(subdirPath);

            const outputPath = path.join(subdirPath, filename);

            try {
                const result = await this._generateSingleVideo(outputPath);
                results.push(result);
                console.log(`第 ${i + 1} 个视频生成完成`);
                // this.db.updateGenerateVideoCount(this.id);
                progressCallBack(i + 1)
            } catch (e) {
                console.error(`第 ${i + 1} 个视频生成失败: ${e.message}`);
                results.push(null);
            }
        }
        return results;
    }

    async _generateSingleVideo(outputPath) {
        const { audioPath, duration: targetDuration } = this.selectRandomAudio();
        if (targetDuration <= 0) throw new Error("音频时长为0");

        const subtitlePath = this.getMatchingSubtitle(audioPath);
        
        const { processedSegments, totalDuration } = await this.processSegmentsParallel(targetDuration);
        if (processedSegments.length === 0) throw new Error("未收集到有效片段");
        
        console.log(`处理完成: ${processedSegments.length}个片段, 总时长: ${totalDuration.toFixed(2)}秒`);

        const finalVideo = await this.createFinalVideo(
            processedSegments, audioPath, subtitlePath, targetDuration, outputPath
        );

        if (!finalVideo) {
             throw new Error("最终视频生成失败");
        }
        return finalVideo;
    }

    async cleanup() {
        if (await fs.pathExists(this.tempDir)) {
            await fs.remove(this.tempDir);
            console.log("临时文件已清理");
        }
    }
}

module.exports = OptimizedVideoProcessor;