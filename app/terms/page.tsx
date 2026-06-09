export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 via-black to-black text-white px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-yellow-400/30 bg-black/40 p-6 md:p-10 shadow-[0_0_45px_rgba(250,204,21,0.15)]">
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-300">
          Terms & Conditions
        </h1>

        <p className="mt-4 text-white/70">Last updated: June 2026</p>

        <section className="mt-8 space-y-5 text-white/80 leading-relaxed">
          <p>
            Welcome to THE CHARIOT / TAROT PREMIUM. By using this website and our
            digital tarot reading service, you agree to these Terms & Conditions.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            1. Service Description
          </h2>
          <p>
            THE CHARIOT provides digital tarot-style readings generated with the
            assistance of artificial intelligence. The service is intended for
            entertainment, reflection, and personal insight purposes only.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            2. Premium Access
          </h2>
          <p>
            Users may purchase premium access to unlock additional reading
            features. The premium price displayed on the website is a one-time
            payment unless stated otherwise.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            3. User Responsibility
          </h2>
          <p>
            Users are responsible for the questions, information, and images they
            submit. Users must not upload illegal, harmful, offensive, or
            unauthorized content.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            4. No Professional Advice
          </h2>
          <p>
            Our readings are not medical, legal, financial, psychological, or
            professional advice. Users should not make important life decisions
            solely based on the readings provided by this service.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            5. Payment
          </h2>
          <p>
            Payments are processed through a third-party payment gateway. We do
            not store credit card or banking information on our server.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            6. Contact
          </h2>
          <p>
            For questions about these terms, please contact us through the
            Contact page.
          </p>
        </section>
      </div>
    </main>
  );
}