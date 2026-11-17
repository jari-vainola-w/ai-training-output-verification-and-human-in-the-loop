import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ExpenseList } from './components/ExpenseList';
import { AddExpenseForm } from './components/AddExpenseForm';
import { Expense } from './types';

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  async function fetchExpenses() {
    const res = await fetch('http://localhost:3001/expenses');
    if (res.ok) {
      setExpenses(await res.json());
    }
  }

  async function deleteExpense(id: number) {
    await fetch(`http://localhost:3001/expenses/${id}`, { method: 'DELETE' });
    fetchExpenses();
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <Header />
      <AddExpenseForm onAdd={fetchExpenses} />
      <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Expenses</h2>
      <ExpenseList expenses={expenses} onDelete={deleteExpense} />
    </div>
  );
}
