


export const getAllUser_v = (req, res, next) => {

    const {page, offset} = req.query;


    if(Number(page) < 1){
        return res.status(422).json({
            message: "Page must be one or greater"
        });
    }

    if(offset < 0){
        return res.status(422).json({
            message: "offset must can be zero or greater"
        });
    }

    next();
    
}

