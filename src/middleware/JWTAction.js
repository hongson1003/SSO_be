import jwt from 'jsonwebtoken';
import jwtService from '../connectDB/jwtService';
import { v4 as uuidv4 } from 'uuid';
import appService from '../connectDB/appService';

const unCheck = ['/google/redirect', '/auth/google'
    , '/', '/api/register', '/login', '/logout', '/verify', '/api/login',
    '/api/check-login', '/api/clear-cookie', '/api/get-all-roles',
    '/api/create-roles', '/api/delete-role', '/api/get-all-group', '/api/role-with-group',
    '/api/add-roles-for-group', '/auth/facebook', '/facebook/redirect'
    , '/verify-sso-token'];

let createJWT = (payload) => {
    let key = process.env.JWT_SECRET;
    let token = null;
    try {
        token = jwt.sign(payload, key, { expiresIn: '1h' });
        return token;
    } catch (e) {
        console.log(e);
    }
}

let verifyJWT = (token) => {
    let key = process.env.JWT_SECRET;
    let data = null;
    try {
        data = jwt.verify(token, key);
        return data;
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            return 'TokenExpiredError';
        }
        console.log(e);
    }
}
let handleRefreshToken = async (refreshToken) => {
    let user = await jwtService.handleGetUserFromRefreshToken(refreshToken);
    let newAccesstoken = createJWT(user);
    let newRefreshtoken = uuidv4();
    await appService.updateToken(user.email, newRefreshtoken);
    return {
        newAccesstoken,
        newRefreshtoken
    }
}
let isLogin = async (req, res, next) => {
    if (unCheck.includes(req.path)) {
        return next();
    }
    try {
        let jwt = req.cookies.accesstoken;
        if (jwt) {
            let data = verifyJWT(jwt);
            if (data && data !== 'TokenExpiredError') {
                req.user = data;
                return next();
            } else {
                let refreshtoken = req.cookies.refreshtoken;
                if (refreshtoken) {
                    let obj = await handleRefreshToken(refreshtoken);
                    res.cookie('accesstoken', obj.newAccesstoken, { maxAge: 15 * 60 * 1000, httpOnly: true });
                    res.cookie('refreshtoken', obj.newRefreshtoken, { maxAge: 15 * 60 * 1000, httpOnly: true });

                    return res.status(400).json({
                        errCode: 1,
                        message: 'User isnot Authenticated',
                    })
                } else {
                    return res.status(401).json({
                        errCode: 1,
                        message: 'User isnot Authenticated',
                    })
                }

            }
        } else {
            return res.status(401).json({
                errCode: -1,
                message: 'Not found JWT',
            })
        }
    } catch (e) {
        console.log(e);
        return res.status(401).json({
            errCode: -1,
            message: 'Not found JWT',
        })
    }
}


let checkPermission = async (req, res, next) => {
    if (unCheck.includes(req.path)) {
        return next();
    }
    let temp = verifyJWT(req.roles.access);
    if (temp) {
        let roles = temp.roles;
        let path = req.path;
        if (!roles || roles.length == 0) {
            return res.status(200).json({
                errCode: 403,
                message: 'unUser Authenticated'
            })
        }
        let access = roles.some(item => item.Url === path)
        if (!access)
            return res.status(200).json({
                errCode: 403,
                message: 'unUser Authenticated'
            })
        return next();
    } else {
        return res.status(200).json({
            errCode: -1,
            message: 'UnUser Authenticated'
        })
    }
}

let checkTokenVerifySSO = async (req, res) => {
    try {
        console.log('nó vào đây trước')
        let jwt = req.body.jwt;
        console.log('sv gọi', jwt);
        if (jwt) {
            let data = verifyJWT(jwt);
            if (data) {
                return res.status(200).json({
                    errCode: 0,
                    message: 'Token exact'
                })
            } else {
                return res.status(401).json({
                    errCode: 2,
                    message: 'JWT isn"t exact !!!',
                })
            }
        } else {
            return res.status(200).json({
                errCode: 1,
                message: 'Not found jwt, user is not authenticated',
            })
        }
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from the server',
        })
    }
}




module.exports = {
    createJWT,
    verifyJWT,
    isLogin,
    checkPermission,
    checkTokenVerifySSO
}