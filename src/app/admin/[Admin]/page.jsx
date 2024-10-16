"use client"
import CreateItem from "@/app/componets/Createitems/createitem";
import ProductList from "@/app/componets/displayitem/display";




export default function Admin() {

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      {/* Create Item without passing onCreate */}
      <CreateItem/>

   
      <ProductList/>
    </div>
  );
}
