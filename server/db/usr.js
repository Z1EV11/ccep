const conn = require('./db')

const UsrTbl = {
    addUsr: (params, callback) => {
        const user = {
            ...params
        };
        const sqlStr = 'INSERT INTO user SET ?';
        conn.query(sqlStr, project, (err, results) => {
            if(err) return console.log(err.message);
            callback(results)                                                                                            
        })
    },
    delUsr: (params, callback) => {
        const sqlStr = 'DELETE FROM user WHERE prj_id=?';
        conn.query(sqlStr, params.usr_account, (err, results) => {
            if(err) return console.log(err.message)
            callback(results)
        })
    },
    queryByPage: (params, callback) => {
        const pageSize = params.pageSize;
        const start = (params.pageNo-1)*pageSize;
        const sqlStr = 'SELECT usr_account, usr_name, usr_auth, (SELECT COUNT(*) FROM user) AS total FROM user WHERE usr_auth > 0 LIMIT ?, ?';
        conn.query(sqlStr, [start, pageSize], (err, results) => {
            if(err) return console.log(err.message);
            callback(results, conn)
        });
    },
    queryByID: (params, callback) => {
        const sqlStr = 'SELECT usr_name, usr_auth FROM user WHERE usr_account=? and usr_pwd=?';
        conn.query(sqlStr, params.usr_account, (err, results) => {
            if(err) return console.log(err.message)
            callback(results)
        })
    }
};

module.exports = UsrTbl;