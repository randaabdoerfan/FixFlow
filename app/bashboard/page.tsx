"use client";
function Dashboard() {
   return (
      <div>
         {/* Information about Cards */}
         <div className="p-4 sm:ml-64">
            <div className="grid grid-cols-1 sm:grid-cols-3   gap-6 mb-2 p-1.5  ">
               {/* card1 */}
               <a
                  href="#"
                  className="flex flex-col items-center p-6 rounded-base shadow-lg rounded-2xl md:flex-row md:max-w-sm"
               >
                  <img
                     className="object-cover p-7 bg-[#FCEBDB] rounded-full rounded-base  mb-4 md:mb-0"
                     src="../../assets/totalTickets.png"
                     alt=""
                  />
                  <div className="flex flex-col justify-between md:p-4 leading-normal">
                     <h5 className="mb-2 text-3xl  tracking-tight text-center sm:text-start text-heading">
                        230
                     </h5>
                     <p className="mb-6  text-2xl  text-[#808080] ">Total Tikets</p>
                     <p className="text-sm text-[#808080] ">Since last month</p>
                  </div>
               </a>
               {/* card2 */}
               <a
                  href="#"
                  className="flex flex-col items-center bg-neutral-primary-soft p-6  rounded-base shadow-lg inset-shadow-2xs rounded-2xl md:flex-row md:max-w-xl md:flex-row md:max-w-xl"
               >
                  <img
                     className="object-cover p-5 bg-[#cafaca] rounded-full rounded-base  mb-4 md:mb-0"
                     src="../../assets/ticketDone.png"
                     alt=""
                  />
                  <div className="flex flex-col justify-between md:p-4 leading-normal">
                     <h5 className="mb-2 text-3xl  tracking-tight text-center sm:text-start text-heading">
                        170
                     </h5>
                     <p className="mb-6  text-2xl  text-[#808080] ">
                        Resolved Tickets
                     </p>
                     <p className="text-sm text-[#808080] ">Since last week</p>
                  </div>
               </a>
               {/* card3 */}
               <a
                  href="#"
                  className="flex flex-col items-center bg-neutral-primary-soft p-6  rounded-base shadow-lg inset-shadow-2xs rounded-2xl md:flex-row md:max-w-xl md:flex-row md:max-w-xl"
               >
                  <img
                     className="object-cover p-7 bg-[#FCDBDB] rounded-full rounded-base  mb-4 md:mb-0"
                     src="../../assets/jam_triangle-danger-f.png"
                     alt=""
                  />
                  <div className="flex flex-col justify-between md:p-4 leading-normal">
                     <h5 className="mb-2 text-3xl  tracking-tight text-center sm:text-start text-heading">
                        50
                     </h5>
                     <p className="mb-6  text-2xl  text-[#808080] ">High Priority</p>
                     <p className="text-sm text-[#808080] ">Since last week</p>
                  </div>
               </a>
            </div>
         </div>



         {/* details */}

         <div className="p-4 sm:ml-64">
            <div className="container flex flex-col lg:flex-row w-full  ">
            {/* table */}
            <div className="clintTicket  w-4/6 ">
               <div className="relative overflow-x-auto  shadow-xs rounded-base ">
                  <table className="w-full text-sm text-left rtl:text-right text-body  ">
                     <thead className="bg-neutral-secondary-soft border-b text-[#6a6a6a] border-b-gray-400 border-default">
                           <tr>
                              <th scope="col" className="px-6 py-3 font-medium">
                                 Ticket
                              </th>
                              <th scope="col" className="px-6 py-3 font-medium">
                                 Category
                              </th>
                              <th scope="col" className="px-6 py-3 font-medium">
                                 Date
                              </th>
                              <th scope="col" className="px-6 py-3 font-medium">
                                 Status
                              </th>
                              <th scope="col" className="px-6 py-3 font-medium">
                                 Edit
                              </th>
                           </tr>
                     </thead>
                     <tbody>
                           <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b  border-b-gray-400 border-default">
                              <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                 Apple MacBook Pro 17
                              </th>
                              <td className="px-6 py-4">
                                 Silver
                              </td>
                              <td className="px-6 py-4">
                                 Laptop
                              </td>
                              <td className="px-6 py-4">
                                 <p className="w-fit py-1.5 px-2 text-sm/3 text-[#00B69B] bg-[#00b69b46] rounded-2xl">Completed</p>
                              </td>
                              <td className="px-6 py-4">
                                 <a href="#" className="font-medium text-fg-brand hover:underline">Edit</a>
                              </td>
                           </tr>
                           <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-b  border-b-gray-400 border-default">
                              <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                 Microsoft Surface Pro
                              </th>
                              <td className="px-6 py-4">
                                 White
                              </td>
                              <td className="px-6 py-4">
                                 Laptop PC
                              </td>
                              <td className="px-6 py-4">
                                 $1999
                              </td>
                              <td className="px-6 py-4">
                                 <a href="#" className="font-medium text-fg-brand hover:underline">Edit</a>
                              </td>
                           </tr>
                           <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b  border-b-gray-400 border-default">
                              <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                 Magic Mouse 2
                              </th>
                              <td className="px-6 py-4">
                                 Black
                              </td>
                              <td className="px-6 py-4">
                                 Accessories
                              </td>
                              <td className="px-6 py-4">
                                 $99
                              </td>
                              <td className="px-6 py-4">
                                 <a href="#" className="font-medium text-fg-brand hover:underline">Edit</a>
                              </td>
                           </tr>
                           <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b  border-b-gray-400 border-default">
                              <th scope="row" className="px-6 py-4 font-medium text-heading  border-b-gray-400whitespace-nowrap">
                                 Google Pixel Phone
                              </th>
                              <td className="px-6 py-4">
                                 Gray
                              </td>
                              <td className="px-6 py-4">
                                 Phone
                              </td>
                              <td className="px-6 py-4">
                                 $799
                              </td>
                              <td className="px-6 py-4">
                                 <a href="#" className="font-medium text-fg-brand hover:underline">Edit</a>
                              </td>
                           </tr>
                           <tr className="odd:bg-neutral-primary even:bg-neutral border-b-gray-400 -secondary-soft">
                              <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                 Apple Watch 5
                              </th>
                              <td className="px-6 py-4">
                                 Red
                              </td>
                              <td className="px-6 py-4">
                                 Wearables
                              </td>
                              <td className="px-6 py-4">
                                 $999
                              </td>
                              <td className="px-6 py-4">
                                 <a href="#" className="font-medium text-fg-brand hover:underline">Edit</a>
                              </td>
                           </tr>
                     </tbody>
                  </table>
               </div>

            </div>

               {/* chart */}
               <div className="chart w-2/6 bg-amber-900">
   f
               </div>

         </div>
         </div>



      </div>
   );
}

export default Dashboard;
