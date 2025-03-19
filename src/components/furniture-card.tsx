import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

interface FurnitureCardProps {
  image: string;
  title: string;
  price: string;
  category: string;
  rating: number;
  reviews: number;
  id?: string;
  onClick?: () => void;
}

export default function FurnitureCard({
  image = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
  title = "Modern Sofa",
  price = "EGP 15,000",
  category = "Living Room",
  rating = 4.5,
  reviews = 120,
  id = "1",
  onClick,
}: FurnitureCardProps) {
  const { language } = useLanguage();

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/furniture/${id}`} onClick={handleClick}>
        <div className="relative h-64 w-full">
          <Image
            src={image}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform hover:scale-105 duration-300"
          />
        </div>
        <div className="p-4">
          <div className="text-sm text-gray-500 mb-1">{category}</div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-blue-600 font-bold mb-2">{price}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
              <span className="text-sm">
                {rating} ({reviews})
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full p-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}
