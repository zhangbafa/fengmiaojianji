'use strict';

const { exampleService } = require('../service/example');
const { DouyinService } = require('../service/database/douyin');
const { windowService } = require('../service/window');
const OptimizedVideoProcessor = require('./videoProcessor');
const Utils = require('ee-core/utils');
const fetch = require('node-fetch');
// import fetch from 'node-fetch';
/**
 * example
 * @class
 */
class DouyinController {

  async add(args,event){
    const result = await DouyinService.add(args)
    return result
  }
  /**
   * 所有方法接收两个参数
   * @param args 前端传的参数
   * @param event - ipc通信时才有值。详情见：控制器文档
   */
  async findOne() {
    const result = await DouyinService.findOne();
    return result;
  }


  // update
  async update(args, event) {
    const result = await DouyinService.update(args)
    return result
  }
  
  //close window
  async closeWindow(args, event) {
    const result = await windowService.closeWindow(args.windowName)
    return result
  }
}
DouyinController.toString = () => '[class DouyinController]';

module.exports = DouyinController; 