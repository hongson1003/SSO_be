import passport from "passport";
require('dotenv').config();
import FacebookStrategy from 'passport-facebook';
import appService from '../connectDB/appService';
import { v4 as uuidv4 } from 'uuid';


const configFacebook = async () => {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_APP_REDIRECT,
        profileFields: ['id', 'displayName', 'link', 'photos', 'email']
    },
        async function (accessToken, refreshToken, profile, cb) {
            let rawData = {
                username: profile.displayName,
                email: profile.emails?.[0].value || profile.id,
            }
            let user = await appService.upsertSocialMedia('Facebook', rawData);
            const ref = uuidv4();
            user.code = ref;
            return cb(null, user);
        }
    ));
}

module.exports = {
    configFacebook
}