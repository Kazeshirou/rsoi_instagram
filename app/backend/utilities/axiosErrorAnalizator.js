const { AxiosError } = require('./customErrors');

module.exports = (msg, err) => {
    if (err.response) {
        return new AxiosError(msg, { status: err.response.status, body: err.response.data });
    } else if (err.request) {
        return new AxiosError(msg, err.request);
    } else {
        return new AxiosError(msg, err.message);
    }
}