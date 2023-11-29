import appService from '../connectDB/appService';
import JWTAction from '../middleware/JWTAction';
import { v4 as uuidv4 } from 'uuid';
import adminService from '../connectDB/adminService';

let createNewUser = async (req, res) => {
    let response = await appService.createNewUserSV(req.body);
    return res.status(200).json(response);
}

let login = async (req, res) => {
    let response = await appService.login(req.body);
    if (response.errCode === 0) {
        let token = JWTAction.createJWT(response.data);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 60 * 1000 * 10 });
    }
    return res.status(200).json(response);
}

let checkLoginJWT = async (req, res, key) => {
    try {
        let jwt = req.cookies[key];
        if (jwt) {
            let data = JWTAction.verifyJWT(jwt);
            if (data) {
                return res.status(200).json({
                    errCode: 0,
                    message: 'Islogin'
                });
            } else {
                return res.status(200).json({
                    errCode: -1,
                    message: 'IsNotLogin'
                });
            }
        }
        return res.status(200).json({
            errCode: -1,
            message: 'IsNotLogin'
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: 'IsNotLogin'
        });
    }

}

let Logout = async (req, res) => {
    try {
        let accesstoken = req.cookies.accesstoken;
        if (accesstoken) {
            res.clearCookie('accesstoken');
            res.clearCookie('refreshtoken');
            return res.status(200).json({
                errCode: 0,
                message: 'Logout success',
            })
        }
        return res.status(200).json({
            errCode: -1,
            message: 'IsNotLogin'
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: 'IsNotLogin'
        });
    }
}

let verifySSOToken = async (req, res) => {
    try {
        let sso = req?.body?.ssoToken;
        if (req?.user?.code && req.user.code === sso) {
            const refreshToken = uuidv4();
            await appService.updateToken(req?.user?.email || req?.user?.Email, refreshToken);
            let roles = await adminService.getRoleWithGroup(req.user.groupID || req.user.GroupID);
            let payload = JWTAction.createJWT({
                email: req.user.email || req.user.Email,
                roles: roles.data,
                username: req.user.username || req.user.UserName,
            });

            res.cookie('accesstoken', payload, { maxAge: 15 * 60 * 1000, httpOnly: true });
            res.cookie('refreshtoken', refreshToken, { maxAge: 15 * 60 * 1000, httpOnly: true });

            let response = {
                errCode: 0,
                message: 'Success',
                data: {
                    accessToken: payload,
                    refresh: refreshToken,
                    email: req.user.email || req.user.Email,
                    roles: roles.data,
                    username: req.user.username || req.user.UserName,
                }
            };
            req.logout();
            return res.status(200).json(response)
        } else {
            return res.status(401).json({
                errCode: 1,
                message: 'Not match'
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
    createNewUser,
    login,
    checkLoginJWT,
    Logout,
    verifySSOToken,
}