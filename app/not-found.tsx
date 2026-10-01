import Link from "next/link";
import NavBar from "@/components/NavBar";

const LINKS = [
  { href: "/games", label: "Brain games for kids" },
  { href: "/books", label: "Logic puzzle books" },
  { href: "/products", label: "Shop all products" },
  { href: "/blog", label: "Ideas for parents" },
];

export default function NotFound() {
  return (
    <>
      <NavBar />
      <section className="grid min-h-[60vh] place-items-center bg-brand-grayBg">
        <div className="p-10 text-center">
          <h1 className="heading-lg">Oops, this page took a wrong turn</h1>
          <p className="lead mt-2">
            The page you were looking for doesn&apos;t exist. Try one of these instead:
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link className="btn btn-light" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Link className="btn btn-primary" href="/">
              Go Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
