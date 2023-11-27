let viewLogin = async (req, res) => {
    var redirectURL = req.query?.serviceURL?.split('?')?.[0];
    return res.render('login.ejs', { redirectURL: JSON.stringify(redirectURL) || '' });
}

let viewHome = async (req, res) => {
    return res.render('home.ejs');
}


module.exports = {
    viewLogin,
    viewHome
}