import express from 'express'
import itemsRouter from "./routers/items.router.js";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import {createDataFileIfNotExists} from "./data.js";
import basicAuth from 'express-basic-auth';

const app = express();
app.use(express.static('../www'));
app.use(express.urlencoded())
app.use(express.json());
app.use(createDataFileIfNotExists());
app.use('/', itemsRouter)

app.use(basicAuth({
   users: { 'david': '123' }
}))

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
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(openapiSpecification)
);


export default app
