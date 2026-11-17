import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/index';
import { useLoopbackServer } from './helpers/loopbackServer';
import { expenseStore } from '../src/store';

const server = useLoopbackServer(app);

beforeEach(() => {
  expenseStore.reset();
});

describe('GET /expenses', () => {
  it('returns an empty array when no expenses exist', async () => {
    const res = await request(server()).get('/expenses');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns expenses ordered by date descending', async () => {
    expenseStore.create({ description: 'Older', amount: 10, date: '2024-01-01' });
    expenseStore.create({ description: 'Newer', amount: 20, date: '2024-02-01' });

    const res = await request(server()).get('/expenses');

    expect(res.status).toBe(200);
    expect(res.body[0].description).toBe('Newer');
    expect(res.body[1].description).toBe('Older');
  });

  it('returns all expense fields', async () => {
    expenseStore.create({ description: 'Coffee', amount: 3.5, date: '2024-03-01' });

    const res = await request(server()).get('/expenses');
    const expense = res.body[0];

    expect(expense).toHaveProperty('id');
    expect(expense).toHaveProperty('description', 'Coffee');
    expect(expense).toHaveProperty('amount', 3.5);
    expect(expense).toHaveProperty('date', '2024-03-01');
    expect(expense).toHaveProperty('created_at');
  });
});

describe('POST /expenses', () => {
  it('creates an expense and returns it with status 201', async () => {
    const res = await request(server())
      .post('/expenses')
      .send({ description: 'Coffee', amount: 3.5, date: '2024-03-01' });

    expect(res.status).toBe(201);
    expect(res.body.description).toBe('Coffee');
    expect(res.body.amount).toBe(3.5);
    expect(res.body.date).toBe('2024-03-01');
    expect(res.body.id).toBeDefined();
  });

  it('persists the created expense so it appears in GET /expenses', async () => {
    await request(server())
      .post('/expenses')
      .send({ description: 'Lunch', amount: 12.5, date: '2024-03-01' });

    const res = await request(server()).get('/expenses');
    expect(res.body).toHaveLength(1);
    expect(res.body[0].description).toBe('Lunch');
  });

  it('returns 400 when description is missing', async () => {
    const res = await request(server())
      .post('/expenses')
      .send({ amount: 10, date: '2024-03-01' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when amount is missing', async () => {
    const res = await request(server())
      .post('/expenses')
      .send({ description: 'Coffee', date: '2024-03-01' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when date is missing', async () => {
    const res = await request(server())
      .post('/expenses')
      .send({ description: 'Coffee', amount: 3.5 });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /expenses/:id', () => {
  it('deletes an existing expense and returns 204', async () => {
    const expense = expenseStore.create({ description: 'To delete', amount: 5, date: '2024-03-01' });

    const res = await request(server()).delete(`/expenses/${expense.id}`);

    expect(res.status).toBe(204);
  });

  it('removes the expense so it no longer appears in GET /expenses', async () => {
    const expense = expenseStore.create({ description: 'To delete', amount: 5, date: '2024-03-01' });

    await request(server()).delete(`/expenses/${expense.id}`);

    const res = await request(server()).get('/expenses');
    expect(res.body).toHaveLength(0);
  });

  it('returns 404 when the expense does not exist', async () => {
    const res = await request(server()).delete('/expenses/99999');
    expect(res.status).toBe(404);
  });
});
