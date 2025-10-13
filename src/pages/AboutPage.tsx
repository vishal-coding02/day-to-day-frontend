import { useState } from "react";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";

const AboutUs : any = () => {
  const [activeTab, setActiveTab] = useState("mission");

  const stats = [
    { number: "10,000+", label: "Happy Customers" },
    { number: "500+", label: "Verified Service Providers" },
    { number: "50+", label: "Cities Across India" },
    { number: "24/7", label: "Customer Support" }
  ];

  const teamMembers = [
    {
      name: "Rohan Kumar",
      role: "Founder & CEO",
      image: "/api/placeholder/150/150",
      description: "Passionate about revolutionizing home services in India"
    },
    {
      name: "Priya Sharma",
      role: "Head of Operations",
      image: "/api/placeholder/150/150",
      description: "Ensuring seamless service delivery across all cities"
    },
    {
      name: "Amit Patel",
      role: "Technology Lead",
      image: "/api/placeholder/150/150",
      description: "Building robust platforms for better user experience"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About HomeServe India
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Revolutionizing home services across India by connecting skilled professionals 
              with homeowners who need reliable, affordable, and quality services.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Story & Vision
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Founded with a vision to transform the home services industry in India, 
              we bridge the gap between skilled professionals and customers seeking quality services.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {[
                  { id: "mission", label: "Our Mission" },
                  { id: "vision", label: "Our Vision" },
                  { id: "values", label: "Our Values" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 px-6 text-center font-medium text-lg transition-colors ${
                      activeTab === tab.id
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              {activeTab === "mission" && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                  <p className="text-gray-700 leading-relaxed">
                    To create India's most trusted home services platform that empowers skilled professionals 
                    and provides homeowners with reliable, affordable, and high-quality services at their doorstep.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Empower local service providers with digital tools and consistent work opportunities</li>
                    <li>Provide customers with transparent pricing and verified service professionals</li>
                    <li>Build a ecosystem where quality service is rewarded and trust is built</li>
                  </ul>
                </div>
              )}

              {activeTab === "vision" && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We envision a future where every Indian homeowner can access quality home services 
                    with just a few clicks, and every skilled professional can build a sustainable livelihood 
                    through our platform.
                  </p>
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-semibold">
                      "To become the most preferred home services platform in India, known for reliability, 
                      quality, and fair opportunities for all stakeholders."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "values" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">Our Values</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="font-bold text-lg text-blue-600 mb-2">Trust & Transparency</h4>
                      <p className="text-gray-700">
                        We believe in building relationships based on trust, with transparent pricing 
                        and honest communication between customers and service providers.
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="font-bold text-lg text-green-600 mb-2">Quality First</h4>
                      <p className="text-gray-700">
                        Every service delivered through our platform meets the highest standards 
                        of quality and customer satisfaction.
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="font-bold text-lg text-purple-600 mb-2">Innovation</h4>
                      <p className="text-gray-700">
                        We continuously innovate to make home services more accessible, efficient, 
                        and rewarding for everyone involved.
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="font-bold text-lg text-orange-600 mb-2">Empowerment</h4>
                      <p className="text-gray-700">
                        We empower local service professionals with technology, training, and 
                        opportunities to grow their businesses.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How HomeServe Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A seamless process designed for both customers and service providers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Post Service Request</h3>
              <p className="text-gray-600">
                Customers post their service requirements with details about the work needed, 
                location, and budget.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Connect with Professionals</h3>
              <p className="text-gray-600">
                Verified service providers review requests and customers can choose the best 
                professional for their needs.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Quality Service</h3>
              <p className="text-gray-600">
                Professionals deliver quality services, and customers provide feedback to 
                maintain service standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Passionate individuals working together to revolutionize home services in India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden text-center hover:shadow-xl transition-shadow">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mx-auto mt-8 flex items-center justify-center text-white text-4xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the HomeServe Community
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Whether you're a customer looking for reliable services or a professional seeking 
            growth opportunities, HomeServe is here for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/signup'}
              className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Sign Up as Customer
            </button>
            <button 
              onClick={() => window.location.href = '/signup'}
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Become a Service Provider
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;