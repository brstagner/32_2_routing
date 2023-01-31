process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('./app');
let items = require('./fakeDb').items;

let table = { name: "table", price: 3.45 };

beforeEach(() => items.push(table));

afterEach(() => items.length = 0);

describe('GET /items', () => {
    test('Get all items from shopping list', async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([table]);
    });
});

describe('POST /items', () => {
    test('Add item shopping list', async () => {
        const res = await request(app).post('/items').send({ name: "desk", price: 4.56 });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ name: "desk", price: 4.56 });
    });
    test('Attempt item add without name or price', async () => {
        const res = await request(app).post('/items').send({});
        expect(res.statusCode).toBe(400);
    });
    test('Attempt item add without name', async () => {
        const res = await request(app).post('/items').send({ price: 1.23 });
        expect(res.statusCode).toBe(400);
    });
    test('Attempt item add without a price', async () => {
        const res = await request(app).post('/items').send({ name: "lamp"});
        expect(res.statusCode).toBe(400);
    });
});

describe('GET /items/:name', () => {
    test('Get one item from shopping list', async () => {
        const res = await request(app).get('/items/table');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(table);
    });
    test('Attempt item get without valid name', async () => {
        const res = await request(app).get('/items/tabl');
        expect(res.statusCode).toBe(404);
    });
});

describe('PATCH /items/:name', () => {
    test('Amend item in shopping list', async () => {
        const res = await request(app).patch('/items/table').send({ name: "chair", price: 5.67 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"original": { name: "table", price: 3.45 }, "updated": { name: "chair", price: 5.67 }});
    });
    test('Attempt item patch without valid name', async () => {
        const res = await request(app).patch('/items/tabl').send({ name: "chair", price: 5.67 });
        expect(res.statusCode).toBe(404);
    });
});

describe('DELETE /items/:name', () => {
    test('Delete item in shopping list', async () => {
        const res = await request(app).delete('/items/chair');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Deleted' });
    });
    test('Attempt item delete without valid name', async () => {
        const res = await request(app).delete('/items/tabl').send({ name: "chair", price: 5.67 });
        expect(res.statusCode).toBe(404);
    });
});