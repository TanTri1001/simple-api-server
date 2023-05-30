/**
 * @openapi
 * components:
 *   schemas:
 *     ShoppingListItem:
 *       type: object
 *       required:
 *         - name
 *         - quantity
 *       properties:
 *         name:
 *           type: string
 *           description: Item name, for example 'milk'
 *         quantity:
 *           type: number
 *           description: The quantity of the item.
 *       example:
 *         name: milk
 *         quantity: 1
 *
 */

import {Router} from "express";
import {readItems, saveItems} from "../data.js";
import {body} from "express-validator";
import failOnIssues from "../failOnIssues.js";

const itemsRouter = Router();

const idNotEmpty = () => body('id').notEmpty()
const amountIntMinOne = () => body('amount').isInt({min:1}).toInt()

/**
 * @openapi
 * /items:
 *   get:
 *      description: Returns all items on the shopping list.
 *      responses:
 *         200:
 *              description: Returns all shopping list items.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/ShoppingListItem'
 *         404:
 *              description: Nothing found.
 */
itemsRouter.get('/items', async (req,res) => {
    const shoppingList = await readItems()
    res.json(shoppingList);
})


itemsRouter.post('/items',
    idNotEmpty(),
    amountIntMinOne().notEmpty(),
    failOnIssues,
    async (req, res) => {

        const shoppingList = await readItems()

        const newItem = req.body;
        shoppingList.push(newItem);

        await saveItems(shoppingList)
        res.sendStatus(200);

    })


itemsRouter.put('/items/:index',
    idNotEmpty().optional(),
    amountIntMinOne().optional(),
    failOnIssues,
    async (req, res) => {
        const shoppingList = await readItems();

        const newItem = req.body;
        const itemIndex = req.params['index'];

        if (itemIndex >= shoppingList.length) {
            res.sendStatus(404)
        } else {
            shoppingList[itemIndex] = newItem;
            console.log(shoppingList)
            await saveItems(shoppingList);
            res.sendStatus(200)
        }
    })

itemsRouter.patch('/items/:index',
    idNotEmpty().optional(),
    amountIntMinOne().optional(),
    failOnIssues,
    async (req, res) => {
        const shoppingList = await readItems();
        const index = req.params.index;

        if (shoppingList[index]) {
            shoppingList[index] = {
                ...shoppingList[index],
                ...req.body
            }
            console.log(shoppingList)
            await saveItems(shoppingList);
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    })

itemsRouter.delete('/items/:index', async (req, res) =>{
    const shoppingList = await readItems();

    const itemIndex = req.params['index'];
    if(itemIndex >= shoppingList.length){
        res.sendStatus(400);
    } else {
        shoppingList.splice(itemIndex,1);

        await saveItems(shoppingList);
        res.sendStatus(200);
    }

})

export default itemsRouter;