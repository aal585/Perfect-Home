"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import SavePropertyButton from "@/components/save-property-button";
import FurnitureRecommendations from "@/components/furniture-recommendations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VirtualTourViewer from "@/components/virtual-tour-viewer";
import BookViewingModal from "@/components/book-viewing-modal";
import PaymentModal from "@/components/payment-modal";
import {
  ArrowUpRight,
  Bath,
  Bed,
  Building2,
  Calendar,
  Check,
  Heart,
  Home,
  MapPin,
  Maximize2,
  Phone,
  Share2,
  View,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

export default function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [isVirtualTourOpen, setIsVirtualTourOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(
    null,
  );
  const { language } = useLanguage();

  // Mock property data - in a real app, this would come from an API or database
  const property = {
    id: params.id,
    title: "Luxury Villa in New Cairo",
    description:
      "This stunning villa offers spacious living areas, high-end finishes, and a beautiful garden. Located in a prestigious neighborhood with easy access to schools, shopping centers, and major highways.",
    price: "EGP 12,500,000",
    location: "New Cairo, Cairo Governorate",
    beds: 4,
    baths: 3,
    area: "350 sqm",
    yearBuilt: 2020,
    propertyType: "Villa",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
    ],
    features: [
      "Private Garden",
      "Swimming Pool",
      "Smart Home System",
      "24/7 Security",
      "Marble Flooring",
      "Central Air Conditioning",
      "Double Garage",
      "Maid's Room",
    ],
    agent: {
      name: "Ahmed Hassan",
      phone: "+20 123 456 7890",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
    },
    furniture: [
      {
        id: "1",
        name: "Modern Living Room Set",
        price: "EGP 35,000",
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      },
      {
        id: "2",
        name: "Luxury Bedroom Suite",
        price: "EGP 42,000",
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
      },
      {
        id: "3",
        name: "Dining Room Collection",
        price: "EGP 28,500",
        image:
          "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80",
      },
    ],
  };

  // Record property view in browsing history when the page loads
  useEffect(() => {
    const recordView = async () => {
      try {
        await fetch("/api/record-view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ propertyId: params.id }),
        });
      } catch (error) {
        console.error("Error recording property view:", error);
      }
    };

    recordView();
  }, [params.id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShareProperty = () => {
    if (navigator.share) {
      navigator
        .share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleFurnitureSelect = (id: string) => {
    setSelectedFurniture(id);
    setIsPaymentModalOpen(true);
  };

  // Translations
  const translations = {
    bookViewing: language === "ar" ? "حجز معاينة" : "Book a Viewing",
    propertyDetails: language === "ar" ? "تفاصيل العقار" : "Property Details",
    bedrooms: language === "ar" ? "غرف النوم" : "Bedrooms",
    bathrooms: language === "ar" ? "الحمامات" : "Bathrooms",
    area: language === "ar" ? "المساحة" : "Area",
    yearBuilt: language === "ar" ? "سنة البناء" : "Year Built",
    description: language === "ar" ? "الوصف" : "Description",
    features: language === "ar" ? "المميزات" : "Features",
    location: language === "ar" ? "الموقع" : "Location",
    virtualTour: language === "ar" ? "جولة افتراضية" : "Virtual Tour",
    experience3D:
      language === "ar"
        ? "تجربة هذا العقار بتقنية ثلاثية الأبعاد"
        : "Experience this property in 3D",
    startTour:
      language === "ar" ? "بدء الجولة الافتراضية" : "Start Virtual Tour",
    furnitureRecommendations:
      language === "ar" ? "توصيات الأثاث" : "Furniture Recommendations",
    visualizeFurniture:
      language === "ar"
        ? "تصور كيف سيبدو هذا العقار مع الأثاث باستخدام أداة وضع الأثاث المدعومة بالذكاء الاصطناعي."
        : "Visualize how this property would look with furniture using our AI-powered furniture placement tool.",
    exploreFurniture:
      language === "ar" ? "استكشاف خيارات الأثاث" : "Explore Furniture Options",
    propertyAgent: language === "ar" ? "وكيل العقار" : "Property Agent",
    sendMessage: language === "ar" ? "إرسال رسالة" : "Send Message",
    requestInfo: language === "ar" ? "طلب معلومات" : "Request Information",
    name: language === "ar" ? "الاسم" : "Name",
    email: language === "ar" ? "البريد الإلكتروني" : "Email",
    phone: language === "ar" ? "الهاتف" : "Phone",
    message: language === "ar" ? "الرسالة" : "Message",
    submitRequest: language === "ar" ? "إرسال الطلب" : "Submit Request",
    paymentOptions: language === "ar" ? "خيارات الدفع" : "Payment Options",
    paymentDescription:
      language === "ar"
        ? "نحن ندعم طرق دفع متعددة لراحتك:"
        : "We support multiple payment methods for your convenience:",
    similarProperties:
      language === "ar" ? "عقارات مشابهة" : "Similar Properties",
    addToCart: language === "ar" ? "إضافة إلى السلة" : "Add to Cart",
  };

  // Handle form submission
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Information request submitted! An agent will contact you soon.");
    // In a real app, this would send the form data to an API
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Property Images */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {property.images.slice(1, 5).map((image, index) => (
              <div
                key={index}
                className="relative h-44 rounded-lg overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`${property.title} - Image ${index + 2}`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{property.location}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <p className="text-2xl text-blue-600 font-bold">{property.price}</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <SavePropertyButton
              propertyId={params.id}
              variant="outline"
              size="icon"
            />
            <Button variant="outline" size="icon" onClick={handleShareProperty}>
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsBookingModalOpen(true)}
            >
              {translations.bookViewing}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {translations.propertyDetails}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center">
                  <Bed className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {translations.bedrooms}
                    </p>
                    <p className="font-medium">{property.beds}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Bath className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {translations.bathrooms}
                    </p>
                    <p className="font-medium">{property.baths}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Maximize2 className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">{translations.area}</p>
                    <p className="font-medium">{property.area}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {translations.yearBuilt}
                    </p>
                    <p className="font-medium">{property.yearBuilt}</p>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">
                    {translations.description}
                  </TabsTrigger>
                  <TabsTrigger value="features">
                    {translations.features}
                  </TabsTrigger>
                  <TabsTrigger value="location">
                    {translations.location}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-4">
                  <p className="text-gray-600 leading-relaxed">
                    {property.description}
                  </p>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    {language === "ar"
                      ? "هذا العقار مثالي للعائلات التي تبحث عن منزل واسع وحديث في أحد أكثر أحياء القاهرة المرغوبة. تتميز الفيلا بأسقف عالية ونوافذ كبيرة تسمح بدخول الكثير من الضوء الطبيعي، وتشطيبات فاخرة في جميع أنحاء المنزل."
                      : "This property is perfect for families looking for a spacious and modern home in one of Cairo's most desirable neighborhoods. The villa features high ceilings, large windows that allow plenty of natural light, and premium finishes throughout."}
                  </p>
                </TabsContent>
                <TabsContent value="features" className="pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="location" className="pt-4">
                  <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">
                      {language === "ar"
                        ? "سيتم عرض الخريطة هنا"
                        : "Map will be displayed here"}
                    </p>
                  </div>
                  <p className="mt-4 text-gray-600">
                    {language === "ar"
                      ? "يقع في القاهرة الجديدة، ويوفر هذا العقار سهولة الوصول إلى الطرق السريعة الرئيسية والمدارس الدولية ومراكز التسوق والمطاعم. يشتهر الحي بأمانه ومساحاته الخضراء وبيئته المناسبة للعائلات."
                      : "Located in New Cairo, this property offers easy access to major highways, international schools, shopping centers, and restaurants. The neighborhood is known for its security, green spaces, and family-friendly environment."}
                  </p>
                </TabsContent>
              </Tabs>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {translations.virtualTour}
              </h2>
              <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center relative overflow-hidden">
                <Image
                  src={property.images[0]}
                  alt="Virtual Tour Preview"
                  fill
                  style={{ objectFit: "cover", opacity: 0.7 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="text-center relative z-10">
                  <p className="text-white text-lg font-medium mb-4">
                    {translations.experience3D}
                  </p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                    onClick={() => setIsVirtualTourOpen(true)}
                  >
                    <View className="w-4 h-4" />
                    {translations.startTour}
                  </Button>
                </div>
              </div>

              {/* Virtual Tour Viewer */}
              <VirtualTourViewer
                isOpen={isVirtualTourOpen}
                onClose={() => setIsVirtualTourOpen(false)}
                propertyTitle={property.title}
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                {translations.furnitureRecommendations}
              </h2>
              <p className="text-gray-600 mb-4">
                {translations.visualizeFurniture}
              </p>

              {/* AI-powered furniture recommendations */}
              <FurnitureRecommendations propertyId={params.id} />

              <Link href="/furniture">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-6">
                  {translations.exploreFurniture}
                  <ArrowUpRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={property.agent.image}
                    alt={property.agent.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{property.agent.name}</h3>
                  <p className="text-sm text-gray-500">
                    {translations.propertyAgent}
                  </p>
                </div>
              </div>
              <Button
                className="w-full mb-3 flex items-center justify-center"
                onClick={() =>
                  (window.location.href = `tel:${property.agent.phone}`)
                }
              >
                <Phone className="mr-2 h-4 w-4" />
                {property.agent.phone}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  (window.location.href = `mailto:agent@sakanegypt.com?subject=Inquiry about ${property.title}`)
                }
              >
                {translations.sendMessage}
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h3 className="font-semibold mb-4">{translations.requestInfo}</h3>
              <form onSubmit={handleRequestSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translations.name}
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translations.email}
                    </label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translations.phone}
                    </label>
                    <input
                      type="tel"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translations.message}
                    </label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md h-24"
                      required
                    ></textarea>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {translations.submitRequest}
                  </Button>
                </div>
              </form>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="font-semibold mb-4">
                {translations.paymentOptions}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {translations.paymentDescription}
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span>
                    {language === "ar"
                      ? "بطاقات الائتمان/الخصم"
                      : "Credit/Debit Cards"}
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span>Vodafone Cash</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span>Fawry</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span>InstaPay</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            {translations.similarProperties}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link href={`/properties/${item + 10}`}>
                  <div className="relative h-48">
                    <Image
                      src={`https://images.unsplash.com/photo-16005${item}7492493-0946911123ea?w=800&q=80`}
                      alt={`Similar property ${item}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">
                      {language === "ar"
                        ? "فيلا حديثة في القاهرة الجديدة"
                        : "Modern Villa in New Cairo"}
                    </h3>
                    <p className="text-blue-600 font-bold mb-2">
                      EGP 11,800,000
                    </p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>4 {language === "ar" ? "غرف" : "beds"}</span>
                      <span>3 {language === "ar" ? "حمامات" : "baths"}</span>
                      <span>320 {language === "ar" ? "متر مربع" : "sqm"}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <BookViewingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        propertyTitle={property.title}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedFurniture(null);
        }}
        amount={
          selectedFurniture
            ? property.furniture.find((f) => f.id === selectedFurniture)
                ?.price || ""
            : ""
        }
        title={
          selectedFurniture
            ? property.furniture.find((f) => f.id === selectedFurniture)
                ?.name || ""
            : ""
        }
      />

      <Footer />
    </div>
  );
}
