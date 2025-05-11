import Link from "next/link";
import {
  Facebook,
  Instagram,
  X,
  Mail,
  Phone,
  MapPin,
  Package,
  Linkedin,
} from "lucide-react";
import { FaWhatsappSquare } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-muted/30 to-muted/50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] z-0" />

      <div className="container px-4 mx-auto py-12 relative z-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="animate-fade-in">
            <Link href="/" className="flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Campus Market</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              The ultimate platform for students to buy, sell, and find
              accommodation with ease and confidence.
            </p>
            <div className="flex gap-4 mt-4">
              {[
                { icon: X, label: "Twitter" },
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Linkedin, label: "LinkedIn" },
              ].map((social) => (
                <Link
                  key={social.label}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                  <span className="sr-only">{social.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h3 className="mb-4 text-lg font-semibold">Marketplace</h3>
            <ul className="space-y-2">
              {[
                "Browse Items",
                "Sell an Item",
                "Categories",
                "Popular Items",
                "Recently Added",
                "Deals & Discounts",
              ].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-1 transition-transform duration-300"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="mb-4 text-lg font-semibold">Accommodation</h3>
            <ul className="space-y-2">
              {[
                "Find a Room",
                "List a Property",
                "Verified Landlords",
                "Room Types",
                "Campus Proximity",
                "Roommate Finder",
              ].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-1 transition-transform duration-300"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-muted-foreground">Harare, Zimbabwe</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a
                  href="mailto:support@campusmarket.co.zw"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  support@campusmarket.co.zw
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a
                  href="tel:+263786223289"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +263 786 223 289
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaWhatsappSquare className="w-5 h-5 text-primary" />
                <a
                  href="https://wa.me/263786223289"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +263 786 223 289
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {currentYear} Campus Market. All rights reserved.
            </p>
            <div className="flex gap-6">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Accessibility",
              ].map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
