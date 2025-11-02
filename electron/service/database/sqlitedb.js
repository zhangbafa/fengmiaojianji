'use strict';

const { BasedbService } = require('./basedb');

/**
 * sqlite数据存储
 * @class
 */
class SqlitedbService extends BasedbService {

  constructor() {
    const options = {
      dbname: 'video_config.db',
    }
    super(options);
    this.userTableName = 'video_config';
    this.init()
  }

  /*
   * 初始化
   */
  init() {
    // 初始化数据库
    this._init();

    // 检查表是否存在
    const masterStmt = this.db.prepare('SELECT * FROM sqlite_master WHERE type=? AND name = ?');
    let tableExists = masterStmt.get('table', this.userTableName);
    if (!tableExists) {
      // 创建表
      const create_user_table_sql =
        `CREATE TABLE ${this.userTableName}
      (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        directory TEXT NOT NULL,
        output_video TEXT NOT NULL,
        file_prefix TEXT,
        video_width INTEGER,
        video_height INTEGER,
        scale REAL DEFAULT 1.0,
        flip BOOLEAN DEFAULT 0,
        original BOOLEAN DEFAULT 0,
        trim3s BOOLEAN DEFAULT 0,
        probability_scale REAL DEFAULT 0.2,
        probability_flip REAL DEFAULT 0.4,
        probability_original REAL DEFAULT 0.2,
        probability_trim3s REAL DEFAULT 0.2,
        subtitle_alignment INTEGER DEFAULT 2,
        subtitle_margin_v INTEGER DEFAULT 60,
        subtitle_font_name TEXT DEFAULT '阿里巴巴普惠体',
        subtitle_font_size INTEGER DEFAULT 12,
        subtitle_primary_color TEXT DEFAULT '&HFFFFFF',
        subtitle_bold BOOLEAN DEFAULT 1,
        subtitle_outline INTEGER DEFAULT 1,
        subtitle_outline_color TEXT DEFAULT '&HFF000000',
        subtitle_shadow INTEGER DEFAULT 1,
        subtitle_shadow_color TEXT DEFAULT '&H80888888',
        subtitle_position TEXT,
        generate_video_count INTEGER DEFAULT 0,
        video_count INTEGER DEFAULT 0,
        srt_count INTEGER DEFAULT 0,
        audio_count INTEGER DEFAULT 0,
        video_duration INTEGER DEFAULT 0
      );`
      this.db.exec(create_user_table_sql);
    }
  }

