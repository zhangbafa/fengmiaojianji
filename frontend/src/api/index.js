
/**
 * 主进程与渲染进程通信频道定义
 * Definition of communication channels between main process and rendering process
 */
const ipcApiRoute = {
  allList: 'controller/example/allList',
  generateMultipleVideos: 'controller/example/generateMultipleVideos',
  deleteConfig: 'controller/example/deleteConfig',
  saveConfig: 'controller/example/saveConfig',
  updateConfig: 'controller/example/updateConfig'
}

export {
  ipcApiRoute
}

