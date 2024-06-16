import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ClientTableRow = ({ client, deleteClient }) => (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link to={`/client/${client._id}`} className="text-indigo-600 hover:text-indigo-900">
            <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                    <img
                    className="h-10 w-10 rounded-full object-cover object-center"
                    src={client.image}
                    alt={client.name}
                    />
                </div>
                <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                    <div className="text-sm text-gray-500">{client.email}</div>
                </div>
            </div>
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{client.phone}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${client.analytics.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {client.analytics.active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {client.analytics.orders}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link to={`/client/edit/${client._id}`} className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</Link>
        <button onClick={() => deleteClient(client._id)} className="text-red-600 hover:text-red-900">Delete</button>
      </td>
    </tr>
  );

export default function ClientsList() {
const [clients, setClients] = useState([]);

// This method fetches the records from the database.
useEffect(() => {
    async function getClients() {
    const response = await fetch(`http://localhost:5050/client/`);
    if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
    }
    const clients = await response.json();
    setClients(clients);
    }
    getClients();
}, []);

// This method will delete a record
async function deleteClient(id) {
  const confirmation = window.confirm("Are you sure you want to delete this record?");
  if (confirmation) {
      await fetch(`http://localhost:5050/client/${id}`, {
          method: "DELETE",
      });
      const newClients = clients.filter((el) => el._id !== id);
      setClients(newClients);
  }
}


// This following section will display the records as cards.
return (
    <>
      <h3 className="text-lg font-semibold p-4">Clients Records</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name & Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <ClientTableRow
                client={client}
                deleteClient={deleteClient}
                key={client._id}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <Link to="/clients/create" className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3">
          Add New Client
        </Link>
      </div>
    </>
  );
}