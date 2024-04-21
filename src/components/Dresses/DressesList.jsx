import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dress = (props) => (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{props.dress.name}</h3>
        <div>
          <Link
            className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
            to={`/dress/edit/${props.dress._id}`}
          >
            Edit
          </Link>
          <button
            className="inline-block ml-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => props.deleteDress(props.dress._id)}
          >
            Delete
          </button>
        </div>
      </div>
      <img src={props.dress.image_url} alt={props.dress.name} className="w-full h-auto mb-2" />
      <p className="text-sm text-gray-600 mb-2">{props.dress.description}</p>
      <div className="grid grid-cols-2 gap-x-4">
        <div>
          <p className="text-sm font-semibold">Price:</p>
          <p className="text-sm">{props.dress.attributes.price}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Color:</p>
          <p className="text-sm">{props.dress.attributes.color}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Size:</p>
          <p className="text-sm">{props.dress.attributes.size}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Fabric:</p>
          <p className="text-sm">{props.dress.attributes.fabric}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Length:</p>
          <p className="text-sm">{props.dress.attributes.length}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Category:</p>
          <p className="text-sm">{props.dress.attributes.category}</p>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-sm font-semibold">Available for rent:</p>
        <p className="text-sm">{props.dress.available_for_rent ? "Yes" : "No"}</p>
      </div>
      <div>
        <p className="text-sm font-semibold">Is booked?</p>
        <p className="text-sm">{props.dress.is_booked ? `Yes, booked by ${props.dress.current_booking_id}` : "No"}</p>
      </div>
      <div>
        <p className="text-sm font-semibold">Has been rented before?</p>
        <p className="text-sm">{props.dress.has_been_rent_before ? `Yes, rented ${props.dress.previous_rent_ids.length} times` : "No"}</p>
      </div>
      {props.dress.has_been_rent_before && (
        <div>
          <p className="text-sm font-semibold">Previous rent IDs:</p>
          <ul className="text-sm">
            {props.dress.previous_rent_ids.map((id, index) => (
              <li key={index}>{id}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

export default function DressesList() {
const [dresses, setDresses] = useState([]);

// This method fetches the records from the database.
useEffect(() => {
    async function getDresses() {
    const response = await fetch(`http://localhost:5050/dress/`);
    if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
    }
    const dresses = await response.json();
    setDresses(dresses);
    }
    getDresses();
}, []);

// This method will delete a record
async function deleteDress(id) {
  const confirmation = window.confirm("Are you sure you want to delete this record?");
  if (confirmation) {
      await fetch(`http://localhost:5050/dress/${id}`, {
          method: "DELETE",
      });
      const newDresses = dresses.filter((el) => el._id !== id);
      setDresses(newDresses);
  }
}


// This following section will display the records as cards.
return (
    <>
    <h3 className="text-lg font-semibold p-4">Dress Records</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {dresses.map((dress) => (
        <Dress
            dress={dress}
            deleteDress={() => deleteDress(dress._id)}
            key={dress._id}
        />
        ))}
    </div>
    <div className="flex justify-center mt-4">
        <Link
        className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
            to="/dresses/create"
        >
        Add New Dress
        </Link>
    </div>
    </>
);
}