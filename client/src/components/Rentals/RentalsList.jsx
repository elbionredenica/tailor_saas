import { useEffect, useState } from "react";
import Rental from "./Rental"; // Import the Rental component

export default function RentalList() {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    async function getRentals() {
      try {
        const response = await fetch(`http://localhost:5050/rental/`);
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
        const rentalsData = await response.json();
        setRentals(rentalsData);
      } catch (error) {
        console.error(error);
      }
    }
    getRentals();
  }, []);

  async function deleteRental(id) {
    const confirmation = window.confirm("Are you sure you want to delete this rental?");
    if (confirmation) {
      try {
        await fetch(`http://localhost:5050/rental/${id}`, {
          method: "DELETE",
        });
        const updatedRentals = rentals.filter((rental) => rental._id !== id);
        setRentals(updatedRentals);
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Rental Records</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {rentals.map((rental) => (
          <Rental
            rental={rental}
            deleteRental={() => deleteRental(rental._id)}
            key={rental._id}
          />
        ))}
      </div>
    </>
  );
}
