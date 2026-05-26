const errorHandler =(err, req, res, next) => {
    console.error('error no manejado', err.stack);

    res.status(err.status || 500).json({
        success:false,
        message:err.message || 'error interno del servidor',
        //...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
module.exports=errorHandler;