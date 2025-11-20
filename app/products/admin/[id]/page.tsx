"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/Footer";

interface Review {
  name: string;
  text: string;
  rating: number;
  image?: string;
}

interface Product {
  _id?: string;
  title: string;
  subtitle: string;
  price: number;
  razorpayItemId?: string;
  description: string;
  bannerImage: string;
  images: string[];
  benefits: string;
  videos: string[];
  reviews: Review[];
}

const initialProduct: Product = {
  title: "",
  subtitle: "",
  price: 0,
  razorpayItemId: "",
  description: "",
  bannerImage: "",
  images: [],
  benefits: "",
  videos: [],
  reviews: [],
};

export default function AdminProductEditor() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const isNew = productId === "new";

  const [product, setProduct] = useState<Product>(initialProduct);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [newReview, setNewReview] = useState<Review>({
    name: "",
    text: "",
    rating: 5,
    image: "",
  });
  const [newVideo, setNewVideo] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    if (!isNew) {
      fetchProduct();
    }
  }, [productId, isNew]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/products/api/${productId}`);
      const data = await res.json();
      if (data.success) {
        setProduct({
          ...data.product,
          images: data.product.images || [],
        });
      } else {
        toast.error("Failed to fetch product");
      }
    } catch (error) {
      toast.error("Error fetching product");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleAddVideo = () => {
    if (newVideo.trim()) {
      setProduct((prev) => ({
        ...prev,
        videos: [...prev.videos, newVideo],
      }));
      setNewVideo("");
      toast.success("Video added");
    }
  };

  const handleRemoveVideo = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const handleAddImage = () => {
    if (newImage.trim()) {
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
      }));
      setNewImage("");
      toast.success("Image added");
    }
  };

  const handleRemoveImage = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddReview = () => {
    if (newReview.name && newReview.text && newReview.rating) {
      setProduct((prev) => ({
        ...prev,
        reviews: [...prev.reviews, { ...newReview }],
      }));
      setNewReview({ name: "", text: "", rating: 5, image: "" });
      toast.success("Review added");
    } else {
      toast.error("Please fill all review fields");
    }
  };

  const handleRemoveReview = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (
      !product.title ||
      !product.subtitle ||
      !product.price ||
      !product.description ||
      !product.bannerImage
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    if (product.images.length === 0) {
      toast.error("Please add at least one product image");
      return;
    }

    setSaving(true);
    try {
      const method = isNew ? "POST" : "PUT";
      const endpoint = isNew ? "/products/api" : `/products/api/${productId}`;
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(isNew ? "Product created!" : "Product updated!");
        if (isNew) {
          router.push(`/products/admin/${data.product._id}`);
        }
      } else {
        toast.error(data.error || "Failed to save product");
      }
    } catch (error) {
      toast.error("Error saving product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-grayBg">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-brand-teal border-t-transparent"></div>
          <p className="font-heading text-xl text-brand-tealDark">Loading Product...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-brand-grayBg pb-12 pt-24">
        <div className="mx-auto max-w-4xl px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 font-heading text-4xl font-bold text-brand-tealDark">
              {isNew ? "Create New Product" : "Edit Product"}
            </h1>
            <p className="font-sans text-lg text-brand-maroon">
              {isNew
                ? "Fill in the details to create a stunning product page"
                : "Make changes to your product listing"}
            </p>
          </div>

          {/* Product Details Section */}
          <section className="mb-12 space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-8 w-2 rounded-full bg-brand-teal"></div>
              <h2 className="font-heading text-2xl font-bold text-brand-tealDark">
                Product Details
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-sans text-sm font-semibold text-brand-tealDark">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={product.title}
                    onChange={handleInputChange}
                    placeholder="Enter product title"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-sans transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-brand-teal"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-sans text-sm font-semibold text-brand-tealDark">
                    Subtitle *
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={product.subtitle}
                    onChange={handleInputChange}
                    placeholder="Enter catchy subtitle"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-sans transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-brand-teal"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-sans text-sm font-semibold text-brand-tealDark">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-sans transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-brand-teal"
                  />
                </div>

                <div>
                  <label
                    htmlFor="razorpayItemId"
                    className="mb-2 block font-sans text-sm font-semibold text-brand-tealDark"
                  >
                    Razorpay Item ID
                  </label>
                  <input
                    type="text"
                    id="razorpayItemId"
                    name="razorpayItemId"
                    value={product.razorpayItemId || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. item_RNn1BJlJAJ9sM8"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-sans transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-brand-teal"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-sans text-sm font-semibold text-brand-tealDark">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  placeholder="Enter detailed product description..."
                  rows={8}
                  className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 font-sans transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-brand-teal"
                />
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="mb-12 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-2 rounded-full bg-brand-coral"></div>
              <h2 className="font-heading text-2xl font-bold text-brand-tealDark">
                How You Benefit
              </h2>
            </div>
            <p className="font-sans text-sm text-brand-maroon">
              Short headline/paragraph that appears in the product page benefit box.
            </p>
            <textarea
              name="benefits"
              value={product.benefits}
              onChange={handleInputChange}
              placeholder="Enter compelling benefits text that will convince customers..."
              rows={3}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-sans transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-brand-coral"
            />
          </section>

          {/* Banner Image Section */}
          <section className="mb-12 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-2 rounded-full bg-brand-gold"></div>
              <h2 className="font-heading text-2xl font-bold text-brand-tealDark">Banner Image</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block font-sans text-sm font-semibold text-brand-tealDark">
                  Banner Image URL *
                </label>
                <input
                  type="text"
                  name="bannerImage"
                  value={product.bannerImage}
                  onChange={handleInputChange}
                  placeholder="Paste banner image URL or upload"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-sans transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-brand-gold"
                />
              </div>

              {product.bannerImage && (
                <div className="relative h-80 w-full overflow-hidden rounded-2xl border-2 border-gray-200">
                  <Image
                    src={product.bannerImage}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Product Images Section */}
          <section className="mb-12 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-2 rounded-full bg-brand-pink"></div>
              <h2 className="font-heading text-2xl font-bold text-brand-tealDark">
                Product Images
              </h2>
            </div>
            <p className="font-sans text-sm text-brand-maroon">
              Add multiple images for the product carousel on the product page
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Paste product image URL"
                  className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 font-sans transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-brand-pink"
                />
                <button
                  onClick={handleAddImage}
                  className="rounded-2xl bg-brand-pink px-8 py-3 font-sans font-semibold text-white shadow-soft transition-all duration-200 hover:bg-brand-maroon"
                >
                  Add Image
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {(product.images || []).map((image, index) => (
                  <div key={index} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-sans text-sm font-medium text-brand-tealDark">
                        Image {index + 1}
                      </span>
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="rounded-xl bg-red-500 px-3 py-1 font-sans text-sm text-white transition-all duration-200 hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    {image && (
                      <div className="relative h-48 w-full overflow-hidden rounded-xl border border-gray-300">
                        <Image
                          src={image}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Videos Section */}
          <section className="mb-12 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-2 rounded-full bg-brand-teal"></div>
              <h2 className="font-heading text-2xl font-bold text-brand-tealDark">
                Product Videos
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newVideo}
                  onChange={(e) => setNewVideo(e.target.value)}
                  placeholder="Paste video URL (YouTube, Vimeo, etc.)"
                  className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 font-sans transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-brand-teal"
                />
                <button
                  onClick={handleAddVideo}
                  className="rounded-2xl bg-brand-teal px-8 py-3 font-sans font-semibold text-white shadow-soft transition-all duration-200 hover:bg-brand-tealDark"
                >
                  Add Video
                </button>
              </div>

              <div className="space-y-3">
                {product.videos.map((video, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-2xl border border-gray-200 bg-brand-grayBg p-4"
                  >
                    <p className="flex-1 truncate font-sans text-sm text-brand-tealDark">{video}</p>
                    <button
                      onClick={() => handleRemoveVideo(index)}
                      className="ml-4 rounded-xl bg-red-500 px-4 py-2 font-sans text-sm text-white transition-all duration-200 hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="mb-12 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-2 rounded-full bg-brand-yellow"></div>
              <h2 className="font-heading text-2xl font-bold text-brand-tealDark">
                Customer Reviews
              </h2>
            </div>

            <div className="space-y-6">
              {/* Add Review Form */}
              <div className="space-y-4 rounded-2xl border border-gray-200 bg-gradient-to-br from-brand-grayBg to-white p-6 shadow-soft">
                <h3 className="font-heading text-lg font-bold text-brand-tealDark">
                  Add New Review
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Reviewer Name"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-sans transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-brand-yellow"
                  />

                  <select
                    value={newReview.rating}
                    onChange={(e) =>
                      setNewReview((prev) => ({ ...prev, rating: parseInt(e.target.value) }))
                    }
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 font-sans transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-brand-yellow"
                  >
                    <option value="" disabled>
                      Select Rating
                    </option>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r} {r === 1 ? "★" : "★".repeat(r)}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  value={newReview.text}
                  onChange={(e) => setNewReview((prev) => ({ ...prev, text: e.target.value }))}
                  placeholder="Review text... (What did the customer love about your product?)"
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 font-sans transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-brand-yellow"
                />

                <input
                  type="text"
                  value={newReview.image}
                  onChange={(e) => setNewReview((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="Reviewer Image URL (optional)"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-sans transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-brand-yellow"
                />

                <button
                  onClick={handleAddReview}
                  className="w-full rounded-2xl bg-brand-yellow px-6 py-3 font-sans font-bold text-brand-tealDark shadow-soft transition-all duration-200 hover:bg-yellow-500"
                >
                  Add Review
                </button>
              </div>

              {/* Existing Reviews */}
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-bold text-brand-tealDark">
                  Existing Reviews ({product.reviews.length})
                </h3>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {product.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft transition-all duration-200 hover:shadow-brand"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {review.image && (
                            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-brand-teal">
                              <Image
                                src={review.image}
                                alt={review.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-heading font-bold text-brand-tealDark">
                              {review.name}
                            </p>
                            <p className="text-sm text-yellow-500">{"★".repeat(review.rating)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveReview(index)}
                          className="rounded-xl bg-red-500 px-3 py-1 font-sans text-sm text-white transition-all duration-200 hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="font-sans text-sm leading-relaxed text-brand-maroon">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-2xl bg-gradient-to-r from-brand-teal to-brand-tealDark px-8 py-4 font-heading text-lg font-bold text-white shadow-brand transition-all duration-300 hover:from-brand-tealDark hover:to-brand-maroon disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Saving...
                </span>
              ) : isNew ? (
                "✨ Create Product"
              ) : (
                "💫 Update Product"
              )}
            </button>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
