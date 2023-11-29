require('dotenv').config();
var GoogleStrategy = require('passport-google-oauth20').Strategy;
import passport from 'passport';
import appService from '../connectDB/appService';
import { v4 as uuidv4 } from 'uuid';

const configLoginWithGG = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_APP_CLIENT_ID,
        clientSecret: process.env.GOOGLE_APP_SECRET,
        callbackURL: process.env.GOOGLE_APP_REDIRECT
    },
        async function (accessToken, refreshToken, profile, cb) {
            let rawData = {
                username: profile.displayName,
                email: profile.emails?.[0].value || profile.id,
            }
            let user = await appService.upsertSocialMedia('Google', rawData);
            const ref = uuidv4();
            user.code = ref;
            return cb(null, user);
        }
    ));
}
module.exports = {
    configLoginWithGG
}

