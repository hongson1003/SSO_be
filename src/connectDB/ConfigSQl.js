require('dotenv').config();

const ConfigSQl = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    server: "localhost",
    database: process.env.DB_NAME,
    stream: false,
    options: {
        cryptoCredentialsDetails: {
            minVersion: 'TLSv1'
        },
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true,
        enableArithAbort: true,
    },
    parseJSON: true,
}
export default ConfigSQl;