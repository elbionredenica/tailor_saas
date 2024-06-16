import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Rental() {
  const [form, setForm] = useState({
    booking_client_id: "",
    dress_id: "",
    date_booked_start: new Date().toISOString().split('T')[0],
    date_booked_end: "",
    status: "",
    rent_price: ""
  });
  const [clients, setClients] = useState([]);
  const [dresses, setDresses] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  const statusOptions = ["Active", "Returned", "Cancelled"];

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      const response = await fetch(
        `http://localhost:5050/rental/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }

      const rental = await response.json();
      if (!rental) {
        console.warn(`Rental with id ${id} not found`);
        navigate("/rentals");
        return;
      }

      setForm(rental);
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

  async function onSubmit(e) {
    e.preventDefault();
    // Validate date order
    const startDate = new Date(form.date_booked_start);
    const endDate = new Date(form.date_booked_end);
    if (startDate >= endDate) {
      alert("Please ensure that Start Date < End Date");
      return;
    }

    const rental = { ...form };

    try {
      let response;
      if (params.id) {
        response = await fetch(`http://localhost:5050/rental/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rental),
        });
      } else {
        response = await fetch(`http://localhost:5050/rental`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rental),
        });
      }

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        throw new Error(message);
      }

      navigate("/rentals");
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    } finally {
      setForm({
        booking_client_id: "",
        dress_id: "",
        date_booked_start: "",
        date_booked_end: "",
        status: "",
        rent_price: ""
      });
      navigate("/rentals");
    }
  }

  return (
    <div className="flex justify-center">
      <form className="w-full max-w-lg" onSubmit={onSubmit}>
        <div className="mb-4">
          <label htmlFor="booking_client_id" className="block text-gray-700 text-sm font-bold mb-2">
            Client:
          </label>
          <select
            id="booking_client_id"
            required
            value={form.booking_client_id}
            onChange={(e) => {
              setForm({ ...form, booking_client_id: e.target.value })
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>{client.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="dress_id" className="block text-gray-700 text-sm font-bold mb-2">
            Dress:
          </label>
          <select
            id="dress_id"
            required
            value={form.dress_id}
            onChange={(e) => {
              setForm({ ...form, dress_id: e.target.value })
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="" disabled>Select Dress</option>
            {dresses.map((dress) => (
              <option key={dress._id} value={dress._id}>
                {dress.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="date_booked_start" className="block text-gray-700 text-sm font-bold mb-2">
            Start Date:
          </label>
          <input
            type="date"
            id="date_booked_start"
            value={form.date_booked_start}
            onChange={(e) => setForm({ ...form, date_booked_start: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date_booked_end" className="block text-gray-700 text-sm font-bold mb-2">
            End Date:
          </label>
          <input
            type="date"
            id="date_booked_end"
            value={form.date_booked_end}
            onChange={(e) => setForm({ ...form, date_booked_end: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="rent_price" className="block text-gray-700 text-sm font-bold mb-2">
            Rent Price (€):
          </label>
          <input
            type="number"
            id="rent_price"
            value={form.rent_price}
            onChange={(e) => setForm({ ...form, rent_price: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
            Status:
          </label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="" disabled>Select Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Rental
          </button>
        </div>
      </form>
    </div>
  );
}
