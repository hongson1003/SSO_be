import express from "express";
import appController from '../controllers/appController';
import userController from '../controllers/userController';
import adminController from '../controllers/adminController';
import viewController from '../controllers/viewController';
import passport from "passport";
import checkLogin from '../middleware/checkLogin';
import JWTAction from '../middleware/JWTAction';

let router = express.Router();

const InitWebRoutes = (app) => {
    router.all('*', JWTAction.isLogin, JWTAction.checkPermission);


    router.get('/', viewController.viewHome);
    router.get('/login', checkLogin.isLogin, viewController.viewLogin);
    router.post('/api/account', userController.checkAccount);
    router.post('/login', function (req, res, next) {
        passport.authenticate('local', function (error, user, info) {
            if (error) {
                return res.status(500).json(error);
            }
            if (!user) {
                return res.status(401).json(info);
            }
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                }
                let origin = req.body.origin;
                return res.status(200).json({
                    ...user,
                    origin
                });
            });

        })(req, res, next);
    });
    router.post('/verify', appController.verifySSOToken);

    router.post('/logout', function (req, res, next) {
        req.logout();
        return res.redirect('/login');
    });




    router.get('/api/check-login', appController.checkLoginJWT);





    // api apiiiiii

    router.post('/api/register', appController.createNewUser);
    router.get('/api/get-all-users', userController.getAllUsers)
    router.post('/api/login', appController.login);
    router.get('/api/get-user-with-page', adminController.readUser);
    router.delete('/api/delete-user', adminController.deleteUser);
    router.get('/api/get-all-group', adminController.getAllGroup);
    router.post('/api/new-user', adminController.newUser);
    router.put('/api/update-user', adminController.updateUser);

    router.get('/api/clear-cookie', appController.Logout);
    router.get('/api/get-all-roles', adminController.getAllRoles);
    router.post('/api/create-roles', adminController.createRoles);
    router.delete('/api/delete-role', adminController.deleteRole);
    router.get('/api/role-with-group', adminController.getRoleWithGroup);
    router.post('/api/add-roles-for-group', adminController.addRolesForGroup);



    return app.use('/', router);
}

export default InitWebRoutes;