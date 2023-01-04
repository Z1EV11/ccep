const conn = require('./db')

const PrjTbl = {
    addPrj: (params, callback) => {
        const project = {
            ...params
        };
        const sqlStr = 'INSERT INTO project SET ?';
        conn.query(sqlStr, project, (err, results) => {
            if(err) return console.log(err.message);
            callback(results)                                                                                            
        })
    },
    delPrj: (params, callback) => {
        const sqlStr = 'DELETE FROM project WHERE prj_id=?';
        conn.query(sqlStr, params.prj_id, (err, results) => {
            if(err) return console.log(err.message)
            callback(results)
        })
    },
    queryByPage: (params, callback) => {
        const pageSize = params.pageSize;
        const start = (params.pageNo-1)*pageSize;
        const account = params.user_account;
        const sqlStr = `
            SELECT project.*, user.*, (
                SELECT COUNT(1)
                FROM project 
                    LEFT JOIN user ON project.eval_expert = user.usr_account
                WHERE user.usr_account = ? OR user.role_id > (SELECT role_id FROM user WHERE usr_account = ?)
                ORDER BY eval_time DESC
            ) AS total
            FROM project 
            LEFT JOIN user ON project.eval_expert = user.usr_account
            WHERE user.usr_account = ? OR user.role_id > (SELECT role_id FROM user WHERE usr_account = ?)
            ORDER BY eval_time DESC
            LIMIT ?, ?;
        `;
        conn.query(sqlStr, [account,account, account,account, start, pageSize], (err, results) => {
            if(err) return console.log(err.message);
            callback(results, conn)
        });
    },
    queryByID: (params, callback) => {
        const sqlStr = `
            SELECT *
            FROM project INNER JOIN user
            ON project.eval_expert = user.usr_account
            WHERE project.prj_id=?;
        `;
        // const sqlStr = 'SELECT * FROM project WHERE prj_id=?';
        conn.query(sqlStr, params.prj_id, (err, results) => {
            if(err) return console.log(err.message)
            callback(results)
        })
    }
};

module.exports = PrjTbl;