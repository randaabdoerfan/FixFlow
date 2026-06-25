"use client";
import axios from 'axios';
import { useRouter } from 'next/navigation'
import { useState } from 'react';

export default function Signin() {
    const router =useRouter()
    const [formData,SetFormData]= useState({
      name:"",
      email:"",
      password:"",
      confirmPassword:"",
      phone:""
    })
    async function handleForm(e){
      e.preventDefault()
      try{
        const response= await axios.post(
                "http://localhost:8000/users/register",
                {name:formData.name,password:formData.password,confirmPassword:formData.confirmPassword,email:formData.email}
            )
            console.log(response
              
            )


      }catch(err){
        alert("your email is already exist")
            console.log(err)
        
      }

    }
  return (
    <div className='relative h-screen bg-gradient-to-r from-[#e5ebf0] to-blue-200'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '>
        <form onSubmit={handleForm} className="w-full max-w-lg  py-8 px-9 backdrop-blur-xl border  border-black/20 rounded-2xl shadow-2xl">
        <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase  text-gray-700  mb-2" htmlFor="grid-first-name">
                Full name
            </label>
            <input onChange={(e)=>SetFormData({...formData,name:e.target.value})} value={formData.name} className="block appearance-none w-full bg-white border border-gray-200  text-[#103356]  py-3 px-4 pr-8 rounded focus:bg-white" type="text" placeholder="Enter Your Name" required/>
            </div>
            <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase  text-gray-700  mb-2" htmlFor="grid-last-name">
                Email
            </label>
            <input onChange={(e)=>SetFormData({...formData,email:e.target.value})} value={formData.email} className=" block appearance-none w-full bg-white border border-gray-200  text-[#103356]  py-3 px-4 pr-8 rounded focus:border-gray-500" id="grid-last-name" type="text" placeholder="ُEnter Your E-mail" required/>
            </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
            <label className="block uppercase  text-gray-700 mb-2" htmlFor="grid-password">
                Password
            </label>
            <input onChange={(e)=>SetFormData({...formData,password:e.target.value})} value={formData.password} className="block appearance-none w-full bg-white border border-gray-200  text-[#103356]  py-3 px-4 pr-8 rounded focus:border-gray-500" id="grid-password" type="password" placeholder="******************" required/>
            <p className="text-gray-600 text-xs italic">Make it as long and as crazy as d like</p>
            </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full px-3 mb-6 md:mb-0">

            <div className="w-full  px-3 mb-6 md:mb-0">
            <label className="block uppercase text-gray-700 mb-2" htmlFor="grid-zip">
                Confirm Password
            </label>
            <input onChange={(e)=>SetFormData({...formData,confirmPassword:e.target.value})} value={formData.confirmPassword} className="block appearance-none w-full bg-white border border-gray-200  text-[#103356]  py-3 px-4 pr-8 rounded" id="grid-zip" type="text" placeholder="90210" />
            </div>
        </div>
        </div>
        
        <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full px-3 mb-6 md:mb-0">

            <div className="w-full  px-3 mb-6 md:mb-0">
            <label className="block uppercase text-gray-700 mb-2" htmlFor="grid-zip">
                Phone 
            </label>
            <input onChange={(e)=>SetFormData({...formData,phone:e.target.value})} value={formData.phone} className="block appearance-none w-full bg-white border border-gray-200  text-[#103356]  py-3 px-4 pr-8 rounded" id="grid-zip" type="text" placeholder="90210" />
            </div>
        </div>
        </div>
        <button className='py-2 w-full bg-[#103356] text-white rounded-xl text-xl mt-8 block m-auto'>Sign In</button>
        <p className='text-sm text-[#103356] text-center mt-3.5  '>I already have an Account <span className='text-blue-800 ml-5 cursor-pointer'  onClick={()=>{router.push("/login")}}>Login</span> </p>
        </form>
      </div>
    </div>
  )
}
