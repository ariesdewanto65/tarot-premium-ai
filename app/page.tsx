    


 

"use client";


import { useState, useEffect } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
   Legend,
  ResponsiveContainer,
} from "recharts";

export default function Home() {

  
  const downloadPDF = () => {
    window.print();
    
  };

 // ==================================================
  // FITUR: State premium user
  // FUNGSI:
  // Menentukan apakah fitur premium sudah aktif atau belum.
  // Nilai true hanya diberikan setelah pembayaran sukses.
  // ==================================================

  const [isPremium, setIsPremium] =
  useState(false);
// ==================================================
  // FITUR: Pesan status pembayaran
  // FUNGSI:
  // Mengganti alert bawaan browser seperti "localhost:3000".
  // Pesan payment gagal/sukses akan tampil rapi di halaman.
  // ==================================================
  const [paymentMessage, setPaymentMessage] =
  useState("");

// ==================================================
// FITUR: Premium auto-check database saat halaman dibuka
// STATUS: OFF SEMENTARA UNTUK DEMO
// ALASAN:
// Saat halaman pertama dibuka, tombol langsung Premium Aktif
// karena user test di database sudah isPremium true.
// Untuk demo, premium harus false dulu dan baru aktif setelah bayar.
// =====

/*  useEffect(() => {
  const checkPremiumFromDatabase = async () => {
    try {
      const response = await fetch("/api/tarot/check-premium", {
        method: "GET",
      });

      const data = await response.json();

      console.log("CHECK PREMIUM DATABASE:", data);

      if (data?.isPremium === true) {
        console.log("PREMIUM AKTIF DARI DATABASE");

        setIsPremium(true);
        localStorage.setItem("premium", "true");

        return;
      }

      console.log("PREMIUM BELUM AKTIF DI DATABASE");

      setIsPremium(false);
      localStorage.removeItem("premium");
    } catch (error) {
      console.log("CHECK PREMIUM DATABASE ERROR:", error);

      const premium = localStorage.getItem("premium");

      if (premium === "true") {
        setIsPremium(true);
      }
    }
  };

  checkPremiumFromDatabase();
}, []);
  
*/

// ==================================================
// FITUR: Premium demo mode
// STATUS: AKTIF
// FUNGSI:
// Saat halaman pertama dibuka, premium selalu false.
// Premium baru aktif setelah pembayaran sukses.
// ==================================================

useEffect(() => {
  setIsPremium(false);
  localStorage.removeItem("premium");
}, []);


  /* MAJOR ARCANA */
  const majorArcana = [
    "The Fool",
    "The Magician",
    "The High Priestess",
    "The Empress",
    "The Emperor",
    "The Hierophant",
    "The Lovers",
    "The Chariot",
    "Strength",
    "The Hermit",
  ];

  /* MINOR ARCANA */
  const minorArcana = [
    "Ace of Cups",
    "Two of Cups",
    "Three of Cups",
    "Four of Cups",
    "Five of Wands",
    "Six of Swords",
    "Seven of Pentacles",
    "Eight of Wands",
    "Nine of Swords",
    "Ten of Pentacles",
    "Ace of Pentacles",
    "Two of Swords",
    "Knight of Cups",
    "Queen of Wands",
    "King of Pentacles",
  ];

  const [question, setQuestion] =
  useState<string>("");

  const [preview, setPreview] =
    useState<string | null>(null);
    const [imageBase64, setImageBase64] =

  useState<string | null>(null);
     const [language, setLanguage] =
     useState<"id" | "en">("id");

  const [loading, setLoading] =
    useState(false);

  const [showCards, setShowCards] =
    useState(false);

  const [showResult, setShowResult] =
    useState(false);

  const [reading, setReading] =
    useState("false");
   
   const safeReading =
  reading || "";

const sedih =
  ((safeReading.match(
    /sedih|lelah|kesepian|kehilangan|hampa|luka|terluka|kecewa|sad|sadness|tired|lonely|loss|empty|hurt|pain|wounded|grief|heartbroken|heavy/gi
  ) || []).length) + 1;

const overthinking =
  ((safeReading.match(
    /cemas|takut|overthinking|khawatir|pikiran|gelisah|anxious|anxiety|fear|afraid|worry|worried|restless|thinking too much|mental noise/gi
  ) || []).length) + 1;

const bingung =
  ((safeReading.match(
    /bingung|ragu|bimbang|tidak yakin|tidak jelas|kabur|confused|confusion|doubt|uncertain|unsure|unclear|lost|hesitant/gi
  ) || []).length) + 1;

const harapan =
  ((safeReading.match(
    /peluang|awal baru|bangkit|tenang|berkembang|pulih|sembuh|harapan|hope|hopeful|opportunity|new beginning|rise again|calm|grow|growth|healing|recover|renewal|progress|light|better/gi
  ) || []).length) + 1;

const total =
  sedih +
  overthinking +
  bingung +
  harapan || 1;

const emotionData = [
  {
    name: language === "id" ? "Sedih" : "Sad",
    value: Math.round((sedih / total) * 100),
  },
  {
    name: "Overthinking",
    value: Math.round((overthinking / total) * 100),
  },
  {
    name: language === "id" ? "Bingung" : "Confused",
    value: Math.round((bingung / total) * 100),
  },
  {
    name: language === "id" ? "Harapan" : "Hope",
    value: Math.round((harapan / total) * 100),
  },
];


  const [shuffledDeck, setShuffledDeck] =
    useState<string[]>([]);

  const [selectedCards, setSelectedCards] =
    useState<string[]>([]);


  const [replaceIndex, setReplaceIndex] =
    useState(0);
  const getCardImage = (
  card: string
) => {

  return `/tarot/${card
    .toLowerCase()
    .replace(/\s+/g, "-")}.jpg`;

}; 
  /* SHUFFLE DECK */
  const shuffleDeck = () => {

    const deck: string[] = [];

    let majorCount = 0;

    const usedCards =
      new Set<string>();

    while (deck.length < 9) {

      const allowMajor =
        majorCount < 1;

      const isMajor =
        allowMajor &&
        Math.random() < 0.35;

      let randomCard = "";

      if (isMajor) {

        randomCard =
          majorArcana[
            Math.floor(
              Math.random() *
                majorArcana.length
            )
          ];

      } else {

        randomCard =
          minorArcana[
            Math.floor(
              Math.random() *
                minorArcana.length
            )
          ];

      }

      if (
        !usedCards.has(randomCard)
      ) {

        usedCards.add(randomCard);

        deck.push(randomCard);

        if (
          majorArcana.includes(
            randomCard
          )
        ) {

          majorCount++;

        }

      }

    }

    deck.sort(
      () => Math.random() - 0.5
    );

    setShuffledDeck(deck);

  };

  /* START READING */
  const handleReading = () => {

    setLoading(true);

    setTimeout(() => {

      shuffleDeck();

      setLoading(false);

      setShowCards(true);

    }, 2500);

  };

  /* REVEAL RESULT */
  const handleReveal = async () => {

    setLoading(true);

    try {

      const response =
        await fetch(
          "/api/tarot",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
             question,
              cards:
                selectedCards,
              language,
            image: imageBase64,
            }),

          }
        );

     const data =
  await response.json();

