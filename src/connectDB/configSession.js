import session from 'express-session';
import passport from 'passport';
import Knex from 'knex';
import KnexSessionStore from 'connect-session-knex';


let configSession = async (app) => {
    const knex = Knex({
        client: 'mssql',
        connection: {
            user: 'sa',
            password: '123456',
            server: 'localhost',
            database: 'jwt',
            options: {
                encrypt: false,
            },
        },
    });
    const store = new (KnexSessionStore(session))({
        knex,
        tablename: 'sessions',
        sidfieldname: 'sid',
        clearInterval: 30 * 15 * 1000,
    });
    app.use(session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: true,
        store,
        cookie: {
            maxAge: 30 * 1000,
            rolling: true,
            unset: 'destroy',
            secure: false
        },
    }));

    app.use(passport.session());
    app.use(passport.authenticate('session'));

    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user);
        });
    });

    passport.deserializeUser(function (user, cb) {
        process.nextTick(function () {

            return cb(null, user);
        });
    });


}

export default configSession;