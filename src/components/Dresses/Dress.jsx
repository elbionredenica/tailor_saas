import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Dress() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    image_url: "",
    attributes: {
        price: 0,
        color: "",
        size: "",
        fabric: "",
        length: "",
        category: "",
    },
    available_for_rent: false,
    is_booked: false,
    current_booking_id: "",
    has_been_rent_before: false,
    previous_rent_ids: []
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
        `http://localhost:5050/dress/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const dress = await response.json();
      if (!dress) {
        console.warn(`Dress with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(dress);
      // Set image URL if it exists in the record
      if (dress.image_url) {
        setImageUrl(dress.image_url);
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
        if (value.hasOwnProperty('attributes')) {
          return {
            ...prev,
            // Ensure that attributes object is also preserved
            attributes: {
              ...prev.attributes,
              // Merge the new attributes with the previous attributes
              ...value.attributes
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
      updateForm({ image_url: reader.result });
      setImageUrl(reader.result); // Set the uploaded image URL
      setImageFile(file); // Set the uploaded image file
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function removeImage() {
    setImageUrl(""); // Clear the image URL
    updateForm({ image_url: "" }); // Clear the image URL in the form state
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
        response = await fetch("http://localhost:5050/dress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      } else {
        // if we are updating a record we will PATCH to /record/:id.
        response = await fetch(`http://localhost:5050/dress/${params.id}`, {
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
            description: "",
            image_url: "",
            attributes: {
              price: 0,
              color: "",
              size: "",
              fabric: "",
              length: "",
              category: "",
            },
            available_for_rent: false,
            is_booked: false,
            current_booking_id: "",
            has_been_rent_before: false,
            previous_rent_ids: []
          }));
          navigate("/dresses");
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-semibold text-center text-gray-800 py-4">Create/Update Dress Record</h3>
      <form onSubmit={onSubmit} className="px-6 pb-8">
        {/* Dress Information */}
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            className="form-input w-full"
            placeholder="Dress Name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            id="description"
            rows="2"
            className="form-textarea w-full"
            placeholder="Dress Description"
            value={form.description}
            onChange={(e) => updateForm({ description: e.target.value })}
          ></textarea>
        </div>
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
        {/* Attributes */}
        <h3 className="text-lg font-semibold mb-4">Attributes</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              className="form-input"
              placeholder="Price"
              value={form.attributes.price}
              onChange={(e) => updateForm({ attributes: { price: e.target.value } })}
            />
          </div>
          {/* Color */}
          <div className="mb-4">
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input
              type="text"
              name="color"
              id="color"
              className="form-input"
              placeholder="Color"
              value={form.attributes.color}
              onChange={(e) => updateForm({ attributes: { color: e.target.value } })}
            />
          </div>
          {/* Size */}
          <div className="mb-4">
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">Size</label>
            <input
              type="text"
              name="size"
              id="size"
              className="form-input"
              placeholder="Size"
              value={form.attributes.size}
              onChange={(e) => updateForm({ attributes: { size: e.target.value } })}
            />
          </div>
          {/* Fabric */}
          <div className="mb-4">
            <label htmlFor="fabric" className="block text-sm font-medium text-gray-700 mb-1">Fabric</label>
            <input
              type="text"
              name="fabric"
              id="fabric"
              className="form-input"
              placeholder="Fabric"
              value={form.attributes.fabric}
              onChange={(e) => updateForm({ attributes: { fabric: e.target.value } })}
            />
          </div>
          {/* Length */}
          <div className="mb-4">
            <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">Length</label>
            <input
              type="text"
              name="length"
              id="length"
              className="form-input"
              placeholder="Length"
              value={form.attributes.length}
              onChange={(e) => updateForm({ attributes: { length: e.target.value } })}
            />
          </div>
          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              name="category"
              id="category"
              className="form-input"
              placeholder="Category"
              value={form.attributes.category}
              onChange={(e) => updateForm({ attributes: { category: e.target.value } })}
            />
          </div>
          {/* Available for Rent */}
          <div className="col-span-2">
            <label htmlFor="available_for_rent" className="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="available_for_rent"
                id="available_for_rent"
                className="form-checkbox"
                checked={form.available_for_rent}
                onChange={(e) => updateForm({ available_for_rent: e.target.checked })}
              />
              <span className="ml-2">Available for Rent</span>
            </label>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <input
            type="submit"
            value="Save Dress Record"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </form>
    </div>
  );
}