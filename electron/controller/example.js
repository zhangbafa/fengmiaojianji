'use strict';

const { exampleService } = require('../service/example');
const { sqlitedbService } = require('../service/database/sqlitedb');
const OptimizedVideoProcessor = require('./videoProcessor');
const Utils = require('ee-core/utils');
const fetch = require('node-fetch');
/**
 * example
 * @class
 */
class ExampleController {

  async getMachineId() {
    return Utils.machineIdSync({original: true})
  }   

  async fetchUserInfo(args,event){
    const {macid} = args
    const result = await fetch(`https://cdy.wolewan.com/api/cut/user?macid=${macid}`)
    const data = await result.json()
    return data
  }
  async loginByMachineID(args,event){
    const {macid} = args
    const result = await fetch(`https://cdy.wolewan.com/api/cut/user`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({macid:macid})
    })
    const data = await result.json()
    return data
    
  }
  /**
   * 所有方法接收两个参数
   * @param args 前端传的参数
   * @param event - ipc通信时才有值。详情见：控制器文档
   */
  async allList() {
    const result = await sqlitedbService.listConfigs();
    return result;
  }

  // 删除配置
  async deleteConfig(args, event) {
    const { id } = args;
    const result = await sqlitedbService.deleteConfig(id);
    return true
  }

  //  saveconfig
  async saveConfig(args, event) {
    // const { id, title, directory, output_video, file_prefix, subtitle_font_size, subtitle_font_color, subtitle_shadow_color, subtitle_position } = args;
    const result = await sqlitedbService.saveConfig(args)
    return true
  }

  async updateConfig(args,event){
    const {id,data} = args
    const result = await sqlitedbService.updateConfig(id,data)
    return true
  }
  // 批量生成视频
  async generateMultipleVideos(args, event) {
    const channel = 'controller/example/generateMultipleVideos';
    const { directory, file_prefix, id, output_video, count, force_refresh = true } = args;
    console.log(directory, file_prefix, id, output_video)

    // const data = frameworkService.bothWayMessage(type, content, event);
    // e.reply(`${c}`, data)
    // setInterval(function (e, c, msg) {
    //   let timeNow = Date.now();
    //   let data = msg + ':' + timeNow;
    //   e.reply(`${c}`, data)
    //   console.log(`${c}`, data)
    // }, 1000, event, channel, 'content')

    const itemConfig = {
      directory: directory,
      probability_scale: 0.3,
      probability_flip: 0.3,
      probability_original: 0.2,
      probability_trim3s: 0.2,
      file_prefix: file_prefix,
      // ... (其他字幕配置可以传递给处理器，但当前版本的处理器未使用)
    };

    const processor = new OptimizedVideoProcessor(itemConfig);

    try {
      await processor.initialize(); // 初始化，检测硬件编码等
      // const count = 1
      // const outputDir = '/Users/zhang1/Desktop'
      // const filePrefix = 'HX'
      // const forceRefresh = false
      const results = await processor.generateMultipleVideos(count, output_video, file_prefix, force_refresh, (videoFiles, subtitleFiles, audioFiles, totalDurations) => {
        console.log(videoFiles, subtitleFiles, audioFiles, totalDurations)
        sqlitedbService.updateVideoMeta(videoFiles, subtitleFiles, audioFiles, totalDurations, id)
      }, (index) => {
        let timeNow = Date.now();
        let data = index + ':' + timeNow;
        event.reply(`${channel}`, data)
      });
      const successCount = results.filter(r => r).length;
      const failCount = results.length - successCount;
      sqlitedbService.updateGenerateVideoCount(successCount, id)
      console.log(`\n所有视频生成完成！成功: ${successCount}, 失败: ${failCount}`);
      return {
        success: true,
        successCount: successCount,
        failCount: failCount,
        message: `所有视频生成完成！成功: ${successCount}, 失败: ${failCount}`
      }
    } catch (e) {
      console.error(`视频生成过程中出错: ${e.message}`);
      return {
        success: false,
        message: `视频生成过程中出错: ${e.message}`
      }
    } finally {
      await processor.cleanup();
    }
  }
}
ExampleController.toString = () => '[class ExampleController]';

module.exports = ExampleController; 