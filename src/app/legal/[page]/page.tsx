import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";

// Placeholder structure only. Real texts come from a lawyer or a generator before launch.
const PAGES: Record<string, { title: string; sections: { heading: string; body: string[] }[] }> = {
  imprint: {
    title: "Imprint",
    sections: [
      { heading: "Provider", body: ["[COMPANY LEGAL NAME]", "[STREET AND NUMBER]", "[POSTCODE CITY], Germany"] },
      { heading: "Represented by", body: ["[MANAGING DIRECTOR]"] },
      { heading: "Contact", body: ["Email: [CONTACT EMAIL]", "Phone: [PHONE]"] },
      { heading: "Register entry", body: ["[REGISTER COURT], [REGISTER NUMBER]"] },
      { heading: "VAT ID", body: ["[VAT ID according to § 27a UStG]"] },
      { heading: "Responsible for content", body: ["[NAME, ADDRESS]"] },
    ],
  },
  privacy: {
    title: "Privacy policy",
    sections: [
      { heading: "Controller", body: ["[COMPANY LEGAL NAME, ADDRESS, CONTACT EMAIL]"] },
      { heading: "Data we process", body: ["[Account data, payment data via payment provider, API usage logs, server logs]"] },
      { heading: "Purposes and legal bases", body: ["[Contract performance, Art. 6(1)(b) GDPR; legitimate interests, Art. 6(1)(f) GDPR]"] },
      { heading: "Processors", body: ["[Hosting provider, payment provider, authentication provider, email provider]"] },
      { heading: "Retention", body: ["[Retention periods per data category]"] },
      { heading: "Your rights", body: ["[Access, rectification, erasure, restriction, portability, objection, complaint to a supervisory authority]"] },
    ],
  },
  terms: {
    title: "Terms of service",
    sections: [
      { heading: "Scope", body: ["[Who these terms apply to; B2B only]"] },
      { heading: "Subscriptions and trial", body: ["[14-day trial, monthly billing, automatic renewal, cancellation before trial end]"] },
      { heading: "Use of the API", body: ["[Permitted use, request limits, no resale of raw data, no betting functionality]"] },
      { heading: "Data and third-party rights", body: ["[Source data owned by Riot Games; EBH Data provides derived metrics]"] },
      { heading: "Availability and liability", body: ["[Service levels, limitation of liability]"] },
      { heading: "Governing law", body: ["[German law, place of jurisdiction]"] },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((page) => ({ page }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  return { title: PAGES[page]?.title ?? "Not found" };
}

export default async function LegalPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const content = PAGES[page];
  if (!content) notFound();
  return (
    <SiteShell>
      <PageHeader title={content.title} sub="Placeholder. Final text will follow before launch." />
      <div className="container-page max-w-[760px] pb-28">
        {content.sections.map((s) => (
          <section key={s.heading} className="border-t border-gray-4 py-8">
            <h2 className="t-h6">{s.heading}</h2>
            <div className="t-md mt-3 flex flex-col gap-1 text-gray-2">
              {s.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </SiteShell>
  );
}
