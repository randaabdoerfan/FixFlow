
function ClientTicket() {
  return (
    <div>
      <div>
      <div className="p-4 sm:ml-64 h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-10/12 bg-white mb-2  ">
          {/* column1 */}
          <div className="col-span-1 ">
            <div className="search flex gap-1">
              <input
                type="text"
                className="w-3/4 p-1 outline-mist-800 border border--mist-800 "
                placeholder="search"
              />
              <button className="p-1 border ">
                <img src="../../assets/search.png" alt="" />
              </button>
            </div>
            {/*card*/}
            <a
              href="#"
              className="flex flex-col items-center py-1 px-2.5 rounded-base shadow-lg rounded-xl md:flex-row md:max-w-sm"
            >
              <img
                className="object-cover p-5 bg-[#FCEBDB] rounded-full rounded-base  mb-4 md:mb-0"
                src="../../assets/boxicons_user.png"
                alt=""
              />
              <div className="flex flex-col justify-between md:p-4 leading-normal">
                <h5 className="mb-2 tracking-tight text-center sm:text-start text-heading">
                  UserName
                </h5>
                <p className="mb-6   text-[#808080] ">The Issue</p>
                <p className="w-fit py-1.5 px-2 text-sm/3 text-[#fd1f1f] bg-[#FCDBDB] rounded-2xl">
                  Problem
                </p>
              </div>
            </a>
          </div>

          {/* column2 */}
          <div className="col-span-2 shadow-lg flex-column  rounded-2xl">
            <div className="h-full">
              {/* Chat */}
              <div className="container">
                <div className="flex  items-start gap-2.5 px-2 py-2.5 bg-[#f8f8f8] w-3/6 h-11/12 m-2.5 mt-3.5 rounded-xl">
                  <img
                    className=" rounded-full bg-[#FCEBDB] p-2 rounded-base mb-4 md:mb-0"
                    src="../../assets/boxicons_user.png"
                    alt="Jese image"
                  />
                  <div className="flex flex-col gap-1 w-full max-w-[320px]">
                    <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                      <span className="text-sm font-semibold text-heading">
                        Bonnie Green
                      </span>
                      <span className="text-sm text-body">11:46</span>
                    </div>
                    <div className="flex flex-col leading-1.5 p-4 bg-neutral-secondary-soft rounded-e-base rounded-es-bas">
                      <p className="text-sm text-body">
                        {" "}
                        awesome. I think our users will really appreciate the
                        improvements.
                      </p>
                    </div>
                    <span className="text-sm text-body">Delivered</span>
                  </div>
                  <button
                    id="dropdownMenuIconButton"
                    data-dropdown-toggle="dropdownDots"
                    data-dropdown-placement="bottom-start"
                    className="inline-flex self-center items-center text-body hover:text-heading bg-neutral-primary box-border border border-transparent hover:bg-neutral-tertiary focus:ring-4 focus:ring-neutral-tertiary rounded-base p-1.5 focus:outline-none"
                    type="button"
                  >
                    <svg
                      className="w-6 h-6"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-width="3"
                        d="M12 6h.01M12 12h.01M12 18h.01"
                      />
                    </svg>
                  </button>
                  <div
                    id="dropdownDots"
                    className="z-10 bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-40 block hidden"
                  >
                    <ul
                      className="p-2 text-sm text-body font-medium"
                      aria-labelledby="dropdownMenuIconButton"
                    >
                      <li>
                        <a
                          href="#"
                          className="block w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md"
                        >
                          Reply
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md"
                        >
                          Forward
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md"
                        >
                          Copy
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md"
                        >
                          Report
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md"
                        >
                          Delete
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* finish chat*/}
             
            </div>
             {/* chat box */}
              <div className="flex gap-2.5">
                <input
                  type="text"
                  className="w-2/3 border border-1 outline-0 pl-2 hover:outline-0"
                  name=""
                  id=""
                  placeholder="chat"
                />
                <button className="py-1.5 px-4 bg-[#103356] rounded-xl text-white">
                  Send
                </button>
              </div>
            {/* finish chat */}
          </div>
        </div>
      </div>
    </div>
  );
    </div>
  )
}

export default ClientTicket
