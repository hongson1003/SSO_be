import userService from '../connectDB/userService';
// import { v4 as uuidv4 } from 'uuid';
import JWTAction from '../middleware/JWTAction';


let getAllUsers = async (req, res) => {
    let response = await userService.getAllUsersSV();
    return res.status(200).json(response);
}

let checkAccount = async (req, res) => {
    try {

        if (req.cookies.accesstoken) {
            // await appService.updateToken(req?.user?.email, refreshToken);
            let decoded = JWTAction.verifyJWT(req.cookies.accesstoken);
            // continue
            let response = {
                errCode: 0,
                message: 'Success',
                data: decoded,
            };
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                errCode: 1,
                message: 'isNotAuthenticated'
            })
        }
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from the server'
        });
    }
}

module.exports = {
    getAllUsers,
    checkAccount
}