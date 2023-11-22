import buildAssignRoles from "../ultis/buildAssignRoles";
import existEmailOrPhone from "../ultis/existEmailOrPhone";
import ConfigSQl from "./ConfigSQl";
import sql from 'mssql';

let newUserSV = async (data) => {
    try {
        await sql.connect(ConfigSQl);
        const request = new sql.Request();
        request.input('Email', sql.NVarChar, data.email);
        request.input('Phone', sql.NVarChar, '-1');
        // check email or phone
        let isExists = await existEmailOrPhone(request);
        if (isExists.length > 0) {
            return {
                errCode: 1,
                message: 'Duplicate email or phone'
            }
        }
        await sql.query(`
            INSERT INTO [User] (Email, Password, GroupID)
            VALUES ('${data.email}', '${data.password}', '${data.groupID}')
        `);
        await sql.close();
        return {
            message: 'New user success',
            errCode: 0,
        }
    } catch (e) {
        console.log(e);
        return {
            errCode: -1,
            message: 'Error from the server'
        }
    }
}
let getUsersWithPageOffset = async (itemsPerPage, offset) => {
    try {
        await sql.connect(ConfigSQl);
        const result = await sql.query(`
            SELECT US.userID, US.userName, US.email, US.phone, US.groupID, US.address, G.name, US.password
            FROM [User] AS US
            LEFT JOIN [Group] as G on G.GroupID = US.GroupID
            ORDER BY userID
            OFFSET ${offset} ROWS
            FETCH next ${itemsPerPage} ROWS ONLY;
        `);
        const count = await sql.query`
            SELECT COUNT(*) as SoLuong
            FROM [User]
        `;
        await sql.close();
        if (result) {
            return {
                message: 'Get users success with page ',
                errCode: 0,
                data: {
                    rows: count.recordset[0].SoLuong,
                    users: result.recordset
                }
            }
        } else
            return {
                message: 'Not found any user',
                errCode: 1,
            }

    } catch (e) {
        console.log(e);
        return {
            errCode: -1,
            message: 'Error from the server'
        }
    }
}
let dropUser = async (id) => {
    try {
        await sql.connect(ConfigSQl);
        await sql.query(`
            DELETE FROM [User]
            WHERE UserID = ${id}
        `);
        await sql.close();
        return {
            message: 'Delete user success',
            errCode: 0,
        }
    } catch (e) {
        console.log(e);
        return {
            errCode: -1,
            message: 'Error from the server'
        }
    }
}

let getAllGroupUser = async () => {
    try {
        await sql.connect(ConfigSQl);
        const result = await sql.query(`
            SELECT G.GroupID, G.Name
            FROM [Group] AS g
        `);
        await sql.close();
        return {
            message: 'Get all group success ',
            errCode: 0,
            data: result.recordset
        }

    } catch (e) {
        console.log(e);
        return {
            errCode: -1,
            message: 'Error from the server'
        }
    }
}

let editUser = async (data) => {
    try {
        await sql.connect(ConfigSQl);
        await sql.query(`
           UPDATE [User]
           SET GroupID = ${data.groupID}
           WHERE UserID = ${data.userID}
        `);
        await sql.close();
        return {
            message: 'Update User success',
            errCode: 0,
        }

    } catch (e) {
        console.log(e);
        return {
            errCode: -1,
            message: 'Error from the server'
        }
    }
}

let getAllRoles = async () => {
    try {
        await sql.connect(ConfigSQl);
        let result = await sql.query(`
            select roleID, url, description
            from Role
        `);
        await sql.close();
        return {
            message: 'Get all roles success',
            errCode: 0,
            data: result.recordset,
        }
    } catch (e) {
        console.log(e);
        return {
            errCode: -1,
            message: 'Error from the server'
        }
    }
}
// check role
let listRoles = async () => {
    try {
        await sql.connect(ConfigSQl);
        let result = await sql.query(`
            select roleID, url, description
            from Role
        `);
        return result.recordset;
    } catch (e) {
        console.log(e);
    }
}


let createRoles = async (data) => {
    try {
        if (data.length) {
            await sql.connect(ConfigSQl);
            const request = new sql.Request();
            let query = '';
            let roles = await listRoles();
            roles = roles.map(item => item.url)
            data.forEach(async item => {
                let isDupplicated = roles.some(k => k === item.url)
                if (!isDupplicated) {
                    query += `INSERT INTO Role (url, description)
                    VALUES ('${item.url}', N'${item.moTa}' )
                    `
                }
            })
            await request.query(query);
            await sql.close();
            return {
                message: 'add role success',
                errCode: 0,
            };
        } else {
            return {
                message: 'Not found any role',
                errCode: 1,
            };
        }

    } catch (e) {
        console.log(e);
        return {
            errCode: -1,
            message: 'Error from the server'
        };
    }
};

let deleteRole = async (roleID) => {
    try {
        await sql.connect(ConfigSQl);
        let result = await sql.query(`
            delete from Role
            where RoleID = ${roleID}
        `);
        return {
            errCode: 0,
            message: 'Delete role success'
        }
    } catch (e) {
        console.log(e);
        return {
            message: 'Error from the server',
            errCode: -1,
        }
    }
}

let getRoleWithGroup = async (groupID) => {
    try {
        await sql.connect(ConfigSQl);
        let result = await sql.query(`
            select r.roleID, g.name, r.url
            from [dbo].[Group] as g
            inner join [dbo].[Group_Role] as gr on g.GroupID = gr.GroupID
            inner join [dbo].[Role] as r on gr.RoleID = r.RoleID
            where g.GroupID = ${groupID}
        `);
        return {
            errCode: 0,
            message: 'Get role with group success',
            data: result.recordset,
        }
    } catch (e) {
        console.log(e);
        return {
            message: 'Error from the server',
            errCode: -1,
        }
    }
}

let addRolesForGroup = async (data) => {
    try {
        await sql.connect(ConfigSQl);
        let result = await sql.query(`
            select g.groupID, r.roleID, g.name, r.url
            from [dbo].[Group] as g
            inner join [dbo].[Group_Role] as gr on g.GroupID = gr.GroupID
            inner join [dbo].[Role] as r on gr.RoleID = r.RoleID
            where g.GroupID = ${data.groupID}
         `);
        let arrOld = result.recordset;
        let { deletedRoles, insertedRoles } = buildAssignRoles(arrOld, data.data);
        let query = ``;
        deletedRoles.forEach(item => {
            query += `DELETE FROM [dbo].[Group_Role] WHERE [GroupID] = ${item.groupID} and [RoleID] = ${item.roleID}
            `;
        })
        insertedRoles.forEach(item => {
            query += `INSERT INTO [dbo].[Group_Role] ([RoleID], [GroupID]) VALUES (${item.roleID}, ${item.groupID})
            `
        })
        await sql.query(query);
        return {
            errCode: 0,
            message: 'Add roles with group success',
        }
    } catch (e) {
        console.log(e);
        return {
            message: 'Error from the server',
            errCode: -1,
        }
    }
}






module.exports = {
    newUserSV,
    getUsersWithPageOffset,
    dropUser,
    getAllGroupUser,
    editUser,
    getAllRoles,
    createRoles,
    deleteRole,
    getRoleWithGroup,
    addRolesForGroup
}