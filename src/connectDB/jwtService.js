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

module.exports = {
    getRolesFromGroupID
}