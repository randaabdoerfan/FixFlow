import Footer from "../components/heroComponent/Footer";
import NavbarHero from "../components/heroComponent/NavbarHero";


export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return  (
    <div className="force-light">
      <NavbarHero/>
      <main>{children}</main>
      <Footer />
    </div>
    )
}