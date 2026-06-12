"use client";


"use client";

//import { useEffect, useMemo, useState } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { goddessDeck, type GoddessCard } from "./goddessDeck";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const shuffleCards = (cards: GoddessCard[]) => {
  return [...cards].sort(() => Math.random() - 0.5);
};

export default function OraclePage() {
  const [deck, setDeck] = useState<GoddessCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<GoddessCard[]>([]);
  const [question, setQuestion] = useState("");

  const [reading, setReading] = useState("");
  const [showReading, setShowReading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [oracleChart, setOracleChart] = useState<
    { name: string; value: number }[]
  >([]);

  const oracleResultRef = useRef<HTMLDivElement>(null);
  const maxCards = 3;

  useEffect(() => {
    setDeck(shuffleCards(goddessDeck));
  }, []);

  
  const selectedIds = useMemo(
    () => selectedCards.map((card) => card.id),
    [selectedCards]
  );

 const shuffleDeck = () => {
  setDeck(shuffleCards(goddessDeck));
  setSelectedCards([]);
  setShowReading(false);
};

  const handleSelectCard = (card: GoddessCard) => {
    const alreadySelected = selectedCards.some(
      (selected) => selected.id === card.id
    );

    if (alreadySelected) {
  setShowReading(false);
  setSelectedCards((prev) =>
    prev.filter((selected) => selected.id !== card.id)
  );
  return;
}

    if (selectedCards.length >= maxCards) {
      return;
    }

    setShowReading(false);
     setSelectedCards((prev) => [...prev, card]);
  };

  const resetSelection = () => {
  setSelectedCards([]);
  setShowReading(false);
  setReading("");
  setOracleChart([]);
};

const startReading = async () => {
  if (selectedCards.length < maxCards) {
    return;
  }

  if (!question.trim()) {
    return;
  }

  setIsProcessing(true);
  setShowReading(false);
  setReading("");
  setOracleChart([]);

  try {
    const response = await fetch("/api/oracle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        cards: selectedCards,
      }),
    });

    const data = await response.json();

    console.log("ORACLE API RESULT:", data);

    setReading(data.reading || "");
    setOracleChart(data.chartData || []);
    setShowReading(true);
  } catch (error) {
    console.error("ORACLE API ERROR:", error);
  } finally {
    setIsProcessing(false);
  }
};

