"use client";

import { useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export default function PremiumPage() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/tarot/create-transaction", {
        method: "POST",
      });

      const data = await response.json();

      console.log("CREATE TRANSACTION:", data);

      if (!data?.token) {
        setMessage("Token pembayaran tidak ditemukan.");
        setLoading(false);
        return;
      }

      if (data?.orderId) {
        localStorage.setItem("orderId", data.orderId);
      }

      if (!window.snap) {
        setMessage("Midtrans Snap belum siap. Refresh halaman dulu bro.");
        setLoading(false);
        return;
      }

      window.snap.pay(data.token, {
        onSuccess: function (result: any) {
          console.log("PAYMENT SUCCESS:", result);

          localStorage.setItem("premium", "true");

          setMessage("Pembayaran berhasil. Premium aktif.");
          setLoading(false);
        },

        onPending: function (result: any) {
          console.log("PAYMENT PENDING:", result);

          setMessage(
            "Pembayaran masih pending. Selesaikan pembayaran, lalu klik Cek Status Premium."
          );

          setLoading(false);
        },

        onError: function (result: any) {
          console.log("PAYMENT ERROR:", result);

          setMessage("Pembayaran gagal. Silakan coba lagi.");
          setLoading(false);
        },

        onClose: function () {
          console.log("SNAP POPUP CLOSED");

          setMessage("Popup pembayaran ditutup sebelum selesai.");
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("PAYMENT ERROR:", error);

      setMessage("Terjadi error saat membuat pembayaran.");
      setLoading(false);
    }
  };

  const handleCheckPayment = async () => {
    setChecking(true);
    setMessage("");

    try {
      const savedOrderId = localStorage.getItem("orderId");

      if (!savedOrderId) {
        setMessage("Belum ada order pembayaran yang tersimpan.");
        setChecking(false);
        return;
      }

      const response = await fetch("/api/tarot/check-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: savedOrderId,
        }),
      });

      const data = await response.json();

      console.log("CHECK PAYMENT:", data);

      const status =
        data?.transaction_status ||
        data?.raw?.transaction_status;

      if (status === "settlement" || status === "capture") {
        localStorage.setItem("premium", "true");

        setMessage("Premium aktif. Pembayaran sudah berhasil.");
      } else if (status === "pending") {
        setMessage("Pembayaran masih pending.");
      } else {
        setMessage(`Status pembayaran: ${status || "tidak diketahui"}`);
      }

      setChecking(false);
    } catch (error) {
      console.error("CHECK PAYMENT ERROR:", error);

      setMessage("Gagal mengecek status pembayaran.");
      setChecking(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-950 via-green-900 to-black text-white px-5 py-8">
        <a
           href="/"
            className="fixed left-4 top-4 z-[9999] rounded-2xl border border-yellow-400 bg-black/80 px-5 py-3 text-sm font-bold text-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.35)] hover:bg-yellow-400/10"
           >
             Menu Utama
         </a>
      <section className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-yellow-400 text-4xl font-serif text-yellow-300 shadow-[0_0_45px_rgba(250,204,21,0.35)]">
            VII
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-yellow-300">
            THE CHARIOT PREMIUM
          </h1>

          <p className="mt-3 text-sm md:text-base text-yellow-100/80">
            Buka pembacaan tarot premium yang lebih dalam, personal,
            emosional, dan eksklusif.
          </p>
        </div>

        <div className="rounded-3xl border border-yellow-400/40 bg-black/35 p-6 md:p-8 shadow-[0_0_55px_rgba(250,204,21,0.18)]">
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

            <button
              type="button"
              onClick={handleCheckPayment}
              disabled={checking}
              className="w-full rounded-2xl border border-yellow-400/60 py-4 text-lg font-bold text-yellow-200 transition-all hover:bg-yellow-400/10 disabled:opacity-60"
            >
              {checking ? "Mengecek Status..." : "Cek Status Premium"}
            </button>
          </div>

          {message && (
            <div className="mt-6 rounded-2xl border border-yellow-400/30 bg-black/40 p-4 text-center text-sm text-yellow-100">
              {message}
            </div>
          )}

                <p className="mt-6 text-center text-xs text-white/50">
                   Pembayaran diproses melalui Midtrans. Jika popup ditutup sebelum selesai,
                  status premium belum aktif. Selesaikan pembayaran lalu klik Cek Status Premium.
              </p>
        </div>
      </section>
    </main>
  );
}