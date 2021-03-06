const mysql = require('mysql')
const {
    MY_SQL_CONF
} = require('../config')

/* 初始化数据连接 */
const con = mysql.createConnection(MY_SQL_CONF)
con.config.queryFormat = function(query, values) {
    if (!values) return query;
    return query.replace(/\:(\w+)/g, function(txt, key) {
        if (values.hasOwnProperty(key)) {
            return this.escape(values[key]);
        }
        return txt;
    }.bind(this));
};
/* 连接数据库 */
con.connect()

function exec(sql, params) {
    return new Promise((resolve, reject) => {
        con.query(sql, params, (err, result) => {
            if (err) {
                reject(err)
                return
            }
            resolve(result)
        })
    })
}

module.exports = {
    exec,
    // escape: mysql.escape
}