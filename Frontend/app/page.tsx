import NavbarHero from "./components/heroComponent/NavbarHero";
import Sidebar from "./components/sidebar/sidebar";
import SignUp from "./(public)/auth/signup/page";
import ResetPassword from "./(public)/auth/forgot-password/page";
import ConfirmNewPassword from "./(public)/auth/reset-password/page";
// import Admin from "./(dashboard)/profileAdmin/page";
import FixFlow from "./fixflow/page";
// import Developer from "./(dashboard)/developerDashboard/page";
import Footer from "./components/heroComponent/Footer";

export default function Home() {
  return (
    <div className="force-light">
      <NavbarHero />
      <FixFlow />
      <Footer />
    </div>
  );
}
