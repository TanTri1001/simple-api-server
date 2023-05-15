import express from "express";
import {existsSync, promises} from "fs";
import {body, validationResult} from "express-validator"

const app = express();
app.use(express.static('../www'));
app.use(express.json());
const DATA_FILE = '../shopping-list.json';


const failOnIssues = () => (req, res, next) => {
 const validationReport = validationResult(req)
    if (!validationReport.isEmpty()){
        res
            .status(400)
            .json(validationReport.array())
} else {
        next()
    }
}

const idNotEmpty = () => body('id').notEmpty()
const amountIntMinOne = () => body('amount').isInt({min:1}).toInt()

app.get('/items', async (req,res) => {
    const data = await promises.readFile(DATA_FILE, {encoding: 'utf8'});
    const shoppingList = JSON.parse(data)
    res.json(shoppingList);
})

app.post('/items',
    idNotEmpty(),
    amountIntMinOne().notEmpty(),
    failOnIssues(),
    async (req, res) => {

        const data = await promises.readFile(DATA_FILE, {encoding: 'utf8'});
        const shoppingList = JSON.parse(data)

        const newItem = req.body;
        console.log(newItem)
        shoppingList.push(newItem);

        await promises.writeFile(DATA_FILE, JSON.stringify(shoppingList), {encoding: 'utf8'});
        res.sendStatus(200);

})
app.put('/items/:index',
    idNotEmpty().optional(),
    amountIntMinOne().optional(),
    failOnIssues(),
    async (req, res) => {
    const data = await promises.readFile(DATA_FILE, {encoding: "utf8"})
    const shoppingList = JSON.parse(data);

    const newItem = req.body;
    const itemIndex = req.params['index'];

    shoppingList[itemIndex] = newItem;

    await promises.writeFile(DATA_FILE, JSON.stringify(shoppingList), {encoding: 'utf-8'});
    res.sendStatus(200)
})

app.patch('/items/:index',
    idNotEmpty().optional(),
    amountIntMinOne().optional(),
    failOnIssues(),
    async (req, res) => {
    const data = await promises.readFile(DATA_FILE, {encoding: 'utf-8'});
    const shoppingList = JSON.parse(data);
    const index = req.params.index;

    if (shoppingList[index]) {
        shoppingList[index] = {
            ...shoppingList[index],
            ...req.body
        }
        await promises.writeFile(DATA_FILE, JSON.stringify(shoppingList), {encoding: "utf8"});
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
})

app.delete('/items/:index', async (req, res) =>{
    const data = await promises.readFile(DATA_FILE, {encoding: 'utf8'});
    const shoppingList = JSON.parse(data);

    const itemIndex = req.params['index'];
    shoppingList.splice(itemIndex,1);

    await promises.writeFile(DATA_FILE, JSON.stringify(shoppingList), {encoding: 'utf-8'});
    res.sendStatus(200)
})

if (!existsSync(DATA_FILE)) {
    await promises.writeFile(DATA_FILE, JSON.stringify([]), {encoding: 'utf-8'});
}

const port = 3000
app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})