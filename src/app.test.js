import app from './app.js'
import {clearDataFile} from "./data.js";
import request from 'supertest'

describe('API Server Test', ()=>{

    beforeEach(() => {
        clearDataFile();
    });

    test('Test getting items', async ()=> {
        const response = await request(app).get('/items');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([])
    })

    test('Test appending an item', async ()=> {
        const item = {id: 'Flour', amount: 1}

        let response = await request(app)
            .post('/items')
            .send(item);
        expect(response.statusCode).toBe(200);

        response = await request(app).get('/items');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([item]));
    })

    test('Test successful delete an item', async ()=> {
        const item1 = {id: 'Flour', amount: 1}

        let response = await request(app)
            .post('/items')
            .send(item1)
        expect(response.statusCode).toBe(200);

        response = await request(app).get('/items');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([item1]));

        response = await request(app)
            .delete('/items/0')
        expect(response.statusCode).toBe(200);

        response = await request(app).get('/items');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    })

    test('Test fail to delete an item', async ()=> {
        let response = await request(app)
            .delete('/items/0')
        expect(response.statusCode).toBe(400);

    })


    test('Test change a whole item', async ()=> {
        const item1 = {id: 'Flour', amount: 1}
        const item2 = {id: 'Salmon', amount: 2}

        let response = await request(app)
            .post('/items')
            .send(item1)
        expect(response.statusCode).toBe(200);

        response = await request(app).get('/items');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([item1]));

        response = await request(app)
            .put('/items/0')
            .send(item2)
        expect(response.statusCode).toBe(200);

        response = await request(app).get('/items');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([item2]));
    })

    test('Test successful change a amount', async ()=> {
        const item1 = {id: 'Flour', amount: 1}
        const changedAmount = {amount: 3}

        let response = await request(app)
            .post('/items')
            .send(item1)
        expect(response.statusCode).toBe(200);

        response = await request(app).get('/items');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([item1]));

        response = await request(app)
            .patch('/items/0')
            .send(changedAmount)
        expect(response.statusCode).toBe(200);

        response = await request(app).get('/items');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([{id: 'Flour', amount: 3}]);
    })

    test('Test fail to change a amount', async ()=> {
        const item1 = {id: 'Flour', amount: 1}
        const changedAmount = {amount: 3}

        let response = await request(app)
            .post('/items')
            .send(item1)
        expect(response.statusCode).toBe(200);

        response = await request(app).get('/items');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([item1]));

        response = await request(app)
            .patch('/items/1')
            .send(changedAmount)
        expect(response.statusCode).toBe(404);
    })



    // more test cases
    // 1. patch
    //     post item
    //     patch with index 0 item with only quantity
    //     get all items and see if there is one with old name and new quantity
    // 2a successful delete - before list is empty
    //     post item or put item to index 0
    //     delete item at index 0 - 200
    //     get items must return an empty body
    // 2b delete with incorrect index
    //     delete item at index 0 - 404
    // 3. put
    // 4. validation
})