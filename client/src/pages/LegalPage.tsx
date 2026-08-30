import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" eyebrow="Brand Janra">
      <p>Brand Janra respects your privacy. This policy explains what information is used when you browse our storefront or connect an external account.</p>
      <h2>Information we use</h2>
      <p>We may use information needed to operate the storefront, provide customer support, maintain security, and measure site performance. If you connect a social account, we use the permissions you approve only to provide the requested publishing or account-connection features.</p>
      <h2>Social account connections</h2>
      <p>Brand Janra does not receive or store your social-media password. OAuth tokens are stored server-side and are used only for the connected integration. You can revoke access at any time from the relevant provider’s security settings.</p>
      <h2>Sharing and retention</h2>
      <p>We do not sell personal information. Information is retained only for as long as needed to provide the requested service, meet legal obligations, resolve disputes, and protect the storefront.</p>
      <h2>Contact</h2>
      <p>For privacy questions or requests, contact <a href="mailto:anuakku20138@gmail.com">anuakku20138@gmail.com</a>.</p>
    </LegalLayout>
  );
}

export function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" eyebrow="Brand Janra">
      <p>By using Brand Janra, you agree to use the storefront lawfully and not to interfere with its operation, misuse partner links, or attempt to access systems without authorization.</p>
      <h2>Storefront and partner links</h2>
      <p>Brand Janra may display products and links from third-party merchants or affiliate networks. Product availability, pricing, shipping, returns, and fulfillment are governed by the linked merchant’s terms.</p>
      <h2>Social integrations</h2>
      <p>When you connect YouTube, Meta, or another supported social account, you authorize Brand Janra to use the permissions shown by the provider for the requested feature. You remain responsible for the content and accounts you connect.</p>
      <h2>Changes</h2>
      <p>We may update these terms as the storefront and integrations change. Continued use after an update means you accept the revised terms.</p>
      <h2>Contact</h2>
      <p>For questions about these terms, contact <a href="mailto:anuakku20138@gmail.com">anuakku20138@gmail.com</a>.</p>
    </LegalLayout>
  );
}

function LegalLayout({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f3ed] text-stone-950">
      <header className="border-b border-stone-200/80 bg-[#f6f3ed]">
        <div className="mx-auto flex max-w-4xl items-center px-5 py-5 lg:px-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 transition hover:text-stone-950">
            <ArrowLeft className="h-4 w-4" /> Back to Brand Janra
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-5 py-12 lg:px-10 lg:py-20">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-500">{eyebrow}</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">{title}</h1>
        <div className="mt-10 space-y-5 text-sm leading-7 text-stone-700 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-stone-950 [&_a]:font-semibold [&_a]:text-stone-950 [&_a]:underline">{children}</div>
      </main>
    </div>
  );
}
