const conn = require('./db')

const PrjTbl = {
    addPrj: (params, callback) => {
        const project = {
            ...params
        };
        const sqlStr = 'insert into project set ?';
        conn.query(sqlStr, project, (err, results) => {
            if(err) return console.log(err.message);
            callback(results)
        })
    },
    delPrj: (params, callback) => {
        const sqlStr = 'delete from project where prj_id=?';
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
            console.log('queryByPage')
            callback(results, conn)
        });
    }
};

module.exports = PrjTbl;