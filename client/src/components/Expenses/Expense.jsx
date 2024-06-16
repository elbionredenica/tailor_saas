import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Expense() {
  const [form, setForm] = useState({
    dress_id: "",
    description: "",
    order_date: new Date().toISOString().split('T')[0],
    arrival_date: "",
    status: "",
    price: ""
  });
  const [dresses, setDresses] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  const statusOptions = ["Ordered", "Partially Paid", "Paid", "Cancelled", "Done"];

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      const response = await fetch(
        `http://localhost:5050/expense/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const expense = await response.json();
      if (!expense) {
        console.warn(`Expense with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(expense);
    }
    fetchData();
  }, [params.id, navigate]);

  useEffect(() => {
    async function fetchDresses() {
      const response = await fetch(`http://localhost:5050/dress/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const dresses = await response.json();
      setDresses(dresses);
    }
    fetchDresses();
  }, []);

  function updateForm(value) {
    setForm(prev => ({
      ...prev,
      ...value
    }));
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    // Validate date order
    const orderDate = new Date(form.order_date);
    const arrivalDate = form.arrival_date ? new Date(form.arrival_date) : null;
    if (arrivalDate && orderDate > arrivalDate) {
        alert("Please ensure that Order Date < Arrival Date");
        return;
    }
    const expense = { ...form };
    try {
      let response;
      if (params.id) {
        // if we are updating a record we will PATCH to /record/:id.
        response = await fetch(`http://localhost:5050/expense/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expense),
        });
      } else {
        // if we are adding a new record we will POST to /record.
        response = await fetch("http://localhost:5050/expense", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expense),
        });
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }  
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    } finally {
      setForm({
        dress_id: "",
        description: "",
        order_date: "",
        arrival_date: "",
        status: "",
        price: ""
      });
      navigate("/expenses");
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-semibold text-center text-gray-800 py-4">Create/Update Expense</h3>
      <form onSubmit={onSubmit} className="px-6 pb-8">
        <div className="mb-6">
          <label htmlFor="dress_id" className="block text-sm font-medium text-gray-700 mb-1">Dress</label>
          <select
            name="dress_id"
            id="dress_id"
            className="form-select w-full"
            value={form.dress_id}
            onChange={(e) => updateForm({ dress_id: e.target.value })}
          >
            <option value="">Select Dress</option>
            {dresses.map((dress) => (
              <option key={dress._id} value={dress._id}>{dress.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            id="description"
            rows="2"
            className="form-textarea w-full"
            placeholder="Expense Description"
            value={form.description}
            onChange={(e) => updateForm({ description: e.target.value })}
          ></textarea>
        </div>
        <div className="mb-6">
          <label htmlFor="order_date" className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
          <input
            type="date"
            name="order_date"
            id="order_date"
            className="form-input w-full"
            value={form.order_date}
            onChange={(e) => updateForm({ order_date: e.target.value })}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="arrival_date" className="block text-sm font-medium text-gray-700 mb-1">Arrival Date</label>
          <input
            type="date"
            name="arrival_date"
            id="arrival_date"
            className="form-input w-full"
            value={form.arrival_date}
            onChange={(e) => updateForm({ arrival_date: e.target.value })}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            id="status"
            className="form-select w-full"
            value={form.status}
            onChange={(e) => updateForm({ status: e.target.value })}
            required
          >
            <option value="">Select Status</option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            name="price"
            id="price"
            className="form-input w-full"
            placeholder="Price"
            value={form.price}
            onChange={(e) => updateForm({ price: e.target.value })}
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/expenses")}
            className="inline-block px-6 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Back
          </button>
          <input
            type="submit"
            value="Save Expense"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </form>
    </div>
  );
}