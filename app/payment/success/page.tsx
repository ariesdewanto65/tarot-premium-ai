

  "use client";

import Link from "next/link";
import { useEffect } from "react";

export default function PaymentSuccessPage() {
  useEffect(() => {
    localStorage.setItem("premium", "true");
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-950 via-green-900 to-black px-5 text-white">
      <div className="max-w-xl rounded-3xl border border-yellow-400/40 bg-black/40 p-8 text-center shadow-[0_0_55px_rgba(250,204,21,0.18)]">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-yellow-400 text-4xl font-bold text-yellow-300 shadow-[0_0_45px_rgba(250,204,21,0.35)]">
          ✓
        </div>

        <h1 className="text-3xl font-bold text-yellow-300">
          Pembayaran Berhasil
        </h1>

        <p className="mt-4 text-sm leading-7 text-yellow-100/80">
          Terima kasih. Pembayaran Anda sudah diproses. Fitur premium telah
          diaktifkan di browser ini.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-2xl bg-yellow-500 px-6 py-3 font-bold text-black hover:bg-yellow-400"
          >
            Kembali ke Menu Utama
          </Link>

          <Link
            href="/premium"
            className="rounded-2xl border border-yellow-400/60 px-6 py-3 font-bold text-yellow-200 hover:bg-yellow-400/10"
          >
            Halaman Premium
          </Link>
        </div>

        <p className="mt-6 text-xs text-white/50">
          Catatan: saat ini pembayaran masih menggunakan mode sandbox/testing
          iPaymu.
        </p>
      </div>
    </main>
  );
}