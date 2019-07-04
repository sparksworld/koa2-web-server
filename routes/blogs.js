const router = require('koa-router')()
// const sleep = (t) => new Promise(resolve => setTimeout(resolve, t))
const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')
const {
    getBlogList,
    getBlogDetail,
    createBlog,
    updateBlog,
    deleteBolog
} = require('../controller/blogs')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')



router.get('/list', async (ctx, next) => {
    const list = await getBlogList(ctx.query)
    if (list) {
        ctx.body = new SuccessModel(list)
    } else {
        ctx.body = new ErrorModel('获取失败')
    }
})

router.get('/detail', async (ctx, next) => {
    const detail = await getBlogDetail(ctx.query.id || -1)
    if (detail) {
        ctx.body = new SuccessModel(detail)
    } else {
        ctx.body = new ErrorModel('获取失败')
    }
})

router.post('/new', loginCheck, async (ctx, next) => {
    ctx.request.body['author'] = ctx.userInfo.username
    const createId = await createBlog(ctx.request.body)
    if (createId) {
        ctx.body = new SuccessModel(createId)
    } else {
        ctx.body = new ErrorModel('创建失败')
    }
})
router.post('/update', loginCheck, async (ctx, next) => {
    ctx.request.body['author'] = ctx.userInfo.username
    const isUpdate = await updateBlog(ctx.request.body)
    if (isUpdate) {
        ctx.body = new SuccessModel('更新成功')
    } else {
        ctx.body = new ErrorModel('更新失败')
    }
})

router.post('/delete', loginCheck, async (ctx, next) => {
    const id = ctx.request.body.id || -1
    const author = ctx.userInfo.username || ''
    const isDelete = await deleteBolog(id, author)
    if (isDelete) {
        ctx.body = new SuccessModel('删除成功')
    } else {
        ctx.body = new ErrorModel('删除失败')
    }
})

module.exports = router