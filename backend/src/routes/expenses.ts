import { Router, Request, Response } from 'express';
import { expenseStore } from '../store';
import { Expense } from '../types';

export const expensesRouter = Router();

expensesRouter.get('/', (_req: Request, res: Response) => {
  res.json(expenseStore.getAll());
});

expensesRouter.post('/', (req: Request, res: Response) => {
  const { description, amount, date } = req.body as Partial<Expense>;

  if (!description || amount === undefined || amount === null || !date) {
    res.status(400).json({ error: 'description, amount, and date are required' });
    return;
  }

  if (typeof amount !== 'number' || isNaN(amount)) {
    res.status(400).json({ error: 'amount must be a number' });
    return;
  }

  const expense = expenseStore.create({ description, amount, date });
  res.status(201).json(expense);
});

expensesRouter.delete('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const deleted = expenseStore.delete(id);
  if (!deleted) {
    res.status(404).json({ error: 'Expense not found' });
    return;
  }

  res.status(204).send();
});
