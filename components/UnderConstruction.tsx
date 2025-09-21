import Link from "next/link";
import NavBar from "./NavBar";

export default function UnderConstruction({ title }: { title: string }) {
  return (
    <>
    <NavBar/>
    <section className="grid min-h-[60vh] place-items-center bg-brand-grayBg">
      
      <div className="p-10 text-center">
        <h1 className="heading-lg">{title}</h1>
        <p className="lead mt-2">This page is under construction. Check back soon.</p>
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
