const {
    exec,
    escape
} = require('../db/mysql')

const getBlogList = async (listData) => {
    let author = listData.author || ''
    let keyword = listData.keyword || ''
    let page = Number(listData.page) || 1
    let pageSize = Number(listData.pageSize) || 2

    let allsql = `select count(*) from blogs`
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author=:author `
    }
    if (keyword) {
        sql += `and title like :keyword `
    }
    sql += `order by createtime desc limit :start, :offset`
    /*  [author, `%${keyword}%` */
    let _length = await exec(allsql)
    let _list = await exec(sql, {
        author: author,
        keyword: `%${keyword}%`,
        start: (page - 1) * pageSize,
        offset: pageSize
    })
    return {
        list: _list,
        count: _length[0]['count(*)'],
    }
}
const getBlogDetail = async (id) => {
    let sql = `select * from blogs where id=:id`
    let data = await exec(sql, {
        id: id
    })
    if (data.length > 0) {
        return data[0]
    } else {
        return ''
    }
}

const createBlog = async (blogData) => {
    let sql = `
        insert into blogs (title, content, createtime, author) 
        values
        (:title, :content, :createtime, :author);
    `
    let title = blogData.title;
    let content = blogData.content
    let author = blogData.author
    let createtime = Date.now()
    if (title && content && author) {
        let data = await exec(sql, {
            title: title,
            content: content,
            createtime: createtime,
            author: author
        })
        return {
            id: data.insertId
        }
    } else {
        return ''
    }
    // let sql = `insert into blogs (title, content, createtime, author) values ('${title}', '${content}', '${createtime}', '${author}');`


    /* 插入成功返回id */
    // return {
    //     id: 3
    // }
}
const updateBlog = async (blogData) => {
    /* 更新成功返回id */
    let {
        id,
        content,
        title,
        author
    } = blogData
    let sql = `
        update blogs
        set
        title=:title, content=:content
        where
        id=:id
        and
        author=:author
    `

    let data = await exec(sql, {
        title: title,
        content: content,
        id: id,
        author: author
    })
    if (data.affectedRows > 0) {
        return true
    }
    return false
    // return await exec(sql, {
    //     title: title,
    //     content: content,
    //     id: id
    // }).then((data) => {
    //     if (data.affectedRows > 0) {
    //         return true
    //     }
    //     return false
    // })
    // return true
}
const deleteBolog = async (id, author) => {
    let sql = `delete from blogs where id=:id and author=:author`
    let data = await exec(sql, {
        id: id,
        author: author
    })
    if (data.affectedRows > 0) {
        return true
    }
    return false
    // return await exec(sql, {
    //     id: id,
    //     author: author
    // }).then(data => {
    //     if (data.affectedRows > 0) {
    //         return true
    //     }
    //     return false
    // })
}



module.exports = {
    getBlogList,
    getBlogDetail,
    createBlog,
    updateBlog,
    deleteBolog
}