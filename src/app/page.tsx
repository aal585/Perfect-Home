import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/server-navbar";
import AIChatbot from "@/components/ai-chatbot";
import PropertyRecommendations from "@/components/property-recommendations";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Home as HomeIcon,
  MapPin,
  Shield,
  Sofa,
  Users,
  Network,
  Wrench,
  Zap,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Property Recommendations Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <PropertyRecommendations />
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Featured Properties</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties across
              Egypt
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                image:
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
                title: "Luxury Villa in New Cairo",
                price: "EGP 12,500,000",
                location: "New Cairo",
                beds: 4,
                baths: 3,
                area: "350 sqm",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
                title: "Modern Apartment with Sea View",
                price: "EGP 4,200,000",
                location: "Alexandria",
                beds: 3,
                baths: 2,
                area: "180 sqm",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
                title: "Spacious Family Home",
                price: "EGP 8,750,000",
                location: "6th of October",
                beds: 5,
                baths: 4,
                area: "420 sqm",
              },
            ].map((property, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{property.location}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {property.title}
                  </h3>
                  <p className="text-blue-600 font-bold mb-4">
                    {property.price}
                  </p>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <div className="flex items-center">
                      <HomeIcon className="w-4 h-4 mr-1" />
                      <span>{property.beds} beds</span>
                    </div>
                    <div className="flex items-center">
                      <Wrench className="w-4 h-4 mr-1" />
                      <span>{property.baths} baths</span>
                    </div>
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      <span>{property.area}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/properties"
              className="inline-flex items-center px-6 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              View All Properties
              <ArrowUpRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose SakanEgypt</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're revolutionizing the real estate experience in Egypt with
              AI-powered technology and comprehensive services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Network className="w-6 h-6" />,
                title: "AI-Powered Search",
                description:
                  "Search in Egyptian Arabic dialect using our advanced NLP technology",
              },
              {
                icon: <Sofa className="w-6 h-6" />,
                title: "Furniture Services",
                description:
                  "Virtual furniture placement and purchasing options",
              },
              {
                icon: <Wrench className="w-6 h-6" />,
                title: "Maintenance Support",
                description:
                  "Book reliable maintenance services with trusted providers",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Secure Payments",
                description:
                  "Multiple local payment options including Vodafone Cash and Fawry",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">Properties Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,200+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">27</div>
              <div className="text-blue-100">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Furniture Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Furnish Your Dream Home
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our AI-powered furniture recommendation system helps you
                visualize and furnish your new home before you move in. Browse
                our extensive catalog of furniture and home decor items.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Virtual furniture placement in your property",
                  "AI recommendations based on your style preferences",
                  "Exclusive discounts from top furniture brands",
                  "Seamless delivery and assembly services",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/furniture"
                className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Explore Furniture
                <ArrowUpRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"
                alt="Furniture visualization"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Tours Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Experience Virtual Tours
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore properties from the comfort of your home with our
              immersive 3D virtual tours
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image:
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
                title: "Luxury Villa in New Cairo",
                description:
                  "Take a virtual walkthrough of this stunning villa with panoramic views",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
                title: "Modern Apartment in Alexandria",
                description:
                  "Experience this beachfront apartment with 360° views of the Mediterranean",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
                title: "Family Home in 6th of October",
                description:
                  "Explore this spacious family home with virtual furniture placement",
              },
            ].map((tour, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 w-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute bottom-4 left-4 z-20 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    360° Tour
                  </div>
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{tour.title}</h3>
                  <p className="text-gray-600 mb-4">{tour.description}</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Start Virtual Tour
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect
            property with SakanEgypt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center px-6 py-3 text-blue-600 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            >
              Create an Account
              <ArrowUpRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/properties"
              className="inline-flex items-center px-6 py-3 text-white border border-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <AIChatbot />
    </div>
  );
}
