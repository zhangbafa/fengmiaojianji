'use strict';

const { BasedbService } = require('./basedb');

/**
 * sqlite数据存储
 * @class
 */
class DouyinService extends BasedbService {

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
        `electron/service/database/sqlitedb.js`
      this.db.exec(create_user_table_sql);
    }
  }

  /*
   * 增 Test data (sqlite)
   */
  async saveConfig(data) {}

  // 获取配置
  async getConfig(configId) {}


  // 更新配置
  async updateConfig(configId, data) {}
}
DouyinService.toString = () => '[class DouyinService]';

module.exports = {
  DouyinService,
  DouyinService: new DouyinService()
};
