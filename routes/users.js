const router = require('koa-router')()
const md5 = require('md5')
const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')
const {
    login,
    register,
    changepw
} = require('../controller/users')
const {
    ADD_SALT
} = require('../utils/bcrypt')
const {
    set
} = require('../db/redis')

router.prefix('/api/user')

router.post('/login', async function(ctx, next) {
    let {
        username,
        password
    } = ctx.request.body
    let checkPWD = await login(username, password)
    if (checkPWD) {
        const token = md5(`username=${username}&password=${password}&${Date.now()}`)
        set(token, {
            username: username
        }, 'EX', 60 * 60 * 24)
        ctx.body = new SuccessModel({
            token: token
        })
    } else {
        ctx.body = new ErrorModel("登录失败")
    }
})

router.post('/register', async function(ctx, next) {
    let {
        username,
        password,
        realname
    } = ctx.request.body
    if (username && password && realname) {
        let hash = await ADD_SALT(password)
        ctx.request.body['password'] = hash
        let result = await register(ctx.request.body)
        if (result.id) {
            ctx.body = new SuccessModel(result)
        } else {
            ctx.body = new ErrorModel(result)
        }
    } else {
        ctx.body = new ErrorModel('缺少参数')
    }
})

router.post('/changepw', async function(ctx, next) {
    let {
        username,
        oldpassword,
        newpassword
    } = ctx.request.body

    if (username && oldpassword && newpassword) {
        let checkPWD = await login(username, oldpassword)
        if (checkPWD) {
            let saltpw = await ADD_SALT(newpassword)
            let data = await changepw(username, saltpw)
            if (data) {
                ctx.body = new SuccessModel('更新成功')
            } else {
                ctx.body = new ErrorModel('更新失败')
            }
        } else {
            ctx.body = new ErrorModel('更新失败')
        }
    } else {
        ctx.body = new ErrorModel('缺少参数')
    }
})

module.exports = router