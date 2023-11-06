import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, require: true },
    email: { type: String, require: true },
    authentication: {
        password: { type: String, require: true, select: false, },
        salt: { type: String, require: true, select: false, },
        sessionToken: { type: String, require: true, select: false, },
    }
});

export const UserModel = mongoose.model('User', userSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserByUsername = (username: string) => UserModel.findOne({ username });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({
    'authentication.sessionToken': sessionToken,
});

export const getUserById = (userid: string) => UserModel.findById(userid);
export const createUser = (values: Record<string, any>) => new UserModel(values)
    .save().then((user => user.toObject()));
export const deleteUserById = (userid: string) => UserModel.findOneAndDelete({ _id: userid });
export const updateUserById = (userid: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(userid, values)
