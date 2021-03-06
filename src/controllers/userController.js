import User from "../models/User";
import CryptoJS from "crypto-js";
const { PaginationParameters } = require('mongoose-paginate-v2');

export const getCurrent = (req, res) => {

    const {password, ...others} = req.user.user;

    res.status(200).json({
        message: "Current User payload",
        data: others,
    });
};

export const getOne = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const {password, ...others} = user._doc;

        res.status(200).json({
            message: "User account deleted succesfully!",
            data: others
        });

    } catch (error) {
         res.status(500).json(error.message);
    }
};

export const getAll = async (req, res) => {

  const options = {
    // select: 'title date author',
    sort: { _id: -1 },
    lean: true,
    allowDiskUse: true,
    forceCountFn: true,

  };

  req.query = {...req.query, ...options};

  try {

    //fetch payload in decending order
    const users = await User.paginate(...new PaginationParameters(req).get()).then((result) => result );
    
    res.status(200).json({
        message: "All user found!",
        data: users,
    });

  } catch (error) {
    console.log(error)
    res.status(500).json(error.mesage);
  }
};

export const update = async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({
      message: "User Profile updated succesfully!",
      data: updateUser,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const updatePassword = async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_REC
    ).toString();
  }

  try {
    const updatePass = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Password updated succesfully!",
      data: updatePass,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//Only Admin
export const updateEmail = (req, res) => {
  try {
    res.status(200).json({
      message: "Email updated succesfully!",
      data: {},
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const destroyAllUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);

        res.status(200).json({
            message: "User account deleted succesfully!"
        });

    } catch (error) {
         res.status(500).json(error.message);
    }
}

export const destroy = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "User account deleted succesfully!"
        });

    } catch (error) {
         res.status(500).json(error.message);
    }
}

export const getUserStat = async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

    try {
        //User aggregate 
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt"},
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1}
                }
            }
        ]);
        res.status(200).json({
            message: "User statistic loaded succesfully!",
            data
        });
    } catch (error) {
        res.status(500).json(error.message);
    }

}