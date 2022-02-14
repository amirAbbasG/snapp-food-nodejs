const winston = require('winston')

exports.errorHandler = (error, req, res, next) => {
    console.log(error)
    winston.error(error.message, error)
    const status = error.statusCode || 500;
    const message = error.message;

    res.status(status).send({ message });
}

