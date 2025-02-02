import express from "express";
import {existsSync, promises} from "fs";
import {body, validationResult} from "express-validator";


const app = express();
app.use(express.static('../UserInfoClient'));
app.use(express.json());
const DATA_FILE = '../users-info.json';

const failOnIssues = () => (req, res, next) => {
    const validationReport = validationResult(req);
    if (!validationReport.isEmpty()){
        res
            .status(400)
            .json(validationReport.array())
    } else {
        next()
    }
}

const countries = ['Germany', 'United States', 'United Kingdom', 'Canada' ]
app.get('/users-info', async (req, res) => {
    const data = await promises.readFile(DATA_FILE, {encoding: 'utf8'});
    const usersData = JSON.parse(data);
    res.json(usersData)
})

/**
 * validation chain functions
 */
const checkNames = () =>
    body('firstName').notEmpty().withMessage('invalid first name');
    body('lastName').notEmpty().withMessage('invalid last name');

const checkEmail = () => body('email').isEmail().notEmpty();
const checkAddressAndCityAndState = () =>
    body('address').notEmpty();
    body('city').notEmpty();
    body('state').notEmpty();
const checkZip = () => body('zip').isInt({min:5});
const checkCountry = () => body('country').notEmpty().isIn(countries);


app.get('/', async (req, res) => {
    const data = await promises.readFile(DATA_FILE, {encoding: 'utf8'});
    const usersData = JSON.parse(data);
    res.json(usersData)
})
app.post('/users-info',
    // body('firstName').notEmpty(),
    // body('lastName').notEmpty(),
    checkNames(),
    checkEmail(),
    checkAddressAndCityAndState(),
    checkZip(),
    checkCountry(),
    failOnIssues(),
    async (req, res) => {
    const data = await promises.readFile(DATA_FILE, {encoding: 'utf8'});
    const usersData = JSON.parse(data);

    const newUser = req.body;
    usersData.push(newUser);

    await promises.writeFile(DATA_FILE, JSON.stringify(usersData), {encoding: 'utf8'});
    res.sendStatus(200)
})
const port = 4000;

if(!existsSync(DATA_FILE)) {
    await promises.writeFile(DATA_FILE, JSON.stringify([]), {encoding: 'utf8'})
}
app.listen(port,() => {
    console.log(`listenning to port ${port}`)
})