import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OrderTableRow = ({ expense, dresses, deleteExpense }) => {
  // Find dress name based on dress ID
  const dress = dresses.find((dress) => dress._id === expense.dress_id);
  const dressName = dress ? dress.name : "Not Applicable";

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
// this is a test 
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-sm text-gray-900">{dressName}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-normal" style={{ maxWidth: '200px', overflowWrap: 'break-word', wordWrap: 'break-word' }}>
        <div className="text-sm text-gray-900">{expense.description}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatDate(expense.order_date)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
            {expense.arrival_date ? formatDate(expense.arrival_date) : "Unknown/Not Applicable"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{expense.price}€</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${expense.status === 'Ordered' ? 'bg-yellow-100 text-yellow-800' : expense.status === 'Paid' ? 'bg-blue-100 text-blue-800' : expense.status === 'Done' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {expense.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link to={`/expense/edit/${expense._id}`} className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</Link>
        <button onClick={() => deleteExpense(expense._id)} className="text-red-600 hover:text-red-900">Delete</button>
      </td>
    </tr>
  );
};

export default function ExpensesList() {
  const [expenses, setExpenses] = useState([]);
  const [dresses, setDresses] = useState([]);

  // Fetch orders, clients, and dresses
  useEffect(() => {
    async function fetchData() {
      const expensesResponse = await fetch(`http://localhost:5050/expense/`);
      const dressesResponse = await fetch(`http://localhost:5050/dress/`);

      if (!expensesResponse.ok || !dressesResponse.ok) {
        console.error("Failed to fetch data");
        return;
      }

      const expensesData = await expensesResponse.json();
      const dressesData = await dressesResponse.json();

      setExpenses(expensesData);
      setDresses(dressesData);
    }

    fetchData();
  }, []);

  // Delete order function
  async function deleteExpense(id) {
    const confirmation = window.confirm("Are you sure you want to delete this expense?");
    if (confirmation) {
      await fetch(`http://localhost:5050/expense/${id}`, {
        method: "DELETE",
      });
      const newExpenses = expenses.filter((el) => el._id !== id);
      setExpenses(newExpenses);
    }
  }

  // Display orders in a table
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Expenses Records</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dress</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => (
              <OrderTableRow
                key={expense._id}
                expense={expense}
                dresses={dresses}
                deleteExpense={deleteExpense}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <Link to="/expenses/create" className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3">
          Add New Expense
        </Link>
      </div>
    </>
  );
}
