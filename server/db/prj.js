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
        const sqlStr = 'SELECT *, (SELECT COUNT(*) FROM project) AS total FROM project ORDER BY eval_time DESC LIMIT ?, ?';
        conn.query(sqlStr, [start, pageSize], (err, results) => {
            if(err) return console.log(err.message);
            callback(results, conn)
        });
    },
    queryByID: (params, callback) => {
        const sqlStr = 'SELECT * FROM project WHERE prj_id=?';
        conn.query(sqlStr, params.prj_id, (err, results) => {
            if(err) return console.log(err.message)
            callback(results)
        })
    }
};

module.exports = PrjTbl;