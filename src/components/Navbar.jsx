"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "items",
    "contact",
  ];

  const district =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Products", path: "/items" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#cdeae5] bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="container-custom flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href={makeLink("/")} className="relative block h-16 w-48 shrink-0 transition-transform hover:scale-105">
          <Image
            src="/logo.png"
            alt="Raj Biosis Private Limited"
            fill
            sizes="(max-width: 768px) 192px, 200px"
            className="object-contain object-left"
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={makeLink(link.path)}
              className="relative font-medium text-[#496a66] transition-all duration-300 hover:text-[#0b6e69] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0b6e69] after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Button */}
        <div className="hidden lg:block">
          <Link href={makeLink("/contact")}>
            <button className="rounded-xl bg-[#0b6e69] px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#074e49] hover:shadow-xl hover:shadow-[#0b6e69]/20">
              Get Quote
            </button>
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-xl border border-[#cdeae5] bg-[#e6f4f2] p-2 transition-all duration-300 hover:bg-[#d8f0ec] lg:hidden"
        >
          {menuOpen ? (
            <X
              size={26}
              className="text-[#0b6e69]"
            />
          ) : (
            <Menu
              size={26}
              className="text-[#0b6e69]"
            />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          menuOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="border-t border-[#cdeae5] bg-white px-6 py-6">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={makeLink(link.path)}
                onClick={() => setMenuOpen(false)}
                className="font-medium text-[#496a66] transition-all duration-300 hover:translate-x-1 hover:text-[#0b6e69]"
              >
                {link.name}
              </Link>
            ))}

            <Link
              href={makeLink("/contact")}
              onClick={() => setMenuOpen(false)}
            >
              <button className="mt-2 w-full rounded-xl bg-[#0b6e69] py-3 font-semibold text-white transition-all duration-300 hover:bg-[#074e49]">
                Get Quote
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}