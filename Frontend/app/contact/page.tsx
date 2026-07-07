import Footer from "../components/heroComponent/Footer";
import Navbar from "../components/heroComponent/NavbarHero";

export default function ContactPage() {
  return (
    <div className="force-light">
    <Navbar/>
    <main className="min-h-screen bg-gray-50 py-16 px-6 m-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Contact Us
        </h1>

        <p className="text-lg text-gray-700 mb-10">
          We'd love to hear from you. Whether you have a question, need
          technical support, or want to share feedback about FixFlow, feel free
          to get in touch.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Contact Information
            </h2>

            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold">📧 Email</h3>
                <p>support@fixflow.com</p>
              </div>

              <div>
                <h3 className="font-semibold">📞 Phone</h3>
                <p>+20 100 123 4567</p>
              </div>

              <div>
                <h3 className="font-semibold">📍 Address</h3>
                <p>Cairo, Egypt</p>
              </div>

              <div>
                <h3 className="font-semibold">🕒 Working Hours</h3>
                <p>Sunday - Thursday</p>
                <p>9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Send us a Message
            </h2>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                rows={5}
                placeholder="Your Message"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
    <Footer/>
    </div>
  );
}