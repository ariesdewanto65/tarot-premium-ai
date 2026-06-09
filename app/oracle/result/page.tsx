"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { GoddessCard } from "../goddessDeck";

type OracleReadingData = {
  question?: string;
  cards: GoddessCard[];
  createdAt?: string;
};

export default function OracleResultPage() {
  const [readingData, setReadingData] =
    useState<OracleReadingData | null>(null);

  useEffect(() => {
    const savedReading = localStorage.getItem("oracleReading");

    if (!savedReading) {
      return;
    }

    try {
      const parsed = JSON.parse(savedReading) as OracleReadingData;
      setReadingData(parsed);
    } catch (error) {
      console.error("FAILED TO READ ORACLE DATA:", error);
    }
  }, []);

  const cardPositions = [
    {
      label: "CARD 1 • ENERGI AKAR",
      meaning:
        "Kartu ini menunjukkan akar energi yang sedang memengaruhi pertanyaanmu. Perhatikan pola batin, luka lama, atau dorongan terdalam yang menjadi sumber situasi ini.",
    },
    {
      label: "CARD 2 • PESAN UTAMA",
      meaning:
        "Kartu ini membawa pesan utama dari energi dewi. Inilah inti bimbingan yang perlu kamu dengar sekarang, terutama tentang apa yang perlu disadari, diterima, atau dilepaskan.",
    },
    {
      label: "CARD 3 • ARAHAN JIWA",
      meaning:
        "Kartu ini menjadi arahan jiwa. Ia menunjukkan langkah lembut yang bisa kamu ambil agar energimu kembali selaras dan tidak bergerak dari rasa takut.",
    },
  ];

  if (!readingData || readingData.cards.length === 0) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#14532d_0%,#020617_45%,#000_100%)] px-4 py-10 text-white">
        <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center text-center">
          <p className="text-sm tracking-[0.35em] text-yellow-300">
            THE ORACLE
          </p>

          <h1 className="mt-4 text-4xl font-bold text-yellow-200">
            Belum Ada Reading
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
            Belum ada kartu oracle yang dipilih. Silakan kembali ke halaman
            oracle dan pilih 3 kartu terlebih dahulu.
          </p>

          <a
            href="/oracle"
            className="mt-8 rounded-full bg-yellow-400 px-7 py-3 font-bold text-black shadow-[0_0_35px_rgba(250,204,21,0.45)] transition hover:bg-yellow-300"
          >
            Kembali ke Oracle Deck
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#14532d_0%,#020617_45%,#000_100%)] px-4 py-10 text-white">
      <section className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="text-center">
          <p className="text-sm tracking-[0.35em] text-yellow-300">
            THE ORACLE
          </p>

          <h1 className="mt-4 text-4xl font-bold text-yellow-200 md:text-6xl">
            Hasil Pembacaan Dewi
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            Tiga kartu yang muncul membawa pola energi, pesan utama, dan arahan
            jiwa untuk perjalanan batinmu saat ini.
          </p>

          {readingData.question && readingData.question.trim() !== "" && (
            <p className="mx-auto mt-5 max-w-2xl rounded-2xl border border-yellow-400/20 bg-black/30 p-4 text-sm italic leading-7 text-yellow-50/80">
              “{readingData.question}”
            </p>
          )}
        </div>

        {/* CARDS RESULT */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {readingData.cards.slice(0, 3).map((card, index) => (
            <article
              key={card.id}
              className="rounded-3xl border border-yellow-400/25 bg-black/35 p-4 shadow-[0_0_45px_rgba(250,204,21,0.12)]"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-yellow-400/25">
                <Image
                  src={card.image}
                  alt={`${card.name} — ${card.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={index === 0}
                />
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold tracking-[0.25em] text-yellow-300">
                  {cardPositions[index]?.label}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white">
                  {card.name}
                </h2>

                <p className="text-base italic text-yellow-200">
                  {card.title}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {card.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs text-yellow-100"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                <p className="mt-5 text-sm leading-7 text-white/75">
                  {card.energy}
                </p>

                <p className="mt-5 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4 text-sm leading-7 text-yellow-50/85">
                  {cardPositions[index]?.meaning}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* SUMMARY */}
        <section className="mx-auto mt-12 max-w-4xl rounded-3xl border border-yellow-400/25 bg-black/35 p-6 text-center shadow-[0_0_45px_rgba(250,204,21,0.12)] md:p-8">
          <p className="text-xs font-semibold tracking-[0.3em] text-yellow-300/80">
            PESAN PENUTUP
          </p>

          <h2 className="mt-3 text-2xl font-bold text-yellow-200 md:text-3xl">
            Energi yang Sedang Dibuka
          </h2>

          <p className="mt-5 text-sm leading-7 text-white/75 md:text-base">
            Reading ini mengajakmu melihat hubungan antara akar energi,
            pesan yang sedang datang, dan langkah jiwa yang paling selaras.
            Jangan terburu-buru memaksa jawaban. Dengarkan pola yang muncul,
            karena sering kali oracle berbicara lewat rasa yang paling tenang.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/oracle"
              className="rounded-full bg-yellow-400 px-7 py-3 font-bold text-black shadow-[0_0_35px_rgba(250,204,21,0.45)] transition hover:bg-yellow-300"
            >
              Ulangi Reading
            </a>

            <a
              href="/"
              className="rounded-full border border-white/20 bg-white/10 px-7 py-3 font-semibold text-white transition hover:bg-white/15"
            >
              Kembali ke Home
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}