import appService from '../connectDB/appService';
import JWTAction from '../middleware/JWTAction';

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

let checkLoginJWT = async (req, res) => {
    try {
        let jwt = req.cookies.jwt;
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
        let jwt = req.cookies.jwt;
        if (jwt) {
            res.clearCookie('jwt');
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


module.exports = {
    createNewUser,
    login,
    checkLoginJWT,
    Logout
}