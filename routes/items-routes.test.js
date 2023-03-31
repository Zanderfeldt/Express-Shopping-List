process.env.NODE_ENV = "test";

const request = require('supertest');
const app = require('../app');
let items = require('../fakeDb');

let item = { name: 'Coffee', price: 5.50};

beforeEach(function() {
  items.push(item);
});

afterEach(function() {
  items.length = 0;
})

describe("GET /items", () => {
  test("Gets list of items", async function() {
    const resp = await request(app).get('/items');
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual({items: [item]});
  });
});

describe("GET /items/:name", () => {
  test("Gets a single item", async function() {
    const resp = await request(app).get(`/items/${item.name}`);
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual(item);
  });

  test("Responds with 404 if can't find item", async function() {
    const resp = await request(app).get('/items/0');
    expect(resp.statusCode).toBe(404);
  });
});

describe("POST /items", () => {
  test("Creates a new item", async function() {
    const resp = await request(app)
      .post('/items')
      .send({ name: 'Banana', price: 1.00 });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({added: { name: 'Banana', price: 1.00 }});
  });
});

describe("PATCH /items/:name", () => {
  test("Updates a single item", async function() {
    const resp = await request(app)
      .patch(`/items/${item.name}`)
      .send({ name: 'Test', price: 1});
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ updated: {name: 'Test', price: 1} });
  });

  test("Responds with 404 if invalid name", async function() {
    const resp = await request(app).patch('/items/0');
    expect(resp.statusCode).toBe(404);
  });
});

describe("DELETE /items/:name", () => {
  test("Deletes a single item", async function() {
    const resp = await request(app).delete(`/items/${item.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });
});