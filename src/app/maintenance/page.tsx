"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Clock, Star, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "../../../supabase/client";
import { useLanguage } from "@/contexts/language-context";
import MaintenanceCard from "@/components/maintenance-card";
import BookMaintenanceModal from "@/components/book-maintenance-modal";

export default function MaintenancePage() {
  const [serviceCategories, setServiceCategories] = useState([
    // Initial mock data that will be replaced with real data
    {
      id: "plumbing",
      title: "Plumbing",
      icon: "/icons/plumbing.svg",
      description: "Fix leaks, install fixtures, and solve drainage issues",
    },
    {
      id: "electrical",
      title: "Electrical",
      icon: "/icons/electrical.svg",
      description: "Wiring, lighting installation, and electrical repairs",
    },
    {
      id: "hvac",
      title: "HVAC",
      icon: "/icons/hvac.svg",
      description: "AC repair, heating systems, and ventilation services",
    },
    {
      id: "painting",
      title: "Painting",
      icon: "/icons/painting.svg",
      description: "Interior and exterior painting services",
    },
    {
      id: "carpentry",
      title: "Carpentry",
      icon: "/icons/carpentry.svg",
      description: "Custom woodwork, repairs, and installations",
    },
    {
      id: "cleaning",
      title: "Cleaning",
      icon: "/icons/cleaning.svg",
      description:
        "Deep cleaning, regular maintenance, and specialized services",
    },
  ]);

  const [serviceProviders, setServiceProviders] = useState([
    // Initial mock data that will be replaced with real data
    {
      id: "1",
      name: "Ahmed Hassan",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
      rating: 4.9,
      reviews: 156,
      specialty: "Plumbing, Electrical",
      price: "EGP 250/hour",
    },
    {
      id: "2",
      name: "Sara Mahmoud",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara",
      rating: 4.8,
      reviews: 132,
      specialty: "Painting, Cleaning",
      price: "EGP 200/hour",
    },
    {
      id: "3",
      name: "Mohamed Ali",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohamed",
      rating: 4.7,
      reviews: 98,
      specialty: "HVAC, Electrical",
      price: "EGP 275/hour",
    },
    {
      id: "4",
      name: "Fatma Ibrahim",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatma",
      rating: 4.9,
      reviews: 187,
      specialty: "Cleaning, Organization",
      price: "EGP 180/hour",
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("morning");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const { language } = useLanguage();
  const supabase = createClient();

  // Fetch service categories and providers from the database
  useEffect(() => {
    const fetchMaintenanceData = async () => {
      setIsLoading(true);
      try {
        // Fetch service categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("maintenance_categories")
          .select("*");

        if (categoriesError) throw categoriesError;
        if (categoriesData) setServiceCategories(categoriesData);

        // Fetch service providers
        const { data: providersData, error: providersError } = await supabase
          .from("maintenance_providers")
          .select("*");

        if (providersError) throw providersError;
        if (providersData) setServiceProviders(providersData);
      } catch (err) {
        console.error("Error fetching maintenance data:", err);
        setError(
          language === "ar"
            ? "حدث خطأ أثناء جلب البيانات"
            : "Error fetching data",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaintenanceData();
  }, [language]);

  const handleBookService = () => {
    if (!selectedServiceType) {
      alert(
        language === "ar"
          ? "يرجى اختيار نوع الخدمة"
          : "Please select a service type",
      );
      return;
    }
    if (!selectedDate) {
      alert(language === "ar" ? "يرجى اختيار تاريخ" : "Please select a date");
      return;
    }

    setIsBookingModalOpen(true);
  };

  const handleProviderBooking = (providerId: string) => {
    setSelectedProvider(providerId);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              Professional Maintenance Services
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Book reliable maintenance services for your home with our trusted
              providers. All services come with a satisfaction guarantee.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-blue-600 font-semibold mb-4">
                Book a Service
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Service Type
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700"
                    value={selectedServiceType}
                    onChange={(e) => setSelectedServiceType(e.target.value)}
                  >
                    <option value="">
                      {language === "ar" ? "اختر خدمة" : "Select a service"}
                    </option>
                    {serviceCategories.map((category) => (
                      <option key={category.id} value={category.title}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-2 pl-10 border border-gray-300 rounded-md bg-white text-gray-700"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      className="w-full p-2 pl-10 border border-gray-300 rounded-md bg-white text-gray-700"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      <option value="morning">
                        {language === "ar"
                          ? "صباحًا (8 ص - 12 م)"
                          : "Morning (8AM - 12PM)"}
                      </option>
                      <option value="afternoon">
                        {language === "ar"
                          ? "ظهرًا (12 م - 4 م)"
                          : "Afternoon (12PM - 4PM)"}
                      </option>
                      <option value="evening">
                        {language === "ar"
                          ? "مساءً (4 م - 8 م)"
                          : "Evening (4PM - 8PM)"}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleBookService}
              >
                {language === "ar"
                  ? "البحث عن مزودي الخدمة المتاحين"
                  : "Find Available Providers"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Our Maintenance Services
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {serviceCategories.map((category) => (
            <Link key={category.id} href={`/maintenance/${category.id}`}>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow h-full flex flex-col items-center justify-center">
                <div className="bg-blue-50 p-4 rounded-full mb-4">
                  <Wrench className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">{category.title}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Book a Service",
                description:
                  "Select the service you need and choose a convenient date and time.",
              },
              {
                step: 2,
                title: "Get Matched",
                description:
                  "We'll match you with qualified professionals in your area.",
              },
              {
                step: 3,
                title: "Confirm Details",
                description:
                  "Review provider details and confirm your booking.",
              },
              {
                step: 4,
                title: "Service Completed",
                description:
                  "Your provider will arrive and complete the service to your satisfaction.",
              },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Service Providers */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Top-Rated Service Providers</h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : serviceProviders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {language === "ar"
                ? "لا يوجد مزودي خدمة متاحين حاليًا"
                : "No service providers available at the moment"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceProviders.map((provider) => (
              <MaintenanceCard
                key={provider.id}
                id={provider.id}
                image={provider.image}
                name={provider.name}
                specialty={provider.specialty}
                rating={provider.rating}
                reviews={provider.reviews}
                price={provider.price}
                onBookNow={() => handleProviderBooking(provider.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Testimonials */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-12 text-center">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                id: "1",
                name: "Laila Ahmed",
                text: "The plumber arrived on time and fixed our leaking sink quickly. Very professional service!",
                rating: 5,
              },
              {
                id: "2",
                name: "Omar Mahmoud",
                text: "Great experience with the electrician. He explained everything clearly and did a perfect job.",
                rating: 5,
              },
              {
                id: "3",
                name: "Nour Hassan",
                text: "The cleaning service was thorough and efficient. My apartment looks brand new!",
                rating: 4,
              },
            ].map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-500"
                      fill="currentColor"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <p className="font-medium">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Book your first maintenance service today and enjoy a hassle-free
            experience with our trusted professionals.
          </p>
          <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
            Book a Service Now
          </Button>
        </div>
      </div>

      <Footer />

      {/* Booking Modal */}
      <BookMaintenanceModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedProvider(null);
        }}
        serviceType={selectedServiceType}
        providerName={
          selectedProvider
            ? serviceProviders.find((p) => p.id === selectedProvider)?.name
            : undefined
        }
      />
    </div>
  );
}
