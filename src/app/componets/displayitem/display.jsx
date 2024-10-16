import { useEffect, useState } from 'react';
import { deleteItem, getItems, sendId } from './api';

export default function ProductList() {
  const [items, setItems] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const [selectedItemId, setSelectedItemId] = useState(null); // State for selected item ID

  useEffect(() => {
    async function fetchItems() {
      try {
        const data = await getItems(); // Await the getItems function
        setItems(data.pdfs || []); // Use data.pdfs if available, else default to []
        console.log("Fetched data:", data); // Log data to check the structure
      } catch (error) {
        console.error("Error fetching product data:", error);
        setError("Failed to fetch items."); // Set error message in state
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    }

    fetchItems();
  }, []); // Empty dependency array ensures the effect runs only once

  const handleDelete = async (id) => {
    try {
      await deleteItem(id); // Call the delete function
      setItems((prevItems) => prevItems.filter((item) => item._id !== id)); // Remove the deleted item from state
      if (selectedItemId === id) setSelectedItemId(null); // Clear selected item if deleted
    } catch (error) {
      console.error("Error deleting item:", error);
      setError("Failed to delete item."); // Set error message in state
    }
  };

  const handleSubmit =  async (id) =>{

    await sendId(id);

  }
  

  const handleDownload = (item) => {
    const link = document.createElement('a'); // Create a new anchor element
    link.href = `http://localhost:3001/uploads/${item.filePath.split('/').pop()}`; // Set href to the PDF file URL
    link.download = item.filePath.split('/').pop(); // Set the download attribute
    document.body.appendChild(link); // Append the link to the body
    link.click(); // Trigger the download
    document.body.removeChild(link); // Remove the link after triggering download
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg max-w-4xl mx-2 mt-6">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">List of PDFs</h1>
      
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      <ul className="divide-y divide-gray-300">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item) => (
            <li 
              key={item._id} 
              className="flex items-center justify-between p-4 bg-white rounded-md hover:bg-gray-50 transition-shadow duration-300"
            >
              {/* Display PDF file name */}
              <span 
                className="text-blue-600 underline cursor-pointer flex-1"
                onClick={() => handleDownload(item)} // Trigger download on click
              >
                {item.filePath.split('/').pop()} {/* Display only the file name */}
              </span>

              {/* Radio button to select item */}
              <button 
                onClick={() => handleSubmit(item._id)} 
                className="ml-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-red-950 focus:outline-none focus:ring-2 focus:ring-red-400">
                Send Data
              </button>

              {/* Delete button */}
              <button 
                onClick={() => handleDelete(item._id)} 
                className="ml-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-600 mt-4">No items found</p>
        )}
      </ul>
    </div>
  );
}
