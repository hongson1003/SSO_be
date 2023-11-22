import ConfigSQl from "./ConfigSQl";
import sql from 'mssql';

let getAllUsersSV = async () => {
    try {
        await sql.connect(ConfigSQl);
        let result = await sql.query`SELECT * FROM [User]`
        await sql.close();
        if (result) {
            return {
                errCode: 0,
                message: 'Get users success',
                data: result.recordset,
            }
        } else
            return {
                errCode: 1,
                message: 'Not found'
            }
    } catch (e) {
        console.log(e);
        return {
            errCode: -1,
            message: 'Error from the server'
        }
    }
}

module.exports = {
    getAllUsersSV
}