import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OrderTableRow = ({ order, clients, dresses, deleteOrder }) => {
  // Find client name based on client ID
  const client = clients.find((client) => client._id === order.client_id);
  const clientName = client ? client.name : "Unknown Client";

  // Find dress name based on dress ID
  const dress = dresses.find((dress) => dress._id === order.dress_id);
  const dressName = dress ? dress.name : "Unknown Dress";

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{clientName}</div>
            <div className="text-sm text-gray-500">{dressName}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatDate(order.order_date)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatDate(order.fitting_date)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatDate(order.delivering_date)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{order.price}€</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Ordered' ? 'bg-yellow-100 text-yellow-800' : order.status === 'Paid' ? 'bg-blue-100 text-blue-800' : order.status === 'Done' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {order.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link to={`/order/edit/${order._id}`} className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</Link>
        <button onClick={() => deleteOrder(order._id)} className="text-red-600 hover:text-red-900">Delete</button>
      </td>
    </tr>
  );
};

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [dresses, setDresses] = useState([]);

  // Fetch orders, clients, and dresses
  useEffect(() => {
    async function fetchData() {
      const ordersResponse = await fetch(`http://localhost:5050/order/`);
      const clientsResponse = await fetch(`http://localhost:5050/client/`);
      const dressesResponse = await fetch(`http://localhost:5050/dress/`);

      if (!ordersResponse.ok || !clientsResponse.ok || !dressesResponse.ok) {
        console.error("Failed to fetch data");
        return;
      }

      const ordersData = await ordersResponse.json();
      const clientsData = await clientsResponse.json();
      const dressesData = await dressesResponse.json();

      setOrders(ordersData);
      setClients(clientsData);
      setDresses(dressesData);
    }

    fetchData();
  }, []);

  // Delete order function
  async function deleteOrder(id) {
    const confirmation = window.confirm("Are you sure you want to delete this record?");
    if (confirmation) {
      await fetch(`http://localhost:5050/order/${id}`, {
        method: "DELETE",
      });
      const newOrders = orders.filter((el) => el._id !== id);
      setOrders(newOrders);
    }
  }

  // Display orders in a table
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Orders Records</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client & Dress</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fitting Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivering Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <OrderTableRow
                key={order._id}
                order={order}
                clients={clients}
                dresses={dresses}
                deleteOrder={deleteOrder}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <Link to="/orders/create" className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3">
          Add New Order
        </Link>
      </div>
    </>
  );
}
