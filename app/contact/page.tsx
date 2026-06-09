export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 via-black to-black text-white px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-yellow-400/30 bg-black/40 p-6 md:p-10 shadow-[0_0_45px_rgba(250,204,21,0.15)]">
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-300">
          Contact & Support
        </h1>

        <p className="mt-4 text-white/70">
          Need help with your premium access, payment, or tarot reading
          experience? Please contact us using the information below.
        </p>

        <section className="mt-8 space-y-5 text-white/80 leading-relaxed">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold text-yellow-200">
              Business Name
            </h2>
            <p className="mt-2">TAROT PREMIUM / THE CHARIOT</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold text-yellow-200">
              Support Email
            </h2>
            <p className="mt-2">ariesdewanto65@gmail.com</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold text-yellow-200">
              Website
            </h2>
            <p className="mt-2">https://tarot-premium-ai.vercel.app</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold text-yellow-200">
              Support Information
            </h2>
            <p className="mt-2">
              Please include your payment date, order ID, payment method, and
              the issue you experienced so we can help you faster.
            </p>

               <a
                href="/"
                className="mt-8 inline-block text-yellow-300 underline hover:text-yellow-200"
               >
                 ← Back / Kembali
               </a>

          </div>
        </section>
      </div>
    </main>
  );
}