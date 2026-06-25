import Image from "next/image";
import ProfileClient from "./profileClient/page";
import DeveloperProfile from "./profuleDeveloper/page";
import AdminProfile from "./profileAdmin/page";
import Signin from "./signin/page";
import Login from "./login/page";

export default function Home() {
  return (
    <div>
        {/* <ProfileClient/> */}
        {/* <DeveloperProfile/> */}
        {/* <AdminProfile/> */}
        {/* <Signin/> */}
        <Login/>
    </div>
  );
}
