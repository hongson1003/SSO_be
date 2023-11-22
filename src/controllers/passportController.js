import LocalStrategy from 'passport-local';
import passport from 'passport';
import appService from '../connectDB/appService';

let configPassportLocal = async () => {
    passport.use(new LocalStrategy({
        passReqToCallback: true
    }, async (req, username, password, cb) => {
        let user = {
            accountName: username,
            password
        }
        let response = await appService.login(user);
        if (response.errCode === 0) {
            return cb(null, response.data);
        } else {
            return cb(null, false, response.message);
        }
    }));
}

module.exports = {
    configPassportLocal,
}

