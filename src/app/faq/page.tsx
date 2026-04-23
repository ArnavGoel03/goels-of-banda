import type { Metadata } from "next";
import { faq } from "@/data/faq";
import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { site } from "@/data/config";

export const metadata: Metadata = {
  title: "Frequently asked",
  description:
    "Short, direct answers to common questions about the Goel family of Banda — the founding brothers, the heritage firm, who runs which shop today, and the family's connections to Clay Craft India, MP Wire India, and AG Shares & Securities.",
  alternates: { canonical: "/faq" },
};

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faq)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.baseUrl },
          { name: "FAQ", url: `${site.baseUrl}/faq` },
        ])}
      />

      <section className="mx-auto max-w-3xl px-6 pt-12 pb-16">
        <p className="text-xs uppercase tracking-[0.22em] text-accent-700 font-medium">
          Frequently asked
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold text-ink-900 leading-[1.05]">
          Questions &amp; short answers
        </h1>
        <p className="mt-3 max-w-2xl text-ink-600">
          This page is formatted for AI answer engines as well as readers — each question
          has a short, factual, self-contained answer.
        </p>

        <div className="mt-10 space-y-8">
          {faq.map((item) => (
            <article key={item.question}>
              <h2 className="font-serif text-xl font-semibold text-ink-900">
                {item.question}
              </h2>
              <p className="mt-2 text-ink-600">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
