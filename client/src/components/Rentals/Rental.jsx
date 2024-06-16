import React from "react";
import { Link } from "react-router-dom";

const Rental = (props) => (
  <div className="border rounded-lg p-4 mb-4">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-semibold">{props.rental.dress_id}</h3>
      <div>
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/rental/edit/${props.rental._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-block ml-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
          onClick={() => props.deleteRental(props.rental._id)}
        >
          Delete
        </button>
      </div>
    </div>
    <p className="text-sm font-semibold">Booking Client ID:</p>
    <p className="text-sm">{props.rental.booking_client_id}</p>
    <p className="text-sm font-semibold">Start Date:</p>
    <p className="text-sm">{props.rental.date_booked_start}</p>
    <p className="text-sm font-semibold">End Date:</p>
    <p className="text-sm">{props.rental.date_booked_end}</p>
    <p className="text-sm font-semibold">Rent Price:</p>
    <p className="text-sm">{props.rental.rent_price}</p>
    <p className="text-sm font-semibold">Status:</p>
    <p className="text-sm">{props.rental.status}</p>
  </div>
);

export default Rental;
