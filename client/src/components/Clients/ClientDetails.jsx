import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    async function fetchClientDetails() {
      try {
        const response = await fetch(`http://localhost:5050/client/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch client details");
        }
        const clientData = await response.json();
        setClient(clientData);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchClientDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      const confirmation = window.confirm("Are you sure you want to delete this client?");
      if (confirmation) {
        await fetch(`http://localhost:5050/client/${id}`, {
          method: "DELETE",
        });
        // Redirect to clients list or perform any other action after deletion
      }
    } catch (error) {
      console.error("Error deleting client:", error.message);
    }
  };

  if (!client) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">{client.name}</h2>
        {client.image && (
          <img
            src={client.image}
            alt={client.name}
            className="h-16 w-16 object-cover rounded-full"
          />
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Email:</p>
          <p>{client.email}</p>
        </div>
        <div>
          <p className="text-gray-600">Phone:</p>
          <p>{client.phone}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-600">Status:</p>
        <p>{client.analytics.active ? "Active" : "Inactive"}</p>
      </div>
      <div className="mt-4">
        <p className="text-gray-600">Last Order:</p>
        <p>{client.analytics.last_order}</p>
      </div>
      <div className="mt-8 flex justify-between items-center">
        <div>
          <Link
            to={`/client/edit/${id}`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
        <Link
          to="/clients"
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Back to Clients
        </Link>
      </div>
    </div>
  );
};

export default ClientDetails;
