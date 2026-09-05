"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  PackageCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";

import { fetchAllDynamicProducts } from "@/lib/fetchProducts";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [openedCategory, setOpenedCategory] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      const fetched = await fetchAllDynamicProducts();
      setProducts(fetched);
    };
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const text = `
        ${item.title}
        ${item.brand}
        ${item.category}
        `.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [products, search]);

  const groupedProducts = useMemo(() => {
    const obj = {};
    filteredProducts.forEach((item) => {
      if (!obj[item.category]) {
        obj[item.category] = [];
      }
      obj[item.category].push(item);
    });
    return obj;
  }, [filteredProducts]);

  const categories = Object.keys(groupedProducts);

  const toggleCategory = (category) => {
    if (openedCategory === category) {
      setOpenedCategory("");
      return;
    }
    setOpenedCategory(category);
  };

  const scrollToProduct = (slug, category) => {
    setOpenedCategory(category);
    setActiveCategory(category);
    setTimeout(() => {
      const el = document.getElementById(slug);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 250);
  };

  return (
    <div className="bg-[#f6fbfa]/60 text-[#133835]">
      <PageBanner
        title="Our Products"
        subtitle="Explore advanced biomedical and diagnostic equipment designed for modern healthcare excellence."
      />

      <section className="py-24 bg-[#f6fbfa]">
        <div className="max-w-7xl mx-auto px-5">
          <SectionTitle
            badge="Featured Products"
            title="Premium Biomedical Equipment"
            description="Explore our comprehensive range of high-quality biomedical and diagnostic equipment designed to deliver precision, reliability, and advanced healthcare solutions for hospitals, laboratories, clinics, and research centers across India."
            center
          />
          <div className="grid lg:grid-cols-[320px_1fr] gap-10 mt-16">
            {/* ======================
                LEFT SIDEBAR
            ====================== */}
            <aside className="sticky top-28 h-fit rounded-[30px] border border-[#cdeae5] bg-white p-6 shadow-xl shadow-[#0b6e69]/5">
              {/* Heading */}
              <div className="mb-6">
                <span className="inline-flex rounded-full bg-[#e6f4f2] px-4 py-2 text-sm font-semibold text-[#0b6e69]">
                  Browse
                </span>
                <h2 className="mt-4 text-2xl font-bold text-[#133835]">
                  Categories
                </h2>
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Search Products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-xl border border-[#9cd3cb] bg-[#e6f4f2] px-4 text-[#133835] outline-none transition-all placeholder:text-[#5f8a84] focus:border-[#0b6e69] focus:bg-white focus:ring-4 focus:ring-[#0b6e69]/15"
              />

              {/* Categories */}
              <div className="mt-6 space-y-3">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="overflow-hidden rounded-2xl border border-[#cdeae5]"
                  >
                    <button
                      onClick={() => toggleCategory(category)}
                      className={`flex w-full items-center justify-between px-5 py-4 font-medium transition-all duration-300 ${
                        activeCategory === category
                          ? "bg-[#0b6e69] text-white shadow-lg shadow-[#0b6e69]/20"
                          : "bg-white text-[#133835] hover:bg-[#e6f4f2]"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {openedCategory === category ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                        {category}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          activeCategory === category
                            ? "bg-white/20 text-white"
                            : "bg-[#e6f4f2] text-[#0b6e69]"
                        }`}
                      >
                        {groupedProducts[category].length}
                      </span>
                    </button>

                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{
                        maxHeight:
                          openedCategory === category
                            ? groupedProducts[category].length * 48 + "px"
                            : "0px",
                      }}
                    >
                      {groupedProducts[category].map((item) => (
                        <button
                          key={item.slug}
                          onClick={() =>
                            scrollToProduct(item.slug, category)
                          }
                          className="block w-full border-t border-[#cdeae5] px-6 py-3 text-left text-sm text-[#496a66] transition hover:bg-[#e6f4f2] hover:text-[#0b6e69]"
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* ======================
                RIGHT SIDE
            ====================== */}
            <div>
              <div className="space-y-16">
                {Object.entries(groupedProducts).map(([category, list]) => (
                  <section
                    key={category}
                    id={category.replace(/\s+/g, "-").toLowerCase()}
                  >
                    {/* Category Header */}
                    <div className="mb-10 flex items-center justify-between border-b border-[#cdeae5] pb-5">
                      <div>
                        <span className="rounded-full bg-[#e6f4f2] px-4 py-2 text-sm font-semibold text-[#0b6e69]">
                          Category
                        </span>
                        <h2 className="mt-4 text-4xl font-black text-[#133835]">
                          {category}
                        </h2>
                      </div>

                      <div className="rounded-full border border-[#cdeae5] bg-[#e6f4f2] px-5 py-2 text-[#0b6e69] font-semibold">
                        {list.length} Products
                      </div>
                    </div>

                    <div className="space-y-8">
                      {list.map((product) => (
                        <div
                          key={product.slug}
                          id={product.slug}
                          className="group rounded-[30px] border border-[#cdeae5] bg-white p-7 shadow-lg shadow-[#0b6e69]/5 transition-all duration-300 hover:-translate-y-2 hover:border-[#0b6e69]/50 hover:shadow-2xl hover:shadow-[#0b6e69]/15"
                        >
                          <div className="grid items-center gap-8 lg:grid-cols-[250px_1fr_190px]">
                            {/* Image */}
                            <div className="flex h-[220px] items-center justify-center overflow-hidden rounded-3xl border border-[#cdeae5] bg-gradient-to-br from-[#e6f4f2] to-white">
                              <Image
                                src={product.image}
                                alt={product.title}
                                width={220}
                                height={220}
                                className="max-h-[180px] object-contain transition duration-300 group-hover:scale-105"
                              />
                            </div>

                            {/* Content */}
                            <div>
                              <h3 className="text-2xl font-bold text-[#133835]">
                                {product.title}
                              </h3>

                              <p className="mt-4 leading-8 text-[#496a66]">
                                {product.description}
                              </p>

                              <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-[#cdeae5] bg-[#e6f4f2] p-4">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0b6e69]">
                                    Brand
                                  </p>
                                  <p className="mt-2 font-bold text-[#133835]">
                                    {product.brand}
                                  </p>
                                </div>

                                <div className="rounded-2xl border border-[#cdeae5] bg-[#e6f4f2] p-4">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0b6e69]">
                                    Model
                                  </p>
                                  <p className="mt-2 font-bold text-[#133835]">
                                    {product.model}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Button */}
                            <div className="flex justify-center lg:justify-end">
                              <Link
                                href={`/items/${product.slug}`}
                                className="w-full lg:w-auto"
                              >
                                <button className="w-full rounded-xl bg-[#0b6e69] px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-[#074e49] hover:shadow-lg hover:shadow-[#0b6e69]/20 lg:w-auto">
                                  View Details →
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===========================
            WHY CHOOSE US
      =========================== */}
      <section className="py-24 bg-gradient-to-b from-white to-[#ebf7f5]">
        <div className="max-w-7xl mx-auto px-5">
          <SectionTitle
            badge="Why Choose Our Products"
            title="Trusted Quality & Innovation"
            description="Every biomedical product is engineered with precision, tested for quality, and backed by reliable support to ensure exceptional performance in hospitals and laboratories."
            center
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <ShieldCheck size={32} />,
                title: "Certified Quality",
                desc: "Every product undergoes strict quality testing to ensure safety, durability and reliable performance.",
              },
              {
                icon: <Truck size={32} />,
                title: "Fast Delivery",
                desc: "Quick and secure delivery across India with safe packaging and timely logistics support.",
              },
              {
                icon: <BadgeCheck size={32} />,
                title: "Trusted Support",
                desc: "Dedicated technical assistance and after-sales service whenever you need expert guidance.",
              },
              {
                icon: <PackageCheck size={32} />,
                title: "Premium Equipment",
                desc: "Advanced biomedical equipment designed for modern laboratories, hospitals and healthcare professionals.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group rounded-[30px] border border-[#cdeae5] bg-white p-8 text-center shadow-lg shadow-[#0b6e69]/5 transition-all duration-300 hover:-translate-y-2 hover:border-[#0b6e69]/40 hover:shadow-2xl hover:shadow-[#0b6e69]/15"
              >
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#e6f4f2] text-[#0b6e69] transition-all duration-300 group-hover:bg-[#0b6e69] group-hover:text-white">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-[#133835]">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-4 leading-7 text-[#496a66]">
                  {item.desc}
                </p>

                {/* Bottom Line */}
                <div className="mx-auto mt-8 h-1 w-14 rounded-full bg-[#0b6e69] transition-all duration-300 group-hover:w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}