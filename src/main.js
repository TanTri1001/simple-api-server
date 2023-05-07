import express from 'express'
import {promises, existsSync} from 'fs';

const app = express()

app.use(express.json());

const DATA_FILE = 'shopping-list.json';

async function getShoppingList() {
    const text = await promises.readFile(DATA_FILE, {encoding: 'utf8'})
    return JSON.parse(text)
}

async function saveShoppingList(shoppingList) {
    await promises.writeFile(DATA_FILE, JSON.stringify(shoppingList), {encoding:'utf-8'})
}
/**
 * Return all shopping list items as JSON.
 */
app.get('/items', async (request, response) => {
    const shoppingList = await getShoppingList()
    response.json(shoppingList);
})
/**
 * save a new shopping list item
 */
app.post('/items', async (request, response) =>{
    const shoppingList = await getShoppingList();

    const newItem = request.body;
    console.log(newItem)
    shoppingList.push(newItem)

    await saveShoppingList(shoppingList)

    response.sendStatus(200)
})

/**
 * Override a shopping list item at a given position.
 */
app.put('/items/:index', async (request, response) => {
    const shoppingList = await getShoppingList()

    const newItem = request.body;
    const itemIndex = request.params['index'];

    shoppingList[itemIndex] = newItem;

    await saveShoppingList(shoppingList)

    response.sendStatus(200);
})

/**
 * Delete a shopping list item from a given position.
 */
app.delete('/items/:index', async (request, response) => {
    const shoppingList = await getShoppingList()

    const itemIndex = request.params['index'];

    shoppingList.splice(itemIndex, 1)

    await saveShoppingList(shoppingList)

    response.sendStatus(200);
})

/**
 * Create the DATA_FILE if it does not exist yet.
 */
if(!existsSync(DATA_FILE)){
    await promises.writeFile(DATA_FILE, JSON.stringify([]), {encoding:'utf-8'})
}

const port = 8000;
/**
 * Start the server.
 */
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
