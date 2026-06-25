
"use client"
import { useRouter } from 'next/navigation'
// import { useRouter } from 'next/router'

function Login() {
  const router= useRouter()
  return (
   <div className='relative h-screen bg-gradient-to-r from-[#e5ebf0] to-blue-200'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2 min-w-96 '>
        <form className="w-full max-w-lg  py-8 px-9 backdrop-blur-xl border  border-black/20 rounded-2xl shadow-2xl">
        <div className="-mx-3 mb-6">
            <div className="w-full  px-3 mb-6 md:mb-0">
            <label className="block uppercase  text-gray-700  mb-2" htmlFor="grid-first-name">
                Email
            </label>
            <input className="block appearance-none w-full bg-white border border-gray-200  text-[#103356]  py-3 px-4 pr-8 rounded focus:bg-white" id="grid-first-name" type="Email" placeholder="Enter Your Email" required/>
            </div>
        </div>
        <div className=" -mx-3 mb-6">
            <div className="w-full px-3">
            <label className="block uppercase  text-gray-700 mb-2" htmlFor="grid-password">
                Password
            </label>
            <input className="block appearance-none w-full bg-white border border-gray-200  text-[#103356]  py-3 px-4 pr-8 rounded focus:border-gray-500" id="grid-password" type="password" placeholder="******************" required/>
            </div>
        </div>
        <button className='py-2 w-full bg-[#103356] text-white rounded-xl text-xl mt-8 block m-auto'>Login</button>
        <p className='text-sm text-[#103356] text-center mt-3.5  '>create an Account <span className='text-blue-800 ml-5 cursor-pointer'  onClick={()=>{router.push("/signin")}}>Sign in</span> </p>

                </form>
      </div>
    </div>
  )
}

export default Login
