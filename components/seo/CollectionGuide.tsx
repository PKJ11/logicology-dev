import Link from "next/link";
import type { ReactNode } from "react";

export interface GuideSection {
  heading: string;
  body: ReactNode;
}

export interface Faq {
  q: string;
  a: string;
}

// Server-rendered keyword copy + FAQ shown below a collection grid (/games, /books).
export default function CollectionGuide({
  sections,
  faqs,
  faqHeading = "Frequently asked questions",
}: {
  sections: GuideSection[];
  faqs: Faq[];
  faqHeading?: string;
}) {
  return (
    <section className="mx-auto mt-14 max-w-4xl text-brand-tealDark sm:mt-16">
      <div className="space-y-10 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-10">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="mb-3 font-heading text-2xl font-bold text-brand-teal sm:text-3xl">
              {s.heading}
            </h2>
            <div className="space-y-3 leading-relaxed text-brand-tealDark/85">{s.body}</div>
          </div>
        ))}

        <div>
          <h2 className="mb-4 font-heading text-2xl font-bold text-brand-teal sm:text-3xl">
            {faqHeading}
          </h2>
          <div className="divide-y divide-brand-teal/15">
            {faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-tealDark">
                  {f.q}
                  <span className="text-brand-coral transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 leading-relaxed text-brand-tealDark/80">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function GuideLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-brand-teal underline-offset-2 hover:underline">
      {children}
    </Link>
  );
}
