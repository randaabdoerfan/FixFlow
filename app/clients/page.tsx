"use client";
import { useState } from "react";
import Sidebar from "../component/sidebar/sidebar";
import { title } from "process";

function Clients() {
  const [clientData , setClientData]=useState({
    title:"",
    category:'',
    description:""
  }) 
  function handleSubmit(e: { preventDefault: () => void; }){
    e.preventDefault();
    try{
      console.log(`${clientData}`)

    }catch(err){
      console.log(err)
    }
  }
  return (
    <div>
      <Sidebar role="client"/>
      <div className="p-4 sm:ml-64">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4  mb-2  ">
         <div className="h-11/12-relative">
  <form onSubmit={handleSubmit} className="w-full max-w-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-8 px-9 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl ">

    {/* Row 1: Ticket Title + Category */}
    <div className="flex flex-wrap -mx-3 mb-6">

      <div className="w-full  px-3 mb-6 md:mb-0">
        <label className="block uppercase text-[#103356] mb-2">
          Ticket Title
        </label>
        <input
          value={clientData.title}
          onChange={(e)=>{setClientData({...clientData, title:e.target.value})}}
          className="appearance-none block w-full bg-white text-[#103356] border border-gray-200 rounded py-3 px-4"
          type="text"
          placeholder="technical issue"
          required
        />

      </div>

      <div className="w-full  px-3">
        <label className="block uppercase text-[#103356] mb-2">
          Category
        </label>

        <div className="relative">
          <select value={clientData.category} onChange={(e)=>{setClientData({...clientData,category:e.target.value})}} className="block appearance-none w-full bg-white border border-gray-200  text-[#103356]  py-3 px-4 pr-8 rounded">
            <option value="Technical Issue">Technical Issue</option>
            <option value='Billing Issue'>Billing Issue</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Complaint">Complaint</option>
            <option value="Other">Other</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2  text-white">
            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

    </div>

    {/* Row 2: Reporter Info (Last Name + Password) */}
    {/* <div className="flex flex-wrap -mx-3 mb-6">

      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label className="block uppercase  text-white     mb-2">
          Reporter Name
        </label>
        <input
          className="appearance-none block w-full bg-white text-[#103356]   border border-gray-200 rounded py-3 px-4"
          type="text"
          placeholder="Doe"
        />
      </div> */}
        {/* Priority */}
      {/* <div className="w-full md:w-1/2  px-3">
        <label className="block uppercase text-[#103356] mb-2">
          Role
        </label>

        <div className="relative">
          <select className="block appearance-none w-full bg-white border border-gray-200  text-[#103356]  py-3 px-4 pr-8 rounded">
            <option>Client</option>
            <option>Developer</option>
            <option>Admin</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2  text-white">
            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
            </div> */}
    {/* Row 3: City + Details */}
    <div className="flex flex-wrap -mx-3 mb-6">

      

      <div className="w-full px-3">
        <label className="block uppercase  text-[#103356]   mb-2">
          Descriptions
        </label>
        <textarea
        value={clientData.description}
        onChange={(e)=>{setClientData({...clientData,description:e.target.value})}}
        rows={4}
          className="appearance-none block w-full bg-white text-[#103356]  border border-gray-200 rounded py-3 px-4"
          placeholder="Details"
          required
        />
      </div>
      {/* Button */}
      <div className="w-full px-3">
        <button type="submit" className="block uppercase text-center px-20 py-2 rounded-xl block m-auto mt-4 bg-[#103356] text-white text-text-xl font-bold   mb-2">
          Send
        </button>
      </div>

    </div>

  </form>
</div>
        </div>
      </div>
    </div>
     
  );
}

export default Clients;
