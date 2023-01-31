const express = require('express');
const router = new express.Router();
const app = express();
const fakeDb = require('./fakeDb');
const items = fakeDb.items;
const ExpressError = require('./expressError');

app.use(express.json());

// Return JSON data for shopping list
router.get('/items', (req, res) => {
    return res.send(items);
});

// Accept JSON data and add to shopping list
router.post('/items', (req, res, next) => {
    try {
        if (!req.body.name && !req.body.price) {
            throw new ExpressError(`POST: item needs a name and price`, 400);
        };
        if (!req.body.name) {
            throw new ExpressError(`POST: item needs a name`, 400);
        };
        if (!req.body.price) {
            throw new ExpressError(`POST: item needs a price`, 400);
        };
        const newItem = { name: req.body.name, price: req.body.price };
        items.push(newItem);
        return res.status(201).json(newItem);
    }
    catch (err) {
        return next(err);
    };
});

// Return JSON data for item in shopping list
router.get('/items/:name', (req, res, next) => {
    try {
        let foundItem = fakeDb.items.find(item => item.name === req.params.name);
        if (!foundItem) {
            throw new ExpressError(`GET: '${req.params.name}' does not exist`, 404);
            };
        return res.send(foundItem);
    }
    catch (err) {
        return next(err);
    };
});

// Modify an item's name and/or price
router.patch('/items/:name', (req, res, next) => {
    try {
        let foundItem = fakeDb.items.find(item => item.name === req.params.name);
        if (!foundItem) {
            throw new ExpressError(`PATCH: '${req.params.name}' does not exist`, 404);
            }
        let originalItem = Object.assign({}, foundItem);
        foundItem.name = req.body.name;
        foundItem.price = req.body.price;
        return res.json({"original": originalItem, "updated": foundItem });
        // response ex: {“original”: {”item1”, “price”: 1.55}, “updated”: {“name”: “item2”, “price”: 2.66}}
    }
    catch (err) {
        return next(err);
    };
});

// Delete item from shopping list
router.delete('/items/:name', (req, res, next) => {
    try {
        let foundItem = fakeDb.items.findIndex(item => item.name === req.params.name);
        if (foundItem === -1) {
            throw new ExpressError(`DELETE: '${req.params.name}' does not exist`, 404);
            }
        items.splice(foundItem, 1);
        res.json({ message: 'Deleted' });
        // response: {message: “Deleted”}
    }
    catch (err) {
        return next(err);
    };
});

module.exports = router;