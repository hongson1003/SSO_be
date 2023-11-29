import sql from 'mssql';
import ConfigSQl from './ConfigSQl';
import existEmailOrPhone from '../ultis/existEmailOrPhone';
import { v4 as uuidv4 } from 'uuid';

let createNewUserSV = async (data) => {
    try {
        await sql.connect(ConfigSQl);
        const request = new sql.Request();
        request.input('UserName', sql.NVarChar, data.userName);
        request.input('Address', sql.NVarChar, data.address);
        request.input('Phone', sql.NVarChar, data.phone);
        request.input('Sex', sql.Int, data.sex);
        request.input('Email', sql.NVarChar, data.email);
        request.input('Password', sql.NVarChar, data.password);
        request.input('GroupID', sql.Int, 4);
        // check email or phone
        let isExists = await existEmailOrPhone(request);
        if (isExists.length > 0) {
            return {
                errCode: 1,
                message: 'Duplicate Email or Phone'
            }
        } else {
            // insert
            await request.query(`
            INSERT INTO [User] (UserName, Address, Phone, Sex, Email, Password, GroupID)
            VALUES (@UserName, @Address, @Phone, @Sex, @Email, @Password, @GroupID)
        `);
        }
        await sql.close();

        return {
            errCode: 0,
            message: 'Create new user success',
        }
    } catch (e) {
        console.log(e);
        return {
            errCode: -1,
            message: 'Error from the server'
        }
    }
}

let login = async (account) => {
    try {
        await sql.connect(ConfigSQl);
        const request = new sql.Request();
        request.input('Phone', sql.NVarChar, account.accountName);
        request.input('Email', sql.NVarChar, account.accountName);
        request.input('Password', sql.NVarChar, account.password);
        // check email or phone
        let isExists = await existEmailOrPhone(request);
        await sql.close();
        if (isExists.length > 0) {
            if (isExists[0].Password === account.password) {
                let code = uuidv4();
                return {
                    errCode: 0,
                    message: 'Login success',
                    data: {
                        code,
                        email: account.accountName,
                        groupID: isExists[0].GroupID,
                        username: isExists[0].UserName,
                    },
                }
            } else {
                return {
                    errCode: 1,
                    message: 'Account incorrect',
                }
            }

        }
        return {
            errCode: 2,
            message: 'Not found',
        }
    } catch (e) {
        console.log(e);
        return {
            errCode: -1,
            message: 'Error from the server'
        }
    }
}


let updateToken = async (email, refreshToken) => {
    try {
        await sql.connect(ConfigSQl);
        await sql.query(`
            UPDATE [User]
            SET RefreshToken = '${refreshToken}'
            WHERE email like '${email}'
        `)
        await sql.close();
    } catch (e) {
        console.log(e);
        return {
            errCode: -1,
            message: 'Error from the server'
        }
    }
}


let upsertSocialMedia = async (type, rawData) => {
    try {
        await sql.connect(ConfigSQl);
        // Kiểm tra xem dữ liệu đã tồn tại hay chưa
        const result = await sql.query(`
            SELECT *
            FROM [User]
            WHERE Email like '${rawData.email}'`);
        if (result.recordset.length > 0) {
            // Dữ liệu đã tồn tại, thực hiện UPDATE
            let token = uuidv4();
            await sql.query(`
                UPDATE [User]
                SET Type = '${type}', RefreshToken = '${token}'
                Where email like '${rawData.email}'
            `,);
        } else {
            // Dữ liệu chưa tồn tại, thực hiện INSERT
            await sql.query(`
                INSERT INTO [User] (Type, Email, Username, GroupID)
                VALUES ('${type}', '${rawData.email}', N'${rawData.username}', 4 )
            `);
        }
        const kq = await sql.query(`
            SELECT *
            FROM [User]
            WHERE email like '${rawData.email}'`);
        await sql.close();
        return kq.recordset[0];
    } catch (e) {
        console.log(e);
        return null;
    }
};



module.exports = {
    createNewUserSV,
    login,
    updateToken,
    upsertSocialMedia
}

