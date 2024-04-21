import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">My App</h1>
          <div className="flex space-x-4">
            <NavLink to="/dresses" className="text-white hover:text-gray-300">Dresses</NavLink>
            <NavLink to="/clients" className="text-white hover:text-gray-300">Clients</NavLink>
            <NavLink to="/orders" className="text-white hover:text-gray-300">Orders</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}