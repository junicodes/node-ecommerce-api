import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const UserSchema = new mongoose.Schema(
    {
        firstname: {type: String},
        lastname: {type: String},
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        isAdmin: {
            type: Boolean,
            default: false
        },
    },
    {timestamps: true}
);

UserSchema.plugin(mongoosePaginate);

export default mongoose.model("users", UserSchema)