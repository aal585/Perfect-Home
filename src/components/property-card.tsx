import Image from "next/image";
import { Building2, Home, MapPin, Wrench } from "lucide-react";
import Link from "next/link";

interface PropertyCardProps {
  image: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  area: string;
  id?: string;
}

export default function PropertyCard({
  image = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  title = "Luxury Villa in New Cairo",
  price = "EGP 12,500,000",
  location = "New Cairo",
  beds = 4,
  baths = 3,
  area = "350 sqm",
  id = "1",
}: PropertyCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/properties/${id}`}>
        <div className="relative h-64 w-full">
          <Image
            src={image}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform hover:scale-105 duration-300"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-blue-600 font-bold mb-4">{price}</p>
          <div className="flex justify-between text-gray-600 text-sm">
            <div className="flex items-center">
              <Home className="w-4 h-4 mr-1" />
              <span>{beds} beds</span>
            </div>
            <div className="flex items-center">
              <Wrench className="w-4 h-4 mr-1" />
              <span>{baths} baths</span>
            </div>
            <div className="flex items-center">
              <Building2 className="w-4 h-4 mr-1" />
              <span>{area}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