  /*
   * 增 Test data (sqlite)
   */
  async saveConfig(data) {
    const stmt = this.db.prepare(`
            INSERT INTO video_config (
                title, directory, output_video, file_prefix, video_width, video_height,
                scale, flip, original, trim3s, probability_scale, probability_flip, probability_original, probability_trim3s, subtitle_alignment,
                subtitle_margin_v, subtitle_font_name, subtitle_font_size,
                subtitle_primary_color, subtitle_bold, subtitle_outline,
                subtitle_outline_color, subtitle_shadow, subtitle_shadow_color,
                subtitle_position
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

    const result = stmt.run(
      data.title ?? "默认项目",
      data.directory,
      data.output_video,
      data.file_prefix ?? "",
      data.video_width,
      data.video_height,
      data.scale ?? 1.0,
      data.flip ? 1 : 0,
      data.original ? 1 : 0,
      data.trim3s ? 1 : 0,
      data.probability_scale ?? 0.2,
      data.probability_flip ?? 0.4,
      data.probability_original ?? 0.2,
      data.probability_trim3s ?? 0.2,
      data.subtitle_alignment ?? 2,
      data.subtitle_margin_v ?? 60,
      data.subtitle_font_name ?? '阿里巴巴普惠体',
      data.subtitle_font_size ?? 12,
      data.subtitle_primary_color ?? '&HFFFFFF',
      data.subtitle_bold ? 1 : 0,
      data.subtitle_outline ?? 1,
      data.subtitle_outline_color ?? '&HFF000000',
      data.subtitle_shadow ?? 1,
      data.subtitle_shadow_color ?? '&H80888888',
      data.subtitle_position ?? ''
    );
    return result.lastInsertRowid;
  }

  // 获取配置
  async getConfig(configId) {
    const stmt = this.db.prepare("SELECT * FROM video_config WHERE id = ?");
    const config = stmt.get(configId);

    if (!config) {
      return null;
    }

    return {
      directory: config.directory,
      output_video: config.output_video,
      filePrefix: config.file_prefix,
      video_settings: {
        width: config.video_width,
        height: config.video_height
      },
      scale: config.scale,
      flip: !!config.flip,
      original: !!config.original,
      trim3s: !!config.trim3s,
      subtitle_settings: {
        alignment: config.subtitle_alignment,
        margin_v: config.subtitle_margin_v,
        font_name: config.subtitle_font_name,
        font_size: config.subtitle_font_size,
        primary_color: config.subtitle_primary_color,
        bold: !!config.subtitle_bold,
        outline: config.subtitle_outline,
        outline_color: config.subtitle_outline_color,
        shadow: config.subtitle_shadow,
        shadow_color: config.subtitle_shadow_color,
        position: config.subtitle_position
      }
    };
  }


  // 更新生成视频计数
  async updateGenerateVideoCount(count,configId) {
    const stmt = this.db.prepare("UPDATE video_config SET generate_video_count = generate_video_count + ? WHERE id = ?");
    const result = stmt.run(parseInt(count),parseInt(configId));
    if (result.changes === 0) {
      throw new Error("Failed to update genvideo_count");
    }
  }

  // 更新配置
  async updateConfig(configId, data) {
    const stmt = this.db.prepare(`
            UPDATE video_config SET
                title = ?,
                directory = ?,
                output_video = ?,
                file_prefix = ?,
                video_width = ?,
                video_height = ?,
                scale = ?,
                flip = ?,
                original = ?,
                trim3s = ?,
                probability_scale = ?,
                probability_flip = ?,
                probability_original = ?,
                probability_trim3s = ?,
                subtitle_alignment = ?,
                subtitle_margin_v = ?,
                subtitle_font_name = ?,
                subtitle_font_size = ?,
                subtitle_primary_color = ?,
                subtitle_bold = ?,
                subtitle_outline = ?,
                subtitle_outline_color = ?,
                subtitle_shadow = ?,
                subtitle_shadow_color = ?,
                subtitle_position = ?
            WHERE id = ?
            `);
    stmt.run(
      data.title ?? "默认项目",
      data.directory,
      data.output_video,
      data.file_prefix ?? "",
      data.video_width,
      data.video_height,
      data.scale ?? 1.0,
      data.flip ? 1 : 0,
      data.original ? 1 : 0,
      data.trim3s ? 1 : 0,
      data.probability_scale ?? 0.2,
      data.probability_flip ?? 0.4,
      data.probability_original ?? 0.2,
      data.probability_trim3s ?? 0.2,
      data.subtitle_alignment ?? 2,
      data.subtitle_margin_v ?? 60,
      data.subtitle_font_name ?? '阿里巴巴普惠体',
      data.subtitle_font_size ?? 12,
      data.subtitle_primary_color ?? '&HFFFFFF',
      data.subtitle_bold ? 1 : 0,
      data.subtitle_outline ?? 1,
      data.subtitle_outline_color ?? '&HFF000000',
      data.subtitle_shadow ?? 1,
      data.subtitle_shadow_color ?? '&H80888888',
      data.subtitle_position ?? '',
      configId
    );

  }



  // 删除配置
  async deleteConfig(id) {
    const stmt = this.db.prepare("DELETE FROM video_config WHERE id = ?");
    stmt.run(id);
    return true
  }

  // 更新视频元数据
  async updateVideoMeta(videoCount, srtCount, audioCount, videoDuration, id) {
    const stmt = this.db.prepare("UPDATE video_config SET video_count = ?, srt_count = ?, audio_count = ?, video_duration = ? WHERE id = ?");
    const result = stmt.run(videoCount, srtCount, audioCount, videoDuration, id);
    if (result.changes === 0) {
      throw new Error("Failed to update video meta");
    }
  }

  // 获取配置列表
  async listConfigs() {
    const selectAllUser = this.db.prepare(`SELECT * FROM ${this.userTableName} `);
    const allUser = selectAllUser.all();
    return allUser;
  }

  /*
   * get data dir (sqlite)
   */
  async getDataDir() {
    const dir = this.storage.getDbDir();
    console.log(this.db)
    return dir;
  }

  /*
   * set custom data dir (sqlite)
   */
  async setCustomDataDir(dir) {
    if (!dir) {
      return;
    }

    this.changeDataDir(dir);
    this.init();
    return;
  }
}
SqlitedbService.toString = () => '[class SqlitedbService]';

module.exports = {
  SqlitedbService,
  sqlitedbService: new SqlitedbService()
};
