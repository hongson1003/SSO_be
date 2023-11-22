import jwt from 'jsonwebtoken';
const unCheck = ['/', '/api/register', '/api/login', '/api/check-login', '/api/clear-cookie', '/api/get-all-roles', '/api/create-roles', '/api/delete-role', '/api/get-all-group', '/api/role-with-group', '/api/add-roles-for-group'];

let createJWT = (payload) => {
    let key = process.env.JWT_SECRET;
    let token = null;
    try {
        token = jwt.sign(payload, key);
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
        console.log(e);
    }
}
let isLogin = async (req, res, next) => {
    if (unCheck.includes(req.path)) {
        return next();
    }

    let jwt = req.cookies.jwt;
    if (jwt) {
        let data = verifyJWT(jwt);
        if (data) {
            req.roles = data;
            return next();
        } else {
            return res.status(401).json({
                errCode: -1,
                message: 'User is Authenticated',
            })
        }
    } else {
        return res.status(200).json({
            errCode: -1,
            message: 'User is Authenticated',
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

module.exports = {
    createJWT,
    verifyJWT,
    isLogin,
    checkPermission
}