console.log("TAROT API RESPONSE:", data);

const finalReading =
  data?.result ||
  data?.reading ||
  data?.message ||
  "";

console.log("FINAL READING:", finalReading);

if (!finalReading) {
  setReading(
    "Maaf, hasil pembacaan belum berhasil dibuat. Silakan coba ulangi pembacaan."
  );
} else {
  setReading(finalReading);
}

setLoading(false);

setShowResult(true);

    } catch (error) {

      console.log(error);

      setLoading(false);

    }

  };

  /* IMAGE */
  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      e.target.files?.[0];

    if (!file) return;

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {

      alert(
        language === "id"
          ? "Ukuran foto maksimal 5 MB"
          : "Maximum photo size is 5 MB"
      );

      return;

    }

    const imageUrl =
      URL.createObjectURL(file);

    setPreview(imageUrl);
    const reader =
  new FileReader();

reader.onloadend = () => {

  setImageBase64(
    reader.result as string
  );

};

reader.readAsDataURL(file);
  };

  /* CARD SELECT */
  const handleCardSelect = (
    card: string
  ) => {

    if (
      selectedCards.includes(card)
    ) return;

    if (
      selectedCards.length < 3
    ) {

      setSelectedCards([
        ...selectedCards,
        card,
      ]);

    } else {

      const updated =
        [...selectedCards];

      updated[replaceIndex] =
        card;

      setSelectedCards(updated);

      setReplaceIndex(
        (replaceIndex + 1) % 3
      );

    }

  };

  /* RESET */
  const handleReset = () => {

    setQuestion("");

    setPreview(null);

    setReading("");

    setSelectedCards([]);

    setShowCards(false);

    setShowResult(false);

    setReplaceIndex(0);

  };


  