const handlePrintOracle = () => {
  if (!oracleResultRef.current) {
    return;
  }

  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=700"
  );

  if (!printWindow) {
    alert(
      "Popup diblokir browser. Izinkan popup untuk mencetak hasil."
    );
    return;
  }

  const resultContent = oracleResultRef.current.innerHTML;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <title>Hasil Oracle Reading</title>

        <style>
          body {
            margin: 0;
            padding: 40px;
            background: #ffffff;
            color: #111827;
            font-family: Arial, Helvetica, sans-serif;
          }

          h2,
          h3 {
            color: #92400e;
          }

          p {
            line-height: 1.8;
          }

          button {
            display: none !important;
          }

          svg {
            max-width: 100%;
          }

          @page {
            size: A4;
            margin: 18mm;
          }
        </style>
      </head>

      <body>
        ${resultContent}
      </body>
    </html>
  `);

  printWindow.document.close();

  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 700);
};
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#14532d_0%,#020617_45%,#000_100%)] text-white">
    {isProcessing && (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[radial-gradient(circle,#0b1f16_0%,#07110d_55%,#020617_100%)] shadow-[0_0_40px_rgba(250,204,21,0.18)]">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-yellow-400/20 border-r-yellow-200 border-t-yellow-300" />

            <div className="absolute inset-2 rounded-full border border-yellow-300/30 shadow-[0_0_25px_rgba(250,204,21,0.25)]" />

            <span className="text-[11px] font-semibold tracking-[0.35em] text-yellow-200">
              ORACLE
            </span>
          </div>

          <p className="mt-5 text-sm tracking-[0.28em] text-yellow-200/85">
            READING ENERGY
          </p>
        </div>
      </div>
    )}

    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        {/* HEADER */}
        <div className="text-center">
          <p className="text-sm tracking-[0.35em] text-yellow-300">
            THE ORACLE
          </p>

          <h1 className="mt-4 text-4xl font-bold text-yellow-200 md:text-6xl">
            Goddess Oracle Deck
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            Pilih sampai 3 kartu goddess untuk membaca energi, pesan batin,
            dan arah spiritual yang sedang muncul dalam hidupmu.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={shuffleDeck}
            className="cursor-pointer rounded-full bg-yellow-400 px-6 py-3 font-bold text-black shadow-[0_0_35px_rgba(250,204,21,0.45),inset_0_-4px_0_rgba(0,0,0,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-[0_0_45px_rgba(250,204,21,0.65),inset_0_-4px_0_rgba(0,0,0,0.22)] active:translate-y-1 active:scale-95 active:shadow-[0_0_18px_rgba(250,204,21,0.35),inset_0_3px_8px_rgba(0,0,0,0.35)]"
          >
            Shuffle Deck
          </button>

          <button
            type="button"
            onClick={resetSelection}
            className="cursor-pointer rounded-full border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white shadow-[inset_0_-3px_0_rgba(255,255,255,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-yellow-300/35 hover:bg-white/15 hover:shadow-[0_0_25px_rgba(250,204,21,0.18),inset_0_-3px_0_rgba(255,255,255,0.08)] active:translate-y-1 active:scale-95 active:bg-white/5 active:shadow-[inset_0_3px_8px_rgba(0,0,0,0.4)]"
          >
            Reset Pilihan
          </button>
        </div>

        {isProcessing && (
  <div className="mt-6 rounded-2xl border border-yellow-400/30 bg-black/30 p-5 text-center text-yellow-200">
    Membuka pesan oracle...
  </div>
)}

{showReading && reading && (
  <div
    ref={oracleResultRef}
    className="mt-8 rounded-3xl border border-yellow-400/40 bg-black/40 p-6 text-white shadow-[0_0_45px_rgba(250,204,21,0.18)]"
  >
    
    <h2 className="mb-4 text-2xl font-bold text-yellow-300">
      Hasil Oracle Reading
    </h2>

    {oracleChart.length > 0 && (
      <div className="mb-8 rounded-3xl border border-yellow-400/30 bg-black/35 p-5">
        <h3 className="mb-2 text-xl font-bold text-yellow-300">
          Peta Energi Oracle
        </h3>

        <p className="mb-5 text-sm leading-6 text-white/65">
          Grafik ini membaca kecenderungan energi dari kartu yang terpilih,
          bukan prediksi mutlak. Gunakan sebagai kompas refleksi dan arah tindakan.
        </p>

       <div className="mt-6 h-[420px] w-full overflow-visible">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      data={oracleChart}
      layout="vertical"
      margin={{
        top: 10,
        right: 16,
        left: 0,
        bottom: 10,
      }}
      barCategoryGap={22}
    >
      <XAxis
        type="number"
        domain={[0, 100]}
        hide
      />

      <YAxis
        type="category"
        dataKey="name"
        width={115}
        tick={{
          fill: "#fef3c7",
          fontSize: 10,
        }}
        tickLine={false}
        axisLine={false}
      />

      <Tooltip
        allowEscapeViewBox={{
          x: true,
          y: true,
        }}
        cursor={{ fill: "rgba(250,204,21,0.08)" }}
        formatter={(value) => [`${value}%`, "Energi"]}
        contentStyle={{
          backgroundColor: "#111827",
          border: "1px solid rgba(250,204,21,0.4)",
          borderRadius: "14px",
          color: "#fff",
          fontSize: "12px",
          padding: "10px 12px",
        }}
        wrapperStyle={{
          zIndex: 50,
        }}
      />

      <Bar
        dataKey="value"
        radius={[0, 12, 12, 0]}
        fill="#facc15"
        barSize={18}
      />
    </BarChart>
  </ResponsiveContainer>
</div>
      </div>
    )}

   <p className="whitespace-pre-line leading-8 text-white/85">
  {reading}
</p>

{/* TOMBOL PRINT */}
<div className="mt-8 border-t border-yellow-400/20 pt-6">
  <button
    type="button"
    onClick={handlePrintOracle}
    className="w-full rounded-2xl border border-yellow-400/60 bg-yellow-500 px-6 py-4 text-base font-bold text-black shadow-[0_0_35px_rgba(250,204,21,0.3)] transition-all duration-200 hover:bg-yellow-300 active:scale-[0.97]"
  >
    PRINT / SIMPAN PDF
  </button>
</div>
</div>

)}

        {/* QUESTION BOX */}
<div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-yellow-400/20 bg-black/30 p-5 shadow-[0_0_40px_rgba(250,204,21,0.12)] md:p-7">
  <label className="block text-sm font-semibold text-yellow-200">
    Tulis pertanyaanmu
  </label>

  <textarea
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    placeholder="Contoh: Apa pesan dewi untuk energi cintaku saat ini?"
    className="mt-3 min-h-[130px] w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-yellow-300/60 focus:shadow-[0_0_25px_rgba(250,204,21,0.18)]"
  />

  </div>

        {/* SELECTED INFO */}
        <div className="mt-6 text-center text-sm text-white/70">
          Kartu dipilih:{" "}
          <span className="font-bold text-yellow-300">
            {selectedCards.length}/{maxCards}
          </span>
        </div>

        {/* SELECTED RESULT */}
        {showReading && selectedCards.length > 0 && (
          <section className="mt-10 rounded-3xl border border-yellow-400/30 bg-black/35 p-5 shadow-[0_0_45px_rgba(250,204,21,0.12)] md:p-8">
            <h2 className="text-center text-2xl font-bold text-yellow-200 md:text-3xl">
              Reading Energi Oracle
            </h2>
            {question.trim() !== "" && (
           <p className="mx-auto mt-4 max-w-2xl text-center text-sm italic leading-6 text-white/65">
              “{question}”
           </p>
            )}
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {selectedCards.map((card, index) => (
                <article
                  key={card.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.06] p-4"
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

                  <div className="mt-4">
                    <p className="text-xs font-semibold tracking-[0.25em] text-yellow-300">
                       {index === 0
                        ? "CARD 1 • ENERGI AKAR"
                        : index === 1
                          ? "CARD 2 • PESAN UTAMA"
                          : "CARD 3 • ARAHAN JIWA"}
                     </p>
                    <h3 className="mt-2 text-2xl font-bold text-white">
                      {card.name}
                    </h3>

                    <p className="text-sm italic text-yellow-200">
                      {card.title}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {card.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs text-yellow-100"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>

                    <p className="mt-4 text-sm leading-6 text-white/75">
                      {card.energy}
                    </p>
                    <p className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4 text-sm leading-6 text-yellow-50/85">
                   {index === 0 &&
                    "Kartu ini menunjukkan akar energi yang sedang memengaruhi pertanyaanmu. Perhatikan pola batin, luka lama, atau dorongan terdalam yang menjadi sumber situasi ini."}

                    {index === 1 &&
                     "Kartu ini membawa pesan utama dari energi dewi. Inilah inti bimbingan yang perlu kamu dengar sekarang, terutama tentang apa yang perlu disadari, diterima, atau dilepaskan."}

                    {index === 2 &&
                     "Kartu ini menjadi arahan jiwa. Ia menunjukkan langkah lembut yang bisa kamu ambil agar energimu kembali selaras dan tidak bergerak dari rasa takut."}
                    </p>

                  </div>
                </article>
              ))}
            </div>
          </section>

    )}    

      

        {/* DECK GRID */}
        <section className="mt-12">
          <h2 className="text-center text-2xl font-bold text-yellow-200 md:text-3xl">
            Pilih Kartu Oracle
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {deck.map((card) => {
              const isSelected = selectedIds.includes(card.id);
              const isDisabled =
                selectedCards.length >= maxCards && !isSelected;

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSelectCard(card)}
                  disabled={isDisabled}
                  className={`group text-left transition ${
                    isDisabled ? "cursor-not-allowed opacity-40" : ""
                  }`}
                >
                  <div
                    className={`relative aspect-[3/4] overflow-hidden rounded-2xl border transition duration-300 ${
                      isSelected
                        ? "border-yellow-300 shadow-[0_0_35px_rgba(250,204,21,0.55)] scale-[1.03]"
                        : "border-white/15 shadow-[0_0_20px_rgba(255,255,255,0.05)] group-hover:border-yellow-300/70 group-hover:shadow-[0_0_25px_rgba(250,204,21,0.25)]"
                    }`}
                  >
                   
                   {isSelected ? (
  <Image
    src={card.image}
    alt={`${card.name} — ${card.title}`}
    fill
    className="object-cover transition duration-500 group-hover:scale-105"
    sizes="(max-width: 768px) 50vw, 16vw"
  />
) : (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,#14532d_0%,#020617_55%,#000_100%)] p-4">
    <div className="absolute inset-3 rounded-xl border border-yellow-400/35" />
    <div className="absolute inset-6 rounded-xl border border-yellow-300/15" />

    <p className="text-[10px] tracking-[0.35em] text-yellow-300/80">
      THE
    </p>

    <p className="mt-1 text-2xl font-bold tracking-[0.2em] text-yellow-200">
      ORACLE
    </p>

    <div className="my-4 h-px w-16 bg-yellow-300/40" />

    <p className="text-center text-[10px] tracking-[0.25em] text-white/45">
      GODDESS DECK
    </p>

    <div className="mt-5 text-3xl text-yellow-300/70">
      ✦
    </div>
  </div>
)}

                    {isSelected && (
                      <div className="absolute inset-0 bg-yellow-400/10 ring-2 ring-inset ring-yellow-300" />
                    )}
                  </div>

                     <div className="mt-3 text-center">
  {isSelected ? (
    <>
      <p className="text-sm font-bold text-white">
        {card.name}
      </p>
      <p className="text-xs text-yellow-200/80">
        {card.title}
      </p>
    </>
  ) : (
    <p className="text-sm font-bold text-white/50">
      Pilih Kartu
    </p>
  )}
</div>
                </button>
              );
            })}
          </div>
        </section>

{/* SELECTED CARDS SUMMARY */}
{selectedCards.length > 0 && (
  <section className="mx-auto mt-10 max-w-4xl rounded-3xl border border-yellow-400/30 bg-black/35 p-5 shadow-[0_0_45px_rgba(250,204,21,0.12)]">
    <div className="text-center">
      <p className="text-xs font-semibold tracking-[0.3em] text-yellow-300/80">
        KARTU PILIHAN
      </p>

      <h2 className="mt-2 text-2xl font-bold text-yellow-200">
        {selectedCards.length}/{maxCards}
      </h2>
    </div>

    <div className="mt-5 grid grid-cols-3 gap-3">
      {[0, 1, 2].map((slot) => {
        const card = selectedCards[slot];

        return (
          <div
            key={slot}
            className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-center"
          >
            <p className="text-[10px] font-semibold tracking-[0.25em] text-yellow-300/70">
              CARD {slot + 1}
            </p>

            {card ? (
              <>
                <h3 className="mt-2 text-base font-bold text-white md:text-lg">
                  {card.name}
                </h3>

                <p className="mt-1 text-xs italic text-yellow-200/80">
                  {card.title}
                </p>
              </>
            ) : (
              <>
                <h3 className="mt-2 text-base font-bold text-white/35 md:text-lg">
                  Belum Dipilih
                </h3>

                <p className="mt-1 text-xs italic text-white/25">
                  —
                </p>
              </>
            )}
          </div>
        );
      })}
    </div>

    {selectedCards.length === maxCards && (
  <button
    type="button"
    onClick={startReading}
    disabled={isProcessing}
    className={`mt-6 w-full rounded-2xl px-6 py-4 font-bold text-black shadow-[0_0_35px_rgba(250,204,21,0.45)] transition active:scale-95
      ${
        isProcessing
          ? "cursor-not-allowed bg-yellow-200 opacity-70"
          : "bg-yellow-400 hover:bg-yellow-300"
      }
    `}
  >
    {isProcessing ? "MEMBUKA PESAN ORACLE..." : "MULAI ORACLE READING"}
  </button>
)}
  </section>
)}
      </section>

  

    </main>

    
  );

  
}
