export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 via-black to-black text-white px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-yellow-400/30 bg-black/40 p-6 md:p-10 shadow-[0_0_45px_rgba(250,204,21,0.15)]">
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-300">
          Privacy Policy
        </h1>

        <p className="mt-4 text-white/70">Last updated: June 2026</p>

        <section className="mt-8 space-y-5 text-white/80 leading-relaxed">
          <p>
            This Privacy Policy explains how THE CHARIOT / TAROT PREMIUM
            collects, uses, and protects user information when using our digital
            tarot reading service.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            1. Information We Collect
          </h2>
          <p>
            We may collect information submitted by users, including questions,
            selected cards, uploaded images, payment status, and basic technical
            information needed to operate the service.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            2. How We Use Information
          </h2>
          <p>
            We use the information to generate readings, provide premium access,
            process payments, improve the service, and respond to support
            requests.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            3. Payment Data
          </h2>
          <p>
            Payment transactions are handled by a third-party payment gateway.
            We do not store credit card numbers, bank account numbers, or
            sensitive payment credentials.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            4. Uploaded Images
          </h2>
          <p>
            Uploaded images are used only to support the reading experience.
            Users should not upload images that they do not have permission to
            use.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            5. Data Protection
          </h2>
          <p>
            We take reasonable steps to protect user information. However, no
            online service can guarantee absolute security.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            6. User Rights
          </h2>
          <p>
            Users may contact us to ask questions about their data, request
            support, or request deletion of information where technically
            possible.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            7. Contact
          </h2>
          <p>
            For privacy-related questions, please contact us through the Contact
            page.
          </p>
              <a
                href="/"
                 className="mt-8 inline-block text-yellow-300 underline hover:text-yellow-200"
             >
                  ← Back / Kembali
            </a>
        </section>
      </div>
    </main>
  );
}