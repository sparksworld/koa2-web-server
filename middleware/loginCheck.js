const {
    ErrorModel
} = require('../model/resModel')
module.exports = async (ctx, next) => {
    if (ctx.userInfo.username) {
        await next()
    } else {
        ctx.body = new ErrorModel('尚未登录')
    }
}