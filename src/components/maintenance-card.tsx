import Image from "next/image";
import { Star, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

interface MaintenanceCardProps {
  image: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  price: string;
  id?: string;
  onBookNow?: () => void;
}

export default function MaintenanceCard({
  image = "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  name = "Service Provider",
  specialty = "General Maintenance",
  rating = 4.5,
  reviews = 100,
  price = "EGP 250/hour",
  id = "1",
  onBookNow,
}: MaintenanceCardProps) {
  const { language } = useLanguage();

  const handleBookNow = () => {
    if (onBookNow) onBookNow();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
          <Image
            src={image}
            alt={name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-sm text-gray-500 ml-1">
              ({reviews} {language === "ar" ? "تقييم" : "reviews"})
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">
            {language === "ar" ? "التخصص:" : "Specialty:"}
          </span>{" "}
          {specialty}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-medium">
            {language === "ar" ? "السعر:" : "Price:"}
          </span>{" "}
          {price}
        </p>
        <div className="flex flex-col space-y-2">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            onClick={handleBookNow}
          >
            {language === "ar" ? "احجز الآن" : "Book Now"}
          </Button>
          <Button variant="outline" className="w-full">
            {language === "ar" ? "عرض التفاصيل" : "View Details"}
          </Button>
        </div>
      </div>
    </div>
  );
}
