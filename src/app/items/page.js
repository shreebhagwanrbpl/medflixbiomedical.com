"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import PageBanner from "@/components/PageBanner";
import ProductCard from "@/components/ProductCard";
import { fetchAllDynamicProducts, normalizeProduct } from "@/lib/fetchProducts";
import { subscribeToCatalog } from "@/lib/data-fetcher";
import {
  Search,
  X,
  Filter,
  Package,
  ShieldCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";

function ProductsContent({ city }) {
  // ONLY DYNAMIC DATA
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlCategory = searchParams
    ? searchParams.get("category") || searchParams.get("cat")
    : null;

  /* =========================
     DISTRICT / CITY ROUTING
  ========================== */
  const pathParts = pathname.split("/").filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "items",
    "contact",
    "products",
  ];

  const district =
    pathParts.length > 0 && !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : null;

  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    if (path.startsWith("/items?")) {
      return `/${district}${path}`;
    }

    return `/${district}${path.startsWith("/") ? path : `/${path}`}`;
  };

  /* =========================
     LOAD DYNAMIC PRODUCTS
  ========================== */
  useEffect(() => {
    let isMounted = true;

    const loadInitialProducts = async () => {
      try {
        const fetched = await fetchAllDynamicProducts();

        if (isMounted) {
          // Only dynamic products.
          // If API returns empty array, products remain empty.
          if (Array.isArray(fetched)) {
            const normalized = fetched
              .map((item) => normalizeProduct(item))
              .filter(Boolean);

            setProducts(normalized);
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        console.error("Error loading dynamic products:", err);

        // No fallback data.
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInitialProducts();

    /* =========================
       REAL-TIME FIRESTORE DATA
    ========================== */
    const unsubscribe = subscribeToCatalog((updatedCatalog) => {
      if (!isMounted) return;

      if (Array.isArray(updatedCatalog)) {
        const normalized = updatedCatalog
          .map((item) => normalizeProduct(item))
          .filter(Boolean);

        // Dynamic catalog becomes the current source of truth.
        // Empty catalog = empty products.
        setProducts(normalized);
      } else {
        setProducts([]);
      }
    });

    return () => {
      isMounted = false;

      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  /* =========================
     CATEGORY LIST
  ========================== */
  const categoriesList = useMemo(() => {
    const setCat = new Set(["All Categories"]);

    products.forEach((product) => {
      if (product.category && String(product.category).trim()) {
        setCat.add(String(product.category).trim());
      }
    });

    return Array.from(setCat);
  }, [products]);

  /* =========================
     SYNC CATEGORY FROM URL
  ========================== */
  useEffect(() => {
    if (
      urlCategory &&
      typeof urlCategory === "string" &&
      urlCategory.trim()
    ) {
      const decoded = decodeURIComponent(urlCategory.trim());

      setSelectedCategory(decoded);
    }
  }, [urlCategory]);

  /* =========================
     FILTER PRODUCTS
  ========================== */
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productCategory = product.category
        ? product.category.toLowerCase().trim()
        : "";

      const productSubCategory = product.subCategory
        ? product.subCategory.toLowerCase().trim()
        : "";

      const currentCategory = selectedCategory
        .toLowerCase()
        .trim();

      const matchesCategory =
        selectedCategory === "All Categories" ||
        productCategory === currentCategory ||
        productSubCategory === currentCategory;

      const q = searchQuery.toLowerCase().trim();

      const matchesQuery =
        !q ||
        (product.title &&
          product.title.toLowerCase().includes(q)) ||
        (product.description &&
          product.description.toLowerCase().includes(q)) ||
        (product.category &&
          product.category.toLowerCase().includes(q)) ||
        (product.brand &&
          product.brand.toLowerCase().includes(q)) ||
        (product.model &&
          product.model.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  /* =========================
     LOADING STATE
  ========================== */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f6fbfa]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-[#0b6e69]" />

          <p className="text-sm font-bold text-[#0b6e69]">
            Loading Medical Equipment Catalog...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6fbfa]/60 text-[#133835]">

      {/* =========================
          BANNER
      ========================== */}
      <PageBanner
        badge="Product Inventory"
        title={
          city
            ? `Diagnostic Equipment Collection in ${city}`
            : "Diagnostic Equipment Collection"
        }
        subtitle="Explore our certified catalog of clinical chemistry analyzers, hematology counters, PCR systems, patient monitors, and laboratory consumables."
      />

      {/* =========================
          MAIN CATALOG
      ========================== */}
      <section className="section-padding bg-gradient-to-b from-white via-[#f6fbfa] to-[#ebf7f5]">
        <div className="container-custom">

          {/* =========================
              FILTER BAR
          ========================== */}
          <div className="sticky top-20 z-40 rounded-2xl sm:rounded-3xl border border-[#cdeae5] bg-white/95 backdrop-blur-xl p-4 sm:p-5 shadow-lg shadow-black/5 transition-all">

            <div className="grid gap-4 md:grid-cols-12 items-center">

              {/* Search */}
              <div className="md:col-span-5 relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0b6e69]"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Search by equipment name, model, or parameter..."
                  className="w-full rounded-xl border border-[#9cd3cb] bg-[#e6f4f2] pl-10 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm text-[#133835] placeholder:text-[#5f8a84] transition-all focus:border-[#0b6e69] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0b6e69]/20"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#496a66] hover:text-[#0b6e69]"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="md:col-span-7 flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">

                <Filter
                  size={16}
                  className="text-[#0b6e69] shrink-0 mr-1"
                />

                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${selectedCategory
                      .toLowerCase()
                      .trim() === cat.toLowerCase().trim()
                      ? "bg-[#0b6e69] !text-white shadow-md shadow-[#0b6e69]/30"
                      : "bg-[#e6f4f2] border border-[#cdeae5] text-[#496a66] hover:bg-[#d8f0ec]"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-3 flex items-center justify-between border-t border-[#cdeae5]/40 pt-3 text-xs font-semibold text-[#496a66]">

              <span>
                Showing{" "}
                <strong className="text-[#0b6e69] font-bold">
                  {filteredProducts.length}
                </strong>{" "}
                of {products.length} instruments

                {selectedCategory !== "All Categories" && (
                  <span className="ml-1 text-[#0b6e69]">
                    in &ldquo;{selectedCategory}&rdquo;
                  </span>
                )}
              </span>

              {(selectedCategory !== "All Categories" ||
                searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("All Categories");
                      setSearchQuery("");
                    }}
                    className="text-[#0b6e69] font-bold hover:underline"
                  >
                    Reset all filters
                  </button>
                )}
            </div>
          </div>

          {/* =========================
              PRODUCT GRID
          ========================== */}
          {filteredProducts.length === 0 ? (
            <div className="mt-16 text-center rounded-3xl border border-[#cdeae5] bg-white p-16 shadow-sm">

              <Package
                size={48}
                className="mx-auto text-[#0b6e69]/60 mb-4 animate-bounce"
              />

              <h3 className="text-2xl font-bold text-[#133835]">
                No Instruments Found
              </h3>

              <p className="mt-2 text-sm text-[#496a66]">
                Try adjusting your search keyword or selecting
                a different equipment category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setSearchQuery("");
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#0b6e69] px-6 py-3 text-sm font-bold !text-white shadow-md hover:bg-[#074e49]"
              >
                Clear Search Filters
              </button>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id || product.slug}
                  product={product}
                  makeLink={makeLink}
                />
              ))}

            </div>
          )}
        </div>
      </section>

      {/* =========================
          BULK PROCUREMENT
      ========================== */}
      <section className="section-padding bg-white border-t border-[#cdeae5]/60">
        <div className="container-custom">

          <div className="rounded-3xl border border-[#cdeae5] bg-gradient-to-r from-[#e6f4f2] via-[#ebf7f5] to-[#d8f0ec] p-8 sm:p-12 shadow-lg">

            <div className="grid lg:grid-cols-12 gap-8 items-center">

              <div className="lg:col-span-8">

                <span className="inline-flex items-center gap-2 rounded-full border border-[#0b6e69]/30 bg-white px-4 py-1.5 text-xs font-bold text-[#0b6e69] uppercase tracking-wider">

                  <ShieldCheck
                    size={16}
                    className="text-[#0b6e69]"
                  />

                  Bulk Hospital Orders & Tenders
                </span>

                <h3 className="mt-4 text-3xl font-black text-[#133835]">
                  Procuring Equipment for New Hospital Blocks
                  or Diagnostics Chains?
                </h3>

                <p className="mt-3 text-base text-[#496a66] leading-relaxed">
                  We offer institutional discounts, customized
                  equipment leasing plans, and complete turnkey
                  lab setup packages with extended AMC warranties.
                </p>
              </div>

              <div className="lg:col-span-4 flex items-center justify-end">

                <a
                  href={makeLink("/contact")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0b6e69] px-8 py-4 text-base font-bold !text-white shadow-lg transition-all hover:bg-[#074e49]"
                >
                  <span className="!text-white font-bold">
                    Request Bulk Tender Quote
                  </span>

                  <ArrowRight
                    size={18}
                    className="!text-white"
                  />
                </a>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================
   PAGE
========================= */

export default function ProductsPage({ city }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-[#f6fbfa]">
          <div className="flex flex-col items-center gap-3">

            <Loader2 className="h-10 w-10 animate-spin text-[#0b6e69]" />

            <p className="text-sm font-bold text-[#0b6e69]">
              Loading Medical Equipment Catalog...
            </p>

          </div>
        </div>
      }
    >
      <ProductsContent city={city} />
    </Suspense>
  );
}