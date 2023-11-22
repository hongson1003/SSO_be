let viewLogin = async (req, res) => {
    return res.render('login.ejs');
}

let viewHome = async (req, res) => {
    return res.render('home.ejs');
}


module.exports = {
    viewLogin,
    viewHome
}