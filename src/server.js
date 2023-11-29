require('dotenv').config();
import express from 'express';
import InitWebRouters from './web/InitWebRoutes';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passportController from '../src/controllers/passportController';
import configSession from '../src/connectDB/configSession';
import flash from 'connect-flash';
import googleController from '../src/controllers/googleController';
import facebookController from '../src/controllers/facebookController';


const path = require("path");
const port = process.env.PORT;

const app = express();

// config app flash
app.use(flash());
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use("/", express.static("./node_modules/bootstrap/dist/"));

app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:8081'];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});


passportController.configPassportLocal();
configSession(app);
googleController.configLoginWithGG();
facebookController.configFacebook();

InitWebRouters(app);


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
