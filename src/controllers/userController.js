import User from "../models/User";
import CryptoJS from "crypto-js";


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
         res.status(500).json(error);
    }
};

export const getAll = async (req, res) => {
  const query = req.query.new;

  try {
    const users = query 
        ? await User.find().sort({ _id: -1 }).limit(req.query.limit)
        : await User.find();
    
    res.status(200).json({
        message: "All user in this application!",
        data: users,
    });

  } catch (error) {
    res.status(500).json(error);
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
    res.status(500).json(error);
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
    res.status(500).json(error);
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
    res.status(500).json(error);
  }
};

export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);

        res.status(200).json({
            message: "User account deleted succesfully!"
        });

    } catch (error) {
         res.status(500).json(error);
    }
}

export const deleteOneUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "User account deleted succesfully!"
        });

    } catch (error) {
         res.status(500).json(error);
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
        res.status(500).json(error);
    }

}