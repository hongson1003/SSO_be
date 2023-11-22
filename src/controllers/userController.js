import userService from '../connectDB/userService';


let getAllUsers = async (req, res) => {
    let response = await userService.getAllUsersSV();
    return res.status(200).json(response);
}

module.exports = {
    getAllUsers
}