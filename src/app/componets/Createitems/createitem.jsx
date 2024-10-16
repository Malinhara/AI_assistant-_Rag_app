import { useState } from "react";
import { addItem } from "./api"; // Import the axios function

const CreateItem = () => {
  const [file, setFile] = useState(null); // State for the file
  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(""); // To handle error state

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (file) {
      setLoading(true);
      setError(""); // Clear any previous error

      try {
        console.log("Submitting PDF file...");

        // Create FormData to send the file
        const formData = new FormData();
        formData.append("file", file);

        // Send data to the backend using axios
        const result = await addItem(formData); // Call addItem with FormData
        console.log("Response:", result.message); // Log success message from backend

        setFile(null); // Clear file input
      } catch (err) {
        console.error("Error submitting file:", err);
        setError("Failed to upload PDF. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please select a PDF file to upload.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="file"
        accept="application/pdf" // Restrict to PDF files only
        onChange={(e) => {
          const selectedFile = e.target.files ? e.target.files[0] : null; // Properly check for files
          setFile(selectedFile);
        }}
        className="border p-2 mr-2"
      />
      <button
        type="submit"
        className={`bg-blue-500 text-white p-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading} // Disable button during loading
      >
        {loading ? "Uploading..." : "Upload PDF"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default CreateItem;