const handlePayment = async () => {
  console.log("STEP 1");

  try {
    const response = await fetch("/api/tarot/create-transaction", {
      method: "POST",
    });

    const text = await response.text();

    console.log("CREATE TRANSACTION STATUS:", response.status);
    console.log("CREATE TRANSACTION RAW RESPONSE:", text);

    if (!response.ok) {
      alert("Create transaction gagal. Status: " + response.status);
      return;
    }

    if (!text) {
      alert("Response create transaction kosong");
      return;
    }

    const data = JSON.parse(text);

    console.log("TOKEN:", data);

    if (!data.orderId) {
      console.log("ORDER ID TIDAK ADA DARI CREATE TRANSACTION:", data);
      alert("Order ID tidak dibuat");
      return;
    }

    if (!data.token) {
      console.log("TOKEN TIDAK ADA DARI CREATE TRANSACTION:", data);
      alert("Token Midtrans tidak dibuat");
      return;
    }

    localStorage.removeItem("orderId");
    localStorage.setItem("orderId", data.orderId);

    console.log("ORDER ID DISIMPAN:", data.orderId);

    // @ts-ignore
    console.log("SNAP EXISTS:", window.snap);

    // @ts-ignore
    if (!window.snap) {
      alert("Snap Midtrans belum tersedia");
      return;
    }

    // @ts-ignore
    window.snap.pay(data.token, {
      onSuccess: async function (result: any) {
       console.log("STEP 5 SUCCESS", result);

       const savedOrderId = localStorage.getItem("orderId");

      if (!savedOrderId) {
        alert("Order ID tidak ditemukan untuk aktivasi premium.");
        return;
       }

        const activateResponse = await fetch("/api/tarot/activate-premium", {
           method: "POST",
            headers: {
             "Content-Type": "application/json",
             },
             body: JSON.stringify({
              orderId: savedOrderId,
            }),
         });

  const activateData = await activateResponse.json();

  console.log("ACTIVATE PREMIUM:", activateData);

   if (!activateData.success) {
    alert("Payment sukses, tapi aktivasi database gagal.");
    return;
   }

     localStorage.setItem("premium", "true");

       alert("Premium berhasil diaktifkan!");

       location.reload();
    },

      onPending: function (result: any) {
        console.log("PENDING", result);
      },

      onError: function (result: any) {
        console.log("ERROR", result);
      },

      onClose: function () {
        console.log("Popup ditutup");
      },
    });
  } catch (error) {
    console.log("HANDLE PAYMENT ERROR:", error);

    // ==================================================
// FITUR: Alert bawaan browser untuk payment gagal
// STATUS: OFF UNTUK DEMO
// ALASAN:
// Alert bawaan browser menampilkan localhost:3000,
// kurang rapi untuk demo user.
// ==================================================

   // alert("Payment gagal");

   // alert("Payment berhasil");

  setPaymentMessage(
  "Pembayaran berhasil. Premium kamu sudah aktif."
   );
   
   setPaymentMessage(
  "Pembayaran belum berhasil. Silakan coba lagi atau lanjutkan pembayaran."
);
  }
};

const checkPayment = async (manualOrderId?: string) => {
  const orderId = manualOrderId || localStorage.getItem("orderId");

  if (!orderId) {
    alert("Order ID tidak ditemukan");
    return null;
  }

  try {
    const response = await fetch("/api/tarot/check-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
      }),
    });

    const data = await response.json();

    console.log("CHECK PAYMENT:", data);

    const status =
      data?.transaction_status ||
      data?.raw?.transaction_status;

    console.log("STATUS FINAL:", status);

    if (status === "settlement" || status === "capture") {
      localStorage.setItem("premium", "true");
      alert("Premium Aktif!");
      location.reload();
      return data;
    }

    alert("Status: " + status);
    return data;
  } catch (error) {
    console.error("CHECK PAYMENT ERROR:", error);
    alert("Gagal cek status pembayaran");
    return null;
  }
};


