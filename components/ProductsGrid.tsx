// components/ProductsGrid.tsx
type Props = {
  products: any[];
  adding: string | null;
  handleAddToCart: (variantId: string) => void;
};

export default function ProductsGrid({ products, adding, handleAddToCart }: Props) {
  return (
    <section className="min-h-screen w-full bg-brand-hero">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Heading */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-wider text-brand-teal/70">Explore</p>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-tealDark">
              Our Products
            </h1>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const img = product.images?.edges?.[0]?.node;
            const variant = product.variants?.edges?.[0]?.node;
            const price = variant?.price?.amount;
            const currency = variant?.price?.currencyCode;

            return (
              <article
                key={product.id}
                className="
                  group relative overflow-hidden rounded-4xl bg-white border border-black/5
                  shadow-soft hover:shadow-brand transition-shadow
                  focus-within:ring-2 focus-within:ring-brand-teal/30
                "
              >
                {/* Image */}
                <div className="p-5">
                  <div className="relative aspect-square w-full rounded-3xl bg-brand-grayBg">
                    {img?.url ? (
                      // Use next/image if you prefer; kept <img> for parity with your code
                      <img
                        src={img.url}
                        alt={img.altText || product.title}
                        className="
                          absolute inset-0 h-full w-full object-contain
                          transition-transform duration-300 group-hover:scale-[1.03]
                        "
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-sm text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                  <h2 className="font-heading text-xl font-semibold text-gray-900 line-clamp-2">
                    {product.title}
                  </h2>

                  {product.description ? (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                      {product.description}
                    </p>
                  ) : null}

                  <div className="mt-4 flex items-center justify-between">
                    <div className="font-heading text-lg font-bold text-brand-tealDark">
                      {price} <span className="text-gray-500 text-base">{currency}</span>
                    </div>

                    <button
                      className="
                        inline-flex items-center justify-center rounded-2xl
                        bg-brand-gold px-4 py-2 font-medium text-white
                        shadow-[0_8px_20px_rgba(216,174,79,0.35)]
                        transition-all hover:-translate-y-0.5 hover:bg-brand-gold/90
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40
                        disabled:opacity-50 disabled:hover:translate-y-0
                      "
                      onClick={() => handleAddToCart(variant?.id)}
                      disabled={!variant?.id || adding === variant?.id}
                      aria-busy={adding === variant?.id}
                    >
                      {adding === variant?.id ? "Adding…" : "Add to Cart"}
                    </button>
                  </div>
                </div>

                {/* Accent bar */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-teal via-brand-coral to-brand-gold opacity-80" />
              </article>
            );
          })}

          {/* Empty state */}
          {(!products || products.length === 0) && (
            <div className="col-span-full">
              <div className="rounded-4xl border border-dashed border-brand-teal/30 bg-white p-10 text-center shadow-soft">
                <h3 className="font-heading text-xl text-brand-tealDark">No products yet</h3>
                <p className="mt-2 text-gray-600">
                  Add products in Shopify and refresh this page.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
