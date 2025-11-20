"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/Footer";

interface Product {
  _id: string;
  title: string;
  subtitle: string;
  price: number;
  bannerImage: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/products/api");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-brand-grayBg p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-12 flex flex-col items-start justify-between lg:flex-row lg:items-center">
            <div className="mb-6 lg:mb-0">
              <h1 className="mb-3 font-heading text-4xl font-bold text-brand-tealDark">
                Product Management
              </h1>
              <p className="font-sans text-lg text-brand-maroon">
                Manage your product catalog and content
              </p>
            </div>
            <Link
              href="/products/admin/new"
              className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-teal to-brand-tealDark px-8 py-4 font-heading font-bold text-white shadow-brand transition-all duration-300 hover:from-brand-tealDark hover:to-brand-maroon hover:shadow-soft"
            >
              <span className="text-xl">+</span>
              Create New Product
            </Link>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-brand-teal border-t-transparent"></div>
              <p className="font-heading text-xl text-brand-tealDark">Loading Products...</p>
              <p className="mt-2 font-sans text-brand-maroon">Fetching your product catalog</p>
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="rounded-4xl border border-gray-100 bg-white p-12 text-center shadow-soft">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-grayBg">
                <span className="text-4xl text-brand-teal">📦</span>
              </div>
              <h3 className="mb-3 font-heading text-2xl font-bold text-brand-tealDark">
                No Products Yet
              </h3>
              <p className="mx-auto mb-8 max-w-md font-sans text-brand-maroon">
                Start building your product catalog by creating your first product. Add images,
                descriptions, and pricing to get started.
              </p>
              <Link
                href="/products/admin/new"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-teal to-brand-tealDark px-8 py-4 font-heading font-bold text-white shadow-brand transition-all duration-300 hover:from-brand-tealDark hover:to-brand-maroon"
              >
                <span className="text-xl">+</span>
                Create Your First Product
              </Link>
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/admin/${product._id}`}
                  className="group overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-soft transition-all duration-300 hover:border-brand-teal/20 hover:shadow-brand"
                >
                  {/* Image Container */}
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={product.bannerImage}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Edit Badge */}
                    <div className="absolute right-4 top-4">
                      <span className="rounded-full border border-brand-teal/20 bg-white/90 px-3 py-1 font-sans text-sm font-semibold text-brand-tealDark backdrop-blur-sm">
                        Edit
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="mb-2 line-clamp-2 font-heading text-xl font-bold text-brand-tealDark transition-colors duration-200 group-hover:text-brand-teal">
                      {product.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 font-sans text-sm text-brand-maroon">
                      {product.subtitle}
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="font-heading text-2xl font-bold text-brand-coral">
                        ₹{product.price}
                      </span>
                      <div className="flex items-center gap-1 text-brand-teal transition-transform duration-200 group-hover:translate-x-1">
                        <span className="font-sans text-sm font-semibold">Manage</span>
                        <span className="text-lg">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Stats Footer */}
          {products.length > 0 && (
            <div className="mt-12 rounded-4xl border border-gray-100 bg-white p-6 shadow-soft">
              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div className="flex flex-col items-center">
                  <span className="font-heading text-3xl font-bold text-brand-teal">
                    {products.length}
                  </span>
                  <span className="font-sans text-sm text-brand-maroon">Total Products</span>
                </div>
                <div className="hidden w-px bg-gray-200 sm:block"></div>
                <div className="flex flex-col items-center">
                  <span className="font-heading text-3xl font-bold text-brand-coral">
                    {Math.max(...products.map((p) => p.price), 0)}
                  </span>
                  <span className="font-sans text-sm text-brand-maroon">Highest Price</span>
                </div>
                <div className="hidden w-px bg-gray-200 sm:block"></div>
                <div className="flex flex-col items-center">
                  <span className="font-heading text-3xl font-bold text-brand-pink">
                    {products.length > 0 ? Math.min(...products.map((p) => p.price)) : 0}
                  </span>
                  <span className="font-sans text-sm text-brand-maroon">Lowest Price</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
