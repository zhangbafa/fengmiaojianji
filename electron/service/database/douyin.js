"use strict";

const { BasedbService } = require("./basedb");

/**
 * sqlite数据存储
 * @class
 */
class DouyinService extends BasedbService {
  constructor() {
    const options = {
      dbname: "livehelpswiper.db",
    };
    super(options);
    this.table = "douyin";
    this.init();
  }

  /*
   * 初始化
   */
  init() {
    // 初始化数据库
    this._init();

    // 检查表是否存在
    // const masterStmt = this.db.prepare('SELECT * FROM sqlite_master WHERE type=? AND name = ?');
    // let tableExists = masterStmt.get('table', this.table);

    // 创建表
    // 假设 this.table 是合法的表名（比如 'user'），this.db 是 SQLite 实例
    const create_user_table_sql = `CREATE TABLE IF NOT EXISTS ${this.table} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 去掉多余的单引号
          direction TEXT NOT NULL,
          type TEXT NOT NULL,
          delay INTEGER NOT NULL,  -- SQLite 忽略 UNSIGNED，可移除
          speed INTEGER NOT NULL,
          lines INTEGER NOT NULL,
          goods TEXT NOT NULL,
          qiang_goods TEXT NOT NULL,
          ad_text TEXT NOT NULL
        )`;
    this.db.exec(create_user_table_sql);
  }

  /*
   * 增 Test data (sqlite)
   */
  async add(data) {
    const sql = `
      INSERT INTO ${this.table} (
        direction, type, delay, speed,lines,goods,qiang_goods,ad_text
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    console.log(data)
    const stmt = this.db.prepare(sql);
    const info = stmt.run(
      data.direction,
      data.type,
      data.delay,
      data.speed,
      data.lines,
      data.goods,
      data.qiang_goods,
      data.ad_text
    );
    return info.lastInsertRowid;
  }

  // 获取配置
  async findOne() {
    const listSql = `SELECT * FROM ${this.table} LIMIT 1 OFFSET 0`;
    const stmt = this.db.prepare(listSql);
    const rows = stmt.get();
    return rows;
  }

  // 更新配置
  async update(data) {
    // 构造更新字段（排除id、create_time，仅允许修改业务字段）
    const configId = data.id;
    const allowFields = [
      "direction",
      "type",
      "delay",
      "speed",
      "lines",
      "goods",
      "qiang_goods",
      "ad_text"
    ];
    const updateFields = [];
    const params = [];

    for (const [key, value] of Object.entries(data)) {
      if (allowFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        params.push(value);
      }
    }

    if (updateFields.length === 0) {
      return Promise.reject(
        new Error(`仅允许修改以下字段：${allowFields.join(", ")}`)
      );
    }
    const sql = `
      UPDATE ${this.table}
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `;
    params.push(configId);
    console.log(sql)
    console.log(params)
    const stmt = this.db.prepare(sql);
    const info = stmt.run(...params);
    return info.changes;
  }
}
DouyinService.toString = () => "[class DouyinService]";

module.exports = {
  DouyinService,
  DouyinService: new DouyinService(),
};
