const errorHandler = (err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({ message: 'error server' });
}

module.exports = errorHandler;
