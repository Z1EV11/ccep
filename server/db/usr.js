const conn = require('./db')

const UsrTbl = {
    addUsr: (params, callback) => {
        const user = {
            ...params
        };
        const sqlStr = 'INSERT INTO user SET ?';
        conn.query(sqlStr, user, (err, results) => {
            if(err) return console.log(err.message);
            callback(results)                                                                                            
        })
    },
    delUsr: (params, callback) => {
        const sqlStr = 'DELETE FROM user WHERE usr_account = ?';
        conn.query(sqlStr, params.usr_account, (err, results) => {
            if(err) return console.log(err.message)
            callback(results)
        })
    },
    updateUsr: (params, callback) => {
        const sqlParams = [params.role_id, params.usr_name, params.usr_tel, params.usr_account];
        const sqlStr = `
            UPDATE user
            SET role_id=?, usr_name=?, usr_tel=?
            WHERE usr_account=?
        `;
        conn.query(sqlStr, sqlParams, (err, results) => {
            if(err) return console.log(err.message)
            callback(results)
        })
    },
    queryByPage: (params, callback) => {
        const pageSize = params.pageSize;
        const start = (params.pageNo-1)*pageSize;
        const user_account = params.usr_account;
        const sqlStr = `
            SELECT usr_account, usr_name, usr_tel, role_corp, role_name, user.role_id, (
                SELECT COUNT(1)
                FROM user
                WHERE role_id >= (SELECT role_id FROM user WHERE usr_account = ?)
            ) as total
            FROM user
                LEFT JOIN role ON role.role_id = user.role_id
            WHERE user.role_id >= (SELECT role_id FROM user WHERE usr_account = ?)
            LIMIT ?, ?;
        `;
        conn.query(sqlStr, [user_account, user_account, start, pageSize], (err, results) => {
            if(err) return console.log(err.message);
            callback(results, conn)
        });
    },
    queryByPwd: (params, callback) => {
        const sqlStr = 'SELECT usr_account, usr_name, role_id FROM user WHERE usr_account=? and usr_pwd=?';
        conn.query(sqlStr, [params.usr_account, params.usr_pwd], (err, results) => {
            if(err) return console.log(err.message)
            callback(results)
        })
    },
    queryByID: (params, callback) => {
        const sqlStr = 'SELECT usr_account, usr_name FROM user WHERE usr_account=?';
        conn.query(sqlStr, params.usr_account, (err, results) => {
            if(err) return console.log(err.message)
            callback(results)
        })
    },
    updatePwd: (params, callback) => {
        const sqlParams = [params.pwd, params.usr_account, params.pwd0];
        const sqlStr = `
            UPDATE user
            SET usr_pwd=?
            WHERE usr_account=? AND usr_pwd = ?
        `;
        conn.query(sqlStr, sqlParams, (err, results) => {
            if(err) return console.log(err.message)
            callback(results)
        })
    }
};

module.exports = UsrTbl;