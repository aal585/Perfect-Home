import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Home,
  Search,
  Building,
  Sofa,
  Wrench,
  MessageSquare,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Find Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                Perfect Home
              </span>{" "}
              in Egypt
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Egypt's first AI-powered real estate platform with furniture and
              maintenance services all in one place.
            </p>

            <div className="bg-white p-4 rounded-xl shadow-lg mb-12 max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search for properties in Arabic or English..."
                    className="pl-10 py-6 w-full text-lg"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-8 text-lg">
                  Search
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-gray-600">
                <span className="bg-blue-50 px-3 py-1 rounded-full">Cairo</span>
                <span className="bg-blue-50 px-3 py-1 rounded-full">
                  Alexandria
                </span>
                <span className="bg-blue-50 px-3 py-1 rounded-full">
                  New Cairo
                </span>
                <span className="bg-blue-50 px-3 py-1 rounded-full">
                  6th of October
                </span>
                <span className="bg-blue-50 px-3 py-1 rounded-full">
                  North Coast
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/properties"
                className="inline-flex items-center px-8 py-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Browse Properties
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="/virtual-tours"
                className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                Virtual Tours
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                <Building className="w-8 h-8 text-blue-600 mb-2" />
                <span className="font-medium">Properties</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                <Sofa className="w-8 h-8 text-blue-600 mb-2" />
                <span className="font-medium">Furniture</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                <Wrench className="w-8 h-8 text-blue-600 mb-2" />
                <span className="font-medium">Maintenance</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                <MessageSquare className="w-8 h-8 text-blue-600 mb-2" />
                <span className="font-medium">Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
