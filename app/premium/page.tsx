"use client";

import { useState } from "react";

export default function PremiumPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/ipaymu/create-payment", {
        method: "POST",
      });

      const data = await response.json();

      console.log("IPAYMU CREATE PAYMENT:", data);

      if (!data?.Success || !data?.Data?.Url) {
        setMessage("Gagal membuat link pembayaran iPaymu.");
        setLoading(false);
        return;
      }

      if (data?.Data?.SessionID) {
        localStorage.setItem("ipaymuSessionId", data.Data.SessionID);
      }

      window.location.href = data.Data.Url;
    } catch (error) {
      console.error("IPAYMU PAYMENT ERROR:", error);

      setMessage("Terjadi error saat membuat pembayaran iPaymu.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-950 via-green-900 to-black px-5 py-8 text-white">
      <a
        href="/"
        className="fixed left-4 top-4 z-[9999] rounded-2xl border border-yellow-400 bg-black/80 px-5 py-3 text-sm font-bold text-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.35)] hover:bg-yellow-400/10"
      >
        Menu Utama
      </a>

      <section className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-yellow-400 text-4xl font-serif text-yellow-300 shadow-[0_0_45px_rgba(250,204,21,0.35)]">
            VII
          </div>

          <h1 className="text-3xl font-bold text-yellow-300 md:text-5xl">
            THE CHARIOT PREMIUM
          </h1>

          <p className="mt-3 text-sm text-yellow-100/80 md:text-base">
            Buka pembacaan tarot premium yang lebih dalam, personal,
            emosional, dan eksklusif.
          </p>
        </div>

        <div className="rounded-3xl border border-yellow-400/40 bg-black/35 p-6 shadow-[0_0_55px_rgba(250,204,21,0.18)] md:p-8">
          <div className="text-center">
            <p className="text-yellow-200">Paket Premium</p>

            <h2 className="mt-2 text-4xl font-bold text-yellow-300">
              Rp59.900
            </h2>

            <p className="mt-2 text-sm text-white/70">
              Sekali pembayaran untuk membuka fitur premium.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-yellow-400/25 bg-green-950/50 p-5">
              <h3 className="text-lg font-bold text-yellow-300">
                Premium Tarot
              </h3>

              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>• Reading lebih panjang dan mendalam</li>
                <li>• Analisis energi emosional</li>
                <li>• Interpretasi kartu lebih personal</li>
                <li>• Menggunakan model AI premium</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-yellow-400/25 bg-green-950/50 p-5">
              <h3 className="text-lg font-bold text-yellow-300">
                Premium Fengshui
              </h3>

              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>• Analisis energi ruangan</li>
                <li>• Rekomendasi arah dan elemen</li>
                <li>• Cocok untuk kamar, rumah, dan usaha</li>
                <li>• Fitur segera ditambahkan</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="w-full rounded-2xl bg-yellow-500 py-4 text-lg font-bold text-black shadow-[0_0_40px_rgba(250,204,21,0.45)] transition-all hover:bg-yellow-400 disabled:opacity-60"
            >
              {loading ? "Memproses Pembayaran..." : "Lanjutkan Pembayaran"}
            </button>
          </div>

          {message && (
            <div className="mt-6 rounded-2xl border border-yellow-400/30 bg-black/40 p-4 text-center text-sm text-yellow-100">
              {message}
            </div>
          )}

          <p className="mt-6 text-center text-xs text-white/50">
            Pembayaran diproses melalui iPaymu Sandbox. Setelah pembayaran
            selesai, Anda akan diarahkan kembali ke halaman aplikasi.
          </p>
        </div>
      </section>
    </main>
  );
}