import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Order() {
  const [form, setForm] = useState({
    client_id: "",
    dress_id: "",
    order_date: new Date().toISOString().split('T')[0],
    fitting_date: "",
    delivering_date: "",
    status: "",
    price: ""
  });
  const [clients, setClients] = useState([]);
  const [dresses, setDresses] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  const statusOptions = ["Ordered", "Partially Paid", "Paid", "Cancelled", "Done"];

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      const response = await fetch(
        `http://localhost:5050/order/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const order = await response.json();
      if (!order) {
        console.warn(`Order with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(order);
    }
    fetchData();
  }, [params.id, navigate]);

  useEffect(() => {
    async function fetchClients() {
      const response = await fetch(`http://localhost:5050/client/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const clients = await response.json();
      setClients(clients);
    }
    fetchClients();
  }, []);

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

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    // Validate date order
    const orderDate = new Date(form.order_date);
    const fittingDate = new Date(form.fitting_date);
    const deliveringDate = new Date(form.delivering_date);
    if (orderDate > fittingDate || fittingDate > deliveringDate) {
      alert("Please ensure that Order Date < Fitting Date < Delivering Date");
      return;
    }
    const order = { ...form };
    try {
      let response;
      if (params.id) {
        // if we are updating a record we will PATCH to /record/:id.
        response = await fetch(`http://localhost:5050/order/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        });
      } else {
        // if we are adding a new record we will POST to /record.
        response = await fetch("http://localhost:5050/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        });
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }  
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    } finally {
      setForm({
        client_id: "",
        dress_id: "",
        order_date: "",
        fitting_date: "",
        delivering_date: "",
        status: "",
        price: ""
      });
      navigate("/orders");
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-semibold text-center text-gray-800 py-4">Create/Update Order</h3>
      <form onSubmit={onSubmit} className="px-6 pb-8">
        <div className="mb-6">
          <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 mb-1">Client</label>
          <select
            name="client_id"
            id="client_id"
            className="form-select w-full"
            value={form.client_id}
            onChange={(e) => setForm({ ...form, client_id: e.target.value })}
            required
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>{client.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="dress_id" className="block text-sm font-medium text-gray-700 mb-1">Dress</label>
          <select
            name="dress_id"
            id="dress_id"
            className="form-select w-full"
            value={form.dress_id}
            onChange={(e) => setForm({ ...form, dress_id: e.target.value })}
            required
          >
            <option value="">Select Dress</option>
            {dresses.map((dress) => (
              <option key={dress._id} value={dress._id}>{dress.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="order_date" className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
          <input
            type="date"
            name="order_date"
            id="order_date"
            className="form-input w-full"
            value={form.order_date}
            onChange={(e) => setForm({ ...form, order_date: e.target.value })}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="fitting_date" className="block text-sm font-medium text-gray-700 mb-1">Fitting Date</label>
          <input
            type="date"
            name="fitting_date"
            id="fitting_date"
            className="form-input w-full"
            value={form.fitting_date}
            onChange={(e) => setForm({ ...form, fitting_date: e.target.value })}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="delivering_date" className="block text-sm font-medium text-gray-700 mb-1">Delivering Date</label>
          <input
            type="date"
            name="delivering_date"
            id="delivering_date"
            className="form-input w-full"
            value={form.delivering_date}
            onChange={(e) => setForm({ ...form, delivering_date: e.target.value })}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            id="status"
            className="form-select w-full"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
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
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="inline-block px-6 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Back
          </button>
          <input
            type="submit"
            value="Save Order"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </form>
    </div>
  );
}