import NavBar from "@/components/NavBar";
import Link from "next/link";

// Blog data array
const blogs = [
  {
    id: "top-10-logic-based-learning-activities",
    title: "Top 10 Logic-Based Learning Activities for Kids: Boost Their Skills",
    summary:
      "Explore the best logic-based activities to help children develop critical thinking and problem-solving skills.",
    date: "March 15, 2024",
    readTime: "8 min read",
    category: "Learning Activities",
  },
  {
    id: "board-games-vs-video-games",
    title: "Board Games vs Video Games: Which is Better for Kids' Education?",
    summary:
      "A comprehensive comparison of board games and video games for children's educational development.",
    date: "March 20, 2024",
    readTime: "10 min read",
    category: "Educational Research",
  },
];

export default function BlogListPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gradient-to-b from-brand-grayBg to-white pb-16 pt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="mb-12 animate-fade-in text-center">
            <h1 className="mb-4 font-heading text-4xl font-bold text-brand-tealDark md:text-5xl">
              Logicology Blog
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Expert insights, research, and practical tips for fostering critical thinking and
              problem-solving skills in children.
            </p>
          </div>

          {/* Featured Blog Card */}
          <div className="mb-16 animate-slide-in">
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-soft transition-shadow duration-300 hover:shadow-brand">
              <div className="md:flex">
                <div className="flex items-center justify-center bg-gradient-to-r from-brand-teal to-brand-tealDark p-8 md:w-2/5">
                  <div className="text-center text-white">
                    <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                      Featured Article
                    </span>
                    <h2 className="mb-4 font-heading text-2xl font-bold">
                      Board Games vs Video Games
                    </h2>
                    <p className="mb-6 text-white/90">
                      Which is better for your child's education?
                    </p>
                    <Link
                      href="/blog/board-games-vs-video-games"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-brand-tealDark transition-colors duration-200 hover:bg-gray-100"
                    >
                      Read Now
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="p-8 md:w-3/5">
                  <div className="mb-4 flex items-center gap-4">
                    <span className="rounded-full bg-brand-coral/10 px-3 py-1 text-sm font-semibold text-brand-coral">
                      Educational Research
                    </span>
                    <span className="text-sm text-gray-500">March 20, 2024</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">10 min read</span>
                  </div>
                  <p className="text-lg leading-relaxed text-gray-700">
                    Choosing educational activities for children can often feel like navigating a
                    complex maze. Parents frequently find themselves weighing the merits of
                    traditional pastimes against modern technology. In this comprehensive
                    comparison, we explore how board games and video games contribute to children's
                    development.
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-brand-teal to-brand-tealDark font-bold text-white">
                        L
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Logicology Team</p>
                        <p className="text-sm text-gray-500">Education Experts</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-brand-teal">
                      <span className="text-sm font-semibold">15+ min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All Articles */}
          <div className="mb-12">
            <h2 className="mb-8 font-heading text-2xl font-bold text-gray-800">All Articles</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {blogs.map((blog, index) => (
                <article
                  key={blog.id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-brand"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded-full bg-brand-teal/10 px-3 py-1 text-sm font-semibold text-brand-teal">
                        {blog.category}
                      </span>
                      <span className="text-sm text-gray-500">{blog.date}</span>
                    </div>
                    <h3 className="mb-3 font-heading text-xl font-bold text-gray-800 transition-colors duration-200 group-hover:text-brand-teal">
                      {blog.title}
                    </h3>
                    <p className="mb-6 text-gray-600">{blog.summary}</p>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/blog/${blog.id}`}
                        className="inline-flex items-center gap-2 font-semibold text-brand-teal transition-colors duration-200 hover:text-brand-tealDark"
                      >
                        Read More
                        <svg
                          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </Link>
                      <span className="text-sm text-gray-500">{blog.readTime}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          {/* <div className="bg-gradient-to-r from-brand-tealDark to-brand-teal rounded-3xl p-8 md:p-12 text-white animate-fade-in">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-heading font-bold mb-4">
              Never Miss an Update
            </h3>
            <p className="text-white/90 mb-8">
              Subscribe to our newsletter for the latest insights on educational games, parenting tips, and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-brand-gold text-brand-tealDark rounded-full font-semibold hover:bg-yellow-500 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
            <p className="text-white/70 text-sm mt-4">
              No spam, unsubscribe anytime.
            </p>
          </div>
        </div> */}
        </div>
      </main>
    </>
  );
}
