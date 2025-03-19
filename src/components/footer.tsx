import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Home } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between mb-12">
          <div className="mb-8 md:mb-0">
            <Link href="/" className="flex items-center text-xl font-bold mb-4">
              <Home className="mr-2 text-blue-600" />
              <span className="text-blue-600">Sakan</span>
              <span className="text-gray-800">Egypt</span>
            </Link>
            <p className="text-gray-600 max-w-md mb-6">
              Egypt's first AI-powered real estate platform with furniture and
              maintenance services all in one place.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Properties Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Properties</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/properties"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Buy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/properties/rent"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Rent
                  </Link>
                </li>
                <li>
                  <Link
                    href="/properties/new"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    New Developments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/virtual-tours"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Virtual Tours
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/furniture"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Furniture
                  </Link>
                </li>
                <li>
                  <Link
                    href="/maintenance"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Maintenance
                  </Link>
                </li>
                <li>
                  <Link
                    href="/interior-design"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Interior Design
                  </Link>
                </li>
                <li>
                  <Link
                    href="/moving"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Moving Services
                  </Link>
                </li>
              </ul>
            </div>

            {/* Locations Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Locations</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/locations/cairo"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Cairo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/locations/alexandria"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Alexandria
                  </Link>
                </li>
                <li>
                  <Link
                    href="/locations/new-cairo"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    New Cairo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/locations/north-coast"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    North Coast
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
          <div className="text-gray-600 mb-4 md:mb-0">
            © {currentYear} SakanEgypt. All rights reserved.
          </div>

          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="text-gray-600 hover:text-blue-600 text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-600 hover:text-blue-600 text-sm"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-gray-600 hover:text-blue-600 text-sm"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
