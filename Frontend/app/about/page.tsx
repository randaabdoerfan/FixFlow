import Navbar from '../components/heroComponent/NavbarHero'
import Footer from '../components/heroComponent/Footer';

export default function AboutPage() {
  return (
    <div className="force-light">
      <Navbar/>
      <main className="min-h-screen bg-gray-50 py-16 px-6 mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About FixFlow
          </h1>

          <p className="text-lg text-gray-700 mb-6">
            FixFlow is an Incident Management System designed to help
            organizations efficiently manage incidents, assign tickets, and
            improve communication between managers, agents, and users.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
              <p className="text-gray-600">
                To simplify incident reporting, tracking, and resolution through
                an intuitive and reliable platform.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-semibold mb-3">Features</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Create and track incidents</li>
                <li>Assign tickets to support agents</li>
                <li>Real-time status updates</li>
                <li>Secure authentication and authorization</li>
                <li>Role-based dashboards</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 bg-blue-50 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-3">Why FixFlow?</h2>
            <p className="text-gray-700">
              Our goal is to reduce downtime and improve collaboration by
              providing a centralized platform for incident management from
              creation to resolution.
            </p>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}