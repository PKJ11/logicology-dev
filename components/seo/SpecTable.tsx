import type { ReactNode } from "react";

export interface Spec {
  label: string;
  value: ReactNode;
}

// Plain-text product facts (age, players, time, skills, contents, price) so search and AI tools
// can quote them. Styled to sit inside CollectionGuide.
export default function SpecTable({ specs, caption }: { specs: Spec[]; caption: string }) {
  return (
    <table className="w-full text-left text-brand-tealDark">
      <caption className="sr-only">{caption}</caption>
      <tbody className="divide-y divide-brand-teal/15">
        {specs.map((s) => (
          <tr key={s.label}>
            <th scope="row" className="w-1/3 py-3 pr-4 align-top font-semibold text-brand-teal">
              {s.label}
            </th>
            <td className="py-3 leading-relaxed text-brand-tealDark/85">{s.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
