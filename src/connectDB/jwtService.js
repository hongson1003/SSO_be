import ConfigSQl from "./ConfigSQl";
import sql from 'mssql';

let getRolesFromGroupID = async (groupID) => {
    try {
        await sql.connect(ConfigSQl);
        let result = await sql.query`
            SELECT R.Url, R.Description
            FROM [Group_Role] AS G
            INNER JOIN [Role] AS R ON G.RoleID = R.RoleID
            WHERE G.GroupID = ${groupID}
        `
        await sql.close();
        return result.recordset;
    } catch (e) {
        console.log(e);
    }
}
let handleGetUserFromRefreshToken = async (refreshToken) => {
    try {
        await sql.connect(ConfigSQl);
        let result1 = await sql.query`
        select u.email, u.userID, u.groupID
        from [user] as u
        where u.RefreshToken = ${refreshToken}
        `;
        await sql.close();
        let user = result1.recordset[0];
        let roles = await getRolesFromGroupID(user.groupID);
        let data = {
            ...user,
            roles,
        }
        return data;
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    getRolesFromGroupID,
    handleGetUserFromRefreshToken
}