export default (arrOld, arrNew) => {
    const deletedRoles = arrOld.filter(itemOld => !arrNew.some(itemNew => itemOld.roleID === itemNew.roleID));
    const insertedRoles = arrNew.filter(itemNew => !arrOld.some(itemOld => itemNew.roleID === itemOld.roleID));
    return { deletedRoles, insertedRoles };
}