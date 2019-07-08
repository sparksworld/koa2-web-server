const {
    get
} = require('../db/redis')
module.exports = async function(ctx, next) {
    ctx.token = ctx.query.token || `${Date.now()}_${Math.random().toString().slice(2)}`
    const userinfo = await get(ctx.token)
    if (userinfo) {
        ctx.userInfo = userinfo
    } else {
        ctx.userInfo = {}
    }
    await next()
}