return (

    
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-green-950 via-green-900 to-black flex items-center justify-center px-4 py-10 text-yellow-300">

{!loading && (
  <a
    href="/premium"
    className="fixed right-6 top-6 z-[9999] rounded-2xl border border-yellow-400 bg-black/80 px-5 py-3 text-sm font-bold text-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.35)] hover:bg-yellow-400/10"
  >
     Upgrade Premium
  </a>
)}
     {/* LOADING */}
{loading && (

  <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center text-center px-6">

    <div className="relative flex items-center justify-center mb-8">

      <div className="w-24 h-24 border-4 border-yellow-500/20 border-t-yellow-300 rounded-full animate-spin"></div>

      <div className="absolute text-yellow-200 text-sm tracking-[4px]">
        TAROT
      </div>

    </div>

    <h2 className="text-2xl text-yellow-200 mb-3 tracking-wide">

      {language === "id"
        ? "Membaca Energi Kamu..."
        : "Reading Your Energy..."}

    </h2>

  </div>

)}

      {/* RESULT */}
      {showResult ? (

        <div className="relative z-10 w-full max-w-4xl rounded-[32px] border border-yellow-500/20 bg-white/5 backdrop-blur-md p-6 md:p-10">

          <h1 className="text-4xl md:text-6xl text-center font-bold text-yellow-300 mb-6">

            {language === "id"
              ? "Hasil Pembacaan"
              : "Reading Result"}

          </h1>

          {/* RESULT CARDS */}
          <div className="grid grid-cols-3 gap-4 mb-8">

            {selectedCards.map(
              (card, i) => (

                <div
                  key={i}
                  className="h-32 md:h-44 rounded-3xl border border-yellow-500/20 bg-black/40 flex items-center justify-center text-center p-4 text-yellow-300 text-xl font-bold"
                >

                  {card}

                </div>

              )
            )}

          </div>

          {/* READING */}
          <div className="rounded-3xl border border-yellow-500/20 bg-black/40 p-6 text-yellow-100/80 leading-relaxed whitespace-pre-line text-sm md:text-lg">

            {reading}

          </div>
{/* EMOTION CHART */}
<div className="mt-10 rounded-3xl border border-yellow-500/20 bg-black/40 p-6">

  {reading && (
  <section className="mb-8 rounded-[2rem] border border-yellow-500/30 bg-black/35 p-6 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
    
<h2 className="mb-6 text-center text-3xl font-bold text-yellow-300">
  {language === "id" ? "Analisis Emosi" : "Emotional Analysis"}
</h2>

    <div className="w-full min-w-0">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={emotionData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={85}
            label
          >
            {emotionData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={[
                  "#facc15",
                  "#fb7185",
                  "#60a5fa",
                  "#4ade80",
                ][index % 4]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </section>
)}
    
 {!isPremium ? (

  <div className="relative z-[9999] pointer-events-auto flex flex-col items-center gap-3 mt-10">

    <button
      type="button"
      disabled
      className="bg-yellow-500/40 text-black/50 px-6 py-4 rounded-xl font-bold cursor-not-allowed"
    >
      🔒 Premium Terkunci
    </button>

    <button
      type="button"
      onClick={handlePayment}
      className="relative z-[9999] pointer-events-auto underline text-yellow-300 hover:text-yellow-100 font-bold"
    >
      Lanjutkan
    </button>

   <button
  type="button"
  onClick={() => checkPayment()}
  className="relative z-[9999] pointer-events-auto underline text-green-300"
>
  Cek Pembayaran
</button>

  </div>

) : (

  <div className="flex justify-center mt-10">
   
    <button
      type="button"
      className="bg-green-500 text-black px-6 py-4 rounded-xl font-bold"
    >
      ✅ Premium Aktif
    </button>

  </div>

)}

  {/* LEGEND */}
 {/*} <div className="mt-8 flex flex-col gap-3 text-sm text-yellow-100 ml-6">

    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
      <span>Sedih</span>
    </div>

    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full bg-pink-400"></div>
      <span>Overthinking</span>
    </div>

    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full bg-blue-400"></div>
      <span>Bingung</span>
    </div>

    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full bg-green-400"></div>
      <span>Harapan</span>
    </div>taskkill /F /IM node.exe

  </div>  */}

</div> 

          {/* MENU */}
           
     <div className="mt-8 text-center flex items-center justify-center gap-6">

        <button
         onClick={handleReset}
          className="underline text-yellow-300 hover:text-yellow-100 transition"
        >
         {language === "id"
           ? "Menu Utama"
            : "Main Menu"}
         </button>

  <button
    onClick={downloadPDF}
    className="underline text-yellow-300 hover:text-yellow-100 transition"
  >
    {language === "id"
      ? "Unduh"
      : "Download"}
  </button>

</div>

        </div>

      ) : showCards ? (

        /* CARD PAGE */
        <div className="relative z-10 flex flex-col items-center">

          <h1 className="text-4xl md:text-6xl font-bold text-yellow-300 mb-4 text-center">

            {language === "id"
              ? "Pilih Kartu Kamu"
              : "Choose Your Cards"}

          </h1>

          <p className="text-yellow-100/60 mb-10 text-center">

            {language === "id"
              ? "Pilih kartu yang paling terhubung dengan energi kamu"
              : "Choose cards that resonate with your energy"}

          </p>

          {/* CARDS */}
          <div className="grid grid-cols-3 gap-4 max-w-xl">

            {shuffledDeck.map(
              (card, i) => {

                const active =
                  selectedCards.includes(card);

                return (

                  <button
                    key={i}
                    onClick={() =>
                      handleCardSelect(card)
                    }
                    className={`group relative overflow-hidden h-36 md:h-52 rounded-[28px] border transition-all duration-500 cursor-pointer backdrop-blur-md hover:scale-105 active:scale-95 ${
                      active
                        ? "border-yellow-300 bg-gradient-to-b from-yellow-500/20 via-yellow-400/10 to-black shadow-[0_0_50px_rgba(255,215,0,0.45)]"
                        : "border-yellow-500/20 bg-black/50 hover:border-yellow-400/40 shadow-[0_0_40px_rgba(255,215,0,0.08)]"
                    }`}
                  >

                    {/* MAGIC GLOW */}
                    <div className="absolute inset-0 opacity-30">

                      <div className="absolute w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl -top-10 -left-10 animate-pulse" />

                      <div className="absolute w-32 h-32 bg-green-400/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse" />

                    </div>

                   {/* CONTENT */}
<div className="relative z-10 flex flex-col items-center justify-center h-full p-4">

  {active ? (

    <img
      src={getCardImage(card)}
      alt={card}
      className="w-full h-full object-contain rounded-[28px] bg-black"
    />

  ) : (

    <>
      <div className="text-yellow-500/30 text-6xl md:text-7xl mb-4 group-hover:scale-110 transition-all duration-500">

        ✦

      </div>

      <div className="text-yellow-300 text-sm md:text-lg font-bold tracking-[6px] text-center">

        THE
        <br />
        CHARIOT

      </div>

      <div className="mt-4 text-yellow-100/30 text-[10px] tracking-[4px] uppercase">

        Tap To Reveal

      </div>
    </>

  )}

</div>
                  </button>

                );

              }
            )}

          </div>
           {/* ULANG BUTTON */}
<div className="mb-6 text-center">

  <button
    onClick={() => {

      setSelectedCards([]);

      setReplaceIndex(0);

      shuffleDeck();

    }}
    className="underline text-yellow-300 hover:text-yellow-100 transition-all duration-300"
  >

    {language === "id"
      ? "Ulang"
      : "Shuffle Again"}

  </button>

</div>
          {/* SELECTED */}
          <div className="mt-10 w-full max-w-xl">

            <h2 className="text-yellow-200 text-xl mb-4 text-center">

              {language === "id"
                ? "Kartu Terpilih"
                : "Selected Cards"}

            </h2>

            <div className="grid grid-cols-3 gap-4">

              {[0,1,2].map(
                (slot) => (

                  <div
                    key={slot}
                    className="h-24 rounded-2xl border border-yellow-500/20 bg-black/40 flex items-center justify-center text-center p-2 text-sm font-bold text-yellow-300"
                  >

                    {selectedCards[
                      slot
                    ] || "?"}

                  </div>

                )
              )}

            </div>

            {/* BUTTON */}
            {selectedCards.length ===
              3 && (

              <button
                onClick={
                  handleReveal
                }
                className="mt-8 w-full bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 text-black py-4 rounded-2xl text-lg md:text-xl font-bold shadow-[0_0_45px_rgba(255,215,0,0.7)]"
              >

                {language === "id"
                  ? "LIHAT HASIL"
                  : "REVEAL READING"}

              </button>

            )}

          </div>

        </div>

      ) : (

        /* MAIN */
        <div className="relative z-10 w-full max-w-md md:max-w-2xl rounded-[32px] border border-yellow-500/20 bg-white/5 backdrop-blur-md p-5 md:p-10">

          {/* LOGO */}
          <div className="flex flex-col items-center text-center mb-8">

            <h1 className="text-3xl md:text-6xl font-extrabold tracking-[4px] md:tracking-[8px] text-yellow-300">

              THE CHARIOT

            </h1>
          </div>
      {/*      
        <div className="mt-5 text-center">
          <a
                   href="/premium"
                 className="inline-block rounded-2xl border border-yellow-400 px-6 py-3 font-bold text-yellow-300 hover:bg-yellow-400/10"
                       >
                Buka Premium
                  </a>
            </div>
        */}

{/* LANGUAGE SELECTOR */}

<div className="mb-6">
  
<div className="mb-6">
  <label className="block text-sm md:text-base text-yellow-300 mb-3 font-semibold">
    Pilih Bahasa
  </label>

  <div className="flex gap-3 flex-wrap">
    <button
      type="button"
      onClick={() => setLanguage("id")}
      className={`px-4 py-3 rounded-xl border-2 text-base md:text-lg font-bold transition-all duration-300 ${
        language === "id"
          ? "border-yellow-400 bg-yellow-500 text-black shadow-[0_0_22px_rgba(255,215,0,0.55)] scale-105"
          : "border-yellow-700 bg-[#021f12] text-yellow-400 hover:border-yellow-400 hover:shadow-[0_0_16px_rgba(255,215,0,0.3)]"
      }`}
    >
      🇮🇩 INA
    </button>

    <button
      type="button"
      onClick={() => setLanguage("en")}
      className={`px-4 py-3 rounded-xl border-2 text-base md:text-lg font-bold transition-all duration-300 ${
        language === "en"
          ? "border-yellow-400 bg-yellow-500 text-black shadow-[0_0_22px_rgba(255,215,0,0.55)] scale-105"
          : "border-yellow-700 bg-[#021f12] text-yellow-400 hover:border-yellow-400 hover:shadow-[0_0_16px_rgba(255,215,0,0.3)]"
      }`}
    >
      🇬🇧 ENG
    </button>
  </div>
</div>
  
</div>

          {/* PHOTO */}
          <div className="mb-6">

            <label className="block text-yellow-200 mb-3">

              {language === "id"
                ? "Upload Foto Kamu"
                : "Upload Your Photo"}

            </label>

            <label className="cursor-pointer block">

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />

              <div className="w-full rounded-3xl border border-yellow-500/20 bg-black/40 overflow-hidden">

                {preview ? (

                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-[220px] object-contain bg-black"
                  />

                ) : (

                  <div className="h-[220px] flex items-center justify-center text-yellow-100/50">

                    {language === "id"
                      ? "Klik Untuk Upload Foto"
                      : "Click to Upload Photo"}

                  </div>

                )}

              </div>

            </label>

          </div>

          {/* QUESTION */}
          <div className="mb-8">

            <label className="block text-yellow-200 mb-2">

              {language === "id"
                ? "Pertanyaan Kamu"
                : "Your Question"}

            </label>

            <textarea
              value={question}
              onChange={(e) =>
                setQuestion(
                  e.target.value
                )
              }
              maxLength={2000}
              placeholder={
                language === "id"
                  ? "Tulis pertanyaan kamu di sini..."
                  : "Type your question here..."
              }
              className="w-full h-40 rounded-2xl border border-yellow-500/30 bg-black/30 p-4 text-yellow-100 placeholder:text-yellow-100/30 outline-none"
            />

          </div>

          {/* BUTTON */}
          {question.trim() !==
            "" && (

            <button
              type="button"
              onClick={
                handleReading
              }
              className="w-full bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 text-black py-4 rounded-2xl text-lg md:text-xl font-bold shadow-[0_0_45px_rgba(255,215,0,0.7)]"
            >

              {language === "id"
                ? "MULAI PEMBACAAN"
                : "BEGIN READING"}

            </button>

          )}
 
   <div className="mt-6 flex flex-col items-center gap-3">
  {!isPremium ? (
  <>
    <a
      href="/premium"
      className="rounded-xl border border-yellow-400 px-6 py-3 font-bold text-yellow-300 hover:bg-yellow-400/10"
    >
      Lihat Paket Premium
    </a>

    {/*
    FLOW PREMIUM LAMA — DISIMPAN SEBAGAI CATATAN, JANGAN DIHAPUS:

    Tombol Premium Terkunci:
    Sebelumnya dipakai sebagai indikator bahwa user belum premium.

    Tombol Lanjutkan Pembayaran:
    Sebelumnya dipakai untuk membuka Midtrans langsung dari homepage.

    Flow lama:
    Homepage → Lanjutkan Pembayaran → Popup Midtrans → Cek Pembayaran

    Flow baru:
    Homepage → Lihat Paket Premium → /premium → Lanjutkan Pembayaran / Cek Status Premium

    <button
      type="button"
      disabled
      className="bg-yellow-500/40 text-black/50 px-6 py-4 rounded-xl font-bold cursor-not-allowed"
    >
      🔒 Premium Terkunci
    </button>

    <button
      type="button"
      onClick={handlePayment}
      className="underline text-yellow-300 hover:text-yellow-100 font-bold"
    >
      Lanjutkan Pembayaran
    </button>
    */}
     

{/* ==================================================
    FITUR: Pesan status pembayaran
    FUNGSI:
    Menampilkan pesan payment gagal/sukses di halaman,
    menggantikan alert browser bawaan.
================================================== */}

{paymentMessage && (
  <div className="mt-4 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-center text-sm text-yellow-200">
    {paymentMessage}
  </div>
)}

      {/*
FLOW LAMA — CEK PEMBAYARAN HOMEPAGE

Tombol ini dulu dipakai untuk mengecek pembayaran langsung dari homepage.
Sekarang cek status premium dipusatkan di halaman /premium,
supaya user tidak bingung.

<button
  type="button"
  onClick={checkPayment}
  className="underline text-green-300 hover:text-green-100 font-bold"
>
  Cek Pembayaran
</button>
*/}

    </>
  ) : (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        className="bg-green-500 text-black px-6 py-4 rounded-xl font-bold"
      >
        ✅ Premium Aktif
      </button>

      <button
        type="button"
        onClick={() => {
          localStorage.removeItem("premium");
          localStorage.removeItem("orderId");
          setIsPremium(false);
          alert("Premium di-reset untuk testing.");
        }}
        className="text-sm underline text-red-300 hover:text-red-200"
      >
        Reset Premium Testing
      </button>
    </div>
  )}
</div>

</div>        

      )}
   
     <footer className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/50">
  <p>
    THE CHARIOT / TAROT PREMIUM is a digital entertainment service.
  </p>

  <div className="mt-3 flex flex-wrap justify-center gap-4">
    <a href="/terms" className="hover:text-yellow-300">
      Terms
    </a>

    <a href="/privacy" className="hover:text-yellow-300">
      Privacy
    </a>

    <a href="/refund-policy" className="hover:text-yellow-300">
      Refund Policy
    </a>

    <a href="/contact" className="hover:text-yellow-300">
      Contact
    </a>

    <a href="/disclaimer" className="hover:text-yellow-300">
      Disclaimer
    </a>
  </div>
</footer>

    </main>

 );
}