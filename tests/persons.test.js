const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const Person = require('../models/person');

beforeAll(async () => {

      await mongoose.disconnect();
  await mongoose.connect(process.env.MONGODB_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('CRUD /persons', () => {
  let createdId;

  test('POST /persons -> crea una nueva persona', async () => {
    const res = await request(app)
      .post('/persons')
      .send({ name: 'Test', email: 'test@example.com', age: 20 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    createdId = res.body._id;
  });

  test('GET /persons -> lista personas', async () => {
    const res = await request(app).get('/persons');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /persons/:id -> obtiene persona por ID', async () => {
    const res = await request(app).get(`/persons/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'test@example.com');
  });

  test('PUT /persons/:id -> actualiza persona', async () => {
    const res = await request(app)
      .put(`/persons/${createdId}`)
      .send({ age: 25 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('age', 25);
  });

  test('DELETE /persons/:id -> elimina persona', async () => {
    const res = await request(app).delete(`/persons/${createdId}`);
    expect(res.statusCode).toBe(204);
  });
});
