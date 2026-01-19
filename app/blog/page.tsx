import Link from 'next/link';

// Dummy blog data for now
const blogs = [
  {
    id: 'top-10-logic-based-learning-activities',
    title: 'Top 10 Logic-Based Learning Activities for Kids: Boost Their Skills',
    summary: 'Explore the best logic-based activities to help children develop critical thinking and problem-solving skills. Includes puzzles, games, and STEM kits.'
  }
];

export default function BlogListPage() {
  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Logicology Blog</h1>
      <ul className="space-y-6">
        {blogs.map(blog => (
          <li key={blog.id} className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
            <p className="mb-2 text-gray-700">{blog.summary}</p>
            <Link href={`/blog/${blog.id}`} className="text-blue-600 hover:underline">Read More</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
