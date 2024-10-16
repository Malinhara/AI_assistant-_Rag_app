import axios from "axios";

export const getItems = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/view`);
    return response.data; // Ensure this returns the correct structure
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:3001/delete/${id}`); // DELETE request to the backend
    return response.data; // Return the response data if needed
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};


export const sendId =  async (id) =>{
try{
   
  const res =  await axios.post(`http://localhost:3001/pdf/find/${id}`);
  return res.data;
}
catch(error){

  throw error;

}

}
