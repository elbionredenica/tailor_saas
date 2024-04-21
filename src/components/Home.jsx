import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-bold mb-4">Hello!</h2>
      <p className="text-xl text-gray-700 mb-8">Welcome to My App. Please select an option below:</p>
      <div className="space-y-4">
        <NavLink to="/dresses" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">View Dresses</NavLink>
        <NavLink to="/clients" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">View Clients</NavLink>
      </div>
    </div>
  );
};

export default Home;