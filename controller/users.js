const {
    exec
} = require('../db/mysql')
const {
    COMPARE
} = require('../utils/bcrypt')

const TRY = require('../utils/try')
const login = async (username, password) => {
    let sql = `select username, password, realname from users where username=:username;`
    let [err, data] = await TRY(exec(sql, {
        username: username
    }))
    if(err) {
        return false
    }else {
        if(data.length > 0) {
            return await COMPARE(password, data[0].password)
        }else {
            return false
        }
    }
}
const register = async (registerData) => {
    let sql = `insert into users (username, password, realname) values (:username, :password, :realname);`
    let [err, data] = await TRY(exec(sql, {
        username: registerData.username,
        password: registerData.password,
        realname: registerData.realname
    }))
    if (err) {
        let {
            sql,
            ..._err
        } = err
        return _err
    } else {
        return {
            id: data.insertId
        }
    }
}

const changepw = async (username, newpw) => {
    let sql = `update users set password=:password where username=:username`
    let [err, data] = await TRY(exec(sql, {
        password: newpw,
        username: username
    }))
    if (err) {
        let {
            sql,
            ..._err
        } = err
        return _err
    } else {
        if (data.affectedRows > 0) {
            return true
        }
        return false
    }
}

module.exports = {
    login,
    register,
    changepw
}