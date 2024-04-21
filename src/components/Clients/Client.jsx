import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Dress() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    image: "",
    analytics: {
        active: true,
        orders: 0
    }
  });
  const [isNew, setIsNew] = useState(true);
  const [imageUrl, setImageUrl] = useState(""); 
  const [imageFile, setImageFile] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);
      const response = await fetch(
        `http://localhost:5050/client/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const client = await response.json();
      if (!client) {
        console.warn(`Client with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(client);
      // Set image URL if it exists in the record
      if (client.image) {
        setImageUrl(client.image);
      }
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm(prev => {
      // If the value is an object and not an array, merge it deeply with the previous state
      if (typeof value === 'object' && !Array.isArray(value)) {
        // If the updated value is within attributes object
        if (value.hasOwnProperty('analytics')) {
          return {
            ...prev,
            // Ensure that attributes object is also preserved
            analytics: {
              ...prev.analytics,
              // Merge the new attributes with the previous attributes
              ...value.analytics
            }
          };
        } else {
          // Otherwise, treat it as a direct update to the top-level state
          return { ...prev, ...value };
        }
      } else {
        // If value is not an object or an array, treat it as a direct update to the top-level state
        return { ...prev, ...value };
      }
    });
  }
  
  function handleImageUpload(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = () => {
      updateForm({ image: reader.result });
      setImageUrl(reader.result); // Set the uploaded image URL
      setImageFile(file); // Set the uploaded image file
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function removeImage() {
    setImageUrl(""); // Clear the image URL
    updateForm({ image: "" }); // Clear the image URL in the form state
    setImageFile(null); // Clear the image file
  } 

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    const person = { ...form };
    try {
      let response;
      if (isNew) {
        // if we are adding a new record we will POST to /record.
        response = await fetch("http://localhost:5050/client", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      } else {
        // if we are updating a record we will PATCH to /record/:id.
        response = await fetch(`http://localhost:5050/client/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }  
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    } finally {
        setForm(prev => ({
            ...prev,
            name: "",
            email: "",
            phone: "",
            city: "",
            image: "",
            analytics: {
                active: true,
                orders: 0
            }
          }));
        navigate("/clients");
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-semibold text-center text-gray-800 py-4">Create/Update Client</h3>
      <form onSubmit={onSubmit} className="px-6 pb-8">
        {/* Dress Information */}
        <div className="mb-6">
          <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-1">Image Upload</label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label
            htmlFor="imageUpload"
            className="block w-full py-2 text-sm text-gray-700 border rounded-lg border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-center cursor-pointer"
          >
            {imageFile ? "Change Image" : "Choose Image"}
          </label>
          {imageUrl && (
            <div className="mt-2 flex items-center">
              <img
                src={imageUrl}
                alt="Uploaded"
                className="w-32 h-32 rounded-md object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="ml-2 bg-gray-200 text-gray-700 rounded-full p-1 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <span className="text-sm">Remove</span>
              </button>
            </div>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            id="name"
            className="form-input w-full"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            className="form-input w-full"
            placeholder="Email"
            value={form.email}
            onChange={(e) => updateForm({ email: e.target.value })}
          />
        </div>
        <div className="mb-6">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="number"
              name="phone"
              id="phone"
              className="form-input"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => updateForm({ phone: e.target.value })}
            />
        </div>
        <div className="mb-6">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              id="city"
              className="form-input"
              placeholder="City"
              value={form.city}
              onChange={(e) => updateForm({ city: e.target.value })}
            />
        </div>
        
        <div className="flex justify-center mt-6">
          <input
            type="submit"
            value="Save Client"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </form>
    </div>
  );
}