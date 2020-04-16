// 将通用工具模块引入
var commonUtils = require('util/commonUtils')
// 引入头部导航nav
require('page/common/nav/index.js')
// 引入通用的header
require('page/common/header/index.js')
// 引入侧边栏nav-side
const navSide = require('page/common/nav-side/index.js')

navSide.init({
  name:'order-list'
});

