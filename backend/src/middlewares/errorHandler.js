// backend/src/middlewares/errorHandler.js
module.exports.errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack to the console
    const statusCode = err.statusCode || 500;
    const message = err.message || 'An unexpected error occurred.';
    
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
        // Include stack trace only in development
        stack: process.env.NODE_ENV === 'development' ? err.stack : {} 
    });
};