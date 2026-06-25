"use client";
import Link from 'next/link';
import React, { useState } from 'react'
import { menuConfig } from './mainConfig';



function Sidebar({role="admin"}) {
   
   const [open ,setOpen]= useState(false)
     const menuItems = menuConfig[role] || [];
  return (
    <div>
        <button onClick={()=>setOpen(!open)} data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="text-heading bg-transparent box-border border border-transparent duration-300 ease-in-out hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base ms-3 mt-3 text-sm p-2 focus:outline-none inline-flex sm:hidden">
   <span className="sr-only">Open sidebar</span>
   <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10"/>
   </svg>
</button>
<aside id="logo-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-full transition-transform
  ${open ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`} aria-label="Sidebar">
    
   <div className="h-full px-3 py-4 overflow-y-auto bg-[var(--main2-color)] rounded ">
    <button onClick={()=>setOpen(!open)} className="block lg:hidden  text-white p-2 rounded">
          X
          </button>
    <div className="flex mb-20 ">
      <img src="../../assets/Vector.png" className="h-8 me-3"  />
         <span className="self-center text-lg text-[var(--main-color)] font-semibold whitespace-nowrap">Incident Management</span>
    </div>
    {/* icons */}
         <ul className="space-y-20 font-medium">
         {
            menuItems?.map((item,index)=>(
               <li key={index}>
            <Link href={item.href} className="flex items-center px-2 py-1.5 text-[var(--main-color)] rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
              <img src={item.icon} alt="" />
               <span className="ms-3">{item.label}</span>
            </Link>
         </li>

            ))
         }
      </ul>
   </div>
</aside>

      
    </div>
  )
}

export default Sidebar
