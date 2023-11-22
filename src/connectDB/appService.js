import sql from 'mssql';
import ConfigSQl from './ConfigSQl';
import existEmailOrPhone from '../ultis/existEmailOrPhone';
import jwtService from '../connectDB/jwtService';
import JWTAction from '../middleware/JWTAction';

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
                let roles = await jwtService.getRolesFromGroupID(isExists[0].GroupID);
                let token = JWTAction.createJWT({ roles });
                return {
                    errCode: 0,
                    message: 'Login success',
                    data: {
                        id: isExists[0].UserID,
                        access: token
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


module.exports = {
    createNewUserSV,
    login
}

