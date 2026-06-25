"use client"
import Sidebar from '../component/sidebar/sidebar'

function Teams() {
  return (
    <div>
      <Sidebar role='admin'/>
       <div className="p-4 sm:ml-64">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-2 p-1.5  ">
                {/* Card1 */}
                <a
                  href="#"
                  className="flex-col justify-center items-center p-6 rounded-base shadow-lg rounded-2xl md:flex-row md:max-w-sm"
               >
                <img
                     className=" m-auto p-7 bg-[#10335646] rounded-full rounded-base mb-4 md:mb-0"
                     src="../../assets/streamline-plump_customer-support-7-solid.png"
                     alt=""
                  />
                  <div className="flex flex-col items-center justify-between md:p-4 leading-normal">
                     <h5 className="mb-2 text-3xl  tracking-tight text-center sm:text-start text-heading">
                        230
                     </h5>
                     <p className="mb-6  text-2xl  text-[#808080] ">Customer Support</p>
                     <p className="text-sm text-[#808080] ">Details</p>
                  </div>
               </a>
               {/* Card2 */}
                <a
                  href="#"
                  className="flex-col justify-center items-center p-6 rounded-base shadow-lg rounded-2xl md:flex-row md:max-w-sm"
               >
                <img
                     className=" m-auto p-7 bg-[#10335646] rounded-full rounded-base mb-4 md:mb-0"
                     src="../../assets/hugeicons_developer.png"
                     alt=""
                  />
                  <div className="flex flex-col items-center justify-between md:p-4 leading-normal">
                     <h5 className="mb-2 text-3xl  tracking-tight text-center sm:text-start text-heading">
                        230
                     </h5>
                     <p className="mb-6  text-2xl  text-[#808080] ">Developers</p>
                     <p className="text-sm text-[#808080] ">Details</p>
                  </div>
               </a>
               {/* Card3 */}
                <a
                  href="#"
                  className="flex-col justify-center items-center p-6 rounded-base shadow-lg rounded-2xl md:flex-row md:max-w-sm"
               >
                <img
                     className=" m-auto p-7 bg-[#10335646] rounded-full rounded-base mb-4 md:mb-0"
                     src="../../assets/fa_users.png"
                     alt=""
                  />
                  <div className="flex flex-col items-center justify-between md:p-4 leading-normal">
                     <h5 className="mb-2 text-3xl  tracking-tight text-center sm:text-start text-heading">
                        230
                     </h5>
                     <p className="mb-6  text-2xl  text-[#808080] ">Financial</p>
                     <p className="text-sm text-[#808080] ">Details</p>
                  </div>
               </a>
            </div>
        </div>

    </div>
  )
}

export default Teams
