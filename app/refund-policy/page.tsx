export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 via-black to-black text-white px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-yellow-400/30 bg-black/40 p-6 md:p-10 shadow-[0_0_45px_rgba(250,204,21,0.15)]">
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-300">
          Refund Policy
        </h1>

        <p className="mt-4 text-white/70">Last updated: June 2026</p>

        <section className="mt-8 space-y-5 text-white/80 leading-relaxed">
          <p>
            This Refund Policy explains how refund requests are handled for THE
            CHARIOT / TAROT PREMIUM.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            1. Digital Product
          </h2>
          <p>
            THE CHARIOT provides a digital entertainment service. Once premium
            access has been activated and the service has been used, payments
            are generally non-refundable.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            2. Eligible Refund Cases
          </h2>
          <p>
            A refund may be considered if payment was successful but premium
            access was not activated due to a technical error, duplicate payment,
            or system failure.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            3. Refund Request
          </h2>
          <p>
            Users may contact us through the Contact page and provide the payment
            date, payment method, order ID, and email used during payment.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            4. Review Process
          </h2>
          <p>
            Refund requests will be reviewed manually. Approval depends on the
            issue, payment status, and service usage condition.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            5. Processing Time
          </h2>
          <p>
            Processing time may depend on the payment gateway, payment method,
            and banking provider involved in the transaction.
          </p>

          <h2 className="text-xl font-semibold text-yellow-200">
            6. Contact
          </h2>
          <p>
            For refund-related questions, please contact us through the Contact
            page.
          </p>
        </section>
      </div>
    </main>
  );
}