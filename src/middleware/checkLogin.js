const isLogin = async (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.path === '/') {
            return next();
        } else {
            return res.redirect('/');
        }
    }
    if (req.path === '/') {
        return res.redirect('/login');
    } else {
        return next();
    }

}

module.exports = {
    isLogin,
}