import express from 'express'
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import basicAuth from 'express-basic-auth';
import bcrypt from "bcrypt";

import itemsRouter from "./routers/items.router.js";
import {createDataFileIfNotExists} from "./data.js";

const USERS = {
    'Tanya': '$2b$10$JV0IR.ZazLYggSlDMNFAYe4.h7XH9f7yJQIr8R0ykjNjPV5t/pZH6'
}


const app = express();
app.use(express.static('../www'));
app.use(express.urlencoded())
app.use(express.json()); 
app.use(createDataFileIfNotExists());



async function myAuthorizer(username, password, callback) {
    console.log("username: ", username);

    if (Object.keys(USERS).includes(username)){
        const passwordMatches = await bcrypt.compare(password, USERS[username]);
        callback(null, passwordMatches)
    } else {
        callback(null, false)
    }
}

app.use(basicAuth({
    authorizer: myAuthorizer,
    authorizeAsync: true,
}))

app.use('/', itemsRouter)

const openAPIOptions = {
    failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Shopping List',
            version: '1.0.0',
        },
    },
    apis: ['./src/routers/*.router.js'],
};

const openapiSpecification = swaggerJsdoc(openAPIOptions);

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(openapiSpecification)
);


export default app
