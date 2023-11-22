require('dotenv').config();
import express from 'express';
import InitWebRouters from './web/InitWebRoutes';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passportController from '../src/controllers/passportController';
import configSession from '../src/connectDB/configSession';
import flash from 'connect-flash';


const path = require("path");
const port = process.env.PORT;

const app = express();

// config app flash
app.use(flash());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use("/", express.static("./node_modules/bootstrap/dist/"));

// app.use(cors());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

passportController.configPassportLocal();
configSession(app);

InitWebRouters(app);


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
