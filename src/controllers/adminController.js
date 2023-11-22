import adminService from '../connectDB/adminService';

let newUser = async (req, res) => {
    let response = await adminService.newUserSV(req.body);
    return res.status(200).json(response);
}
let readUser = async (req, res) => {
    let { itemsPerPage, offset } = req.query;
    let response = await adminService.getUsersWithPageOffset(+itemsPerPage, +offset);
    return res.status(200).json(response);
}

let deleteUser = async (req, res) => {
    let response = await adminService.dropUser(+req.query.id);
    return res.status(200).json(response);
}

let getAllGroup = async (req, res) => {
    let response = await adminService.getAllGroupUser();
    return res.status(200).json(response);
}
let updateUser = async (req, res) => {
    let response = await adminService.editUser(req.body.data);
    return res.status(200).json(response);
}

let getAllRoles = async (req, res) => {
    let response = await adminService.getAllRoles();
    return res.status(200).json(response);
}
let createRoles = async (req, res) => {
    let response = await adminService.createRoles(req.body);
    return res.status(200).json(response);
}

let deleteRole = async (req, res) => {
    let response = await adminService.deleteRole(+req.query.roleID);
    return res.status(200).json(response);
}

let getRoleWithGroup = async (req, res) => {
    let response = await adminService.getRoleWithGroup(req.query.groupID);
    return res.status(200).json(response);
}

let addRolesForGroup = async (req, res) => {
    let response = await adminService.addRolesForGroup(req.body);
    return res.status(200).json(response);
}

module.exports = {
    newUser,
    updateUser,
    deleteUser,
    readUser,
    getAllGroup,
    getAllRoles,
    createRoles,
    deleteRole,
    getRoleWithGroup,
    addRolesForGroup
}