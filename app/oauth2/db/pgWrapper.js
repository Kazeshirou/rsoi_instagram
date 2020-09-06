module.exports = {
    query: query,
};

const Pool = require("pg").Pool;

function query(queryString, cbFunc) {
    const pool = new Pool({
        user: "ntl",
        host: "localhost",
        database: "my_instagram",
        password: "",
        port: 5432,
    });

    pool.query(queryString, (error, results) => {
        cbFunc(setResponse(error, results));
    });
}

function setResponse(error, results) {
    return {
        error: error,
        results: results ? results : null,
    };
}