"use client";

import { useState } from "react";

export default function Home() {

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
    useState("");

  const [preview, setPreview] =
    useState<string | null>(null);

  const [language, setLanguage] =
    useState("id");

  const [loading, setLoading] =
    useState(false);

  const [showCards, setShowCards] =
    useState(false);

  const [showResult, setShowResult] =
    useState(false);

  const [reading, setReading] =
    useState("");

  const [shuffledDeck, setShuffledDeck] =
    useState<string[]>([]);

  const [selectedCards, setSelectedCards] =
    useState<string[]>([]);

  const [replaceIndex, setReplaceIndex] =
    useState(0);

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

            }),

          }
        );

      const data =
        await response.json();

      setReading(data.result);

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

  return (

    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-green-950 via-green-900 to-black flex items-center justify-center px-4 py-10 text-yellow-300">

      {/* LOADING */}
      {loading && (

        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center px-6">

          <div className="w-32 h-32 rounded-full bg-yellow-400/10 blur-3xl animate-pulse absolute" />

          <div className="relative w-24 h-24 rounded-full border border-yellow-500/40 flex items-center justify-center shadow-[0_0_60px_rgba(255,215,0,0.4)] bg-black/30 mb-8">

            <div className="text-4xl text-yellow-300 font-bold animate-pulse">

              VII

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

          {/* MENU */}
          <div className="mt-8 text-center">

            <button
              onClick={handleReset}
              className="underline text-yellow-300 hover:text-yellow-100 transition"
            >

              {language === "id"
                ? "Menu Utama"
                : "Main Menu"}

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

                        <>
                          <div className="text-yellow-200 text-xs tracking-[4px] mb-3 opacity-70">

                            REVEALED

                          </div>

                          <div className="text-yellow-300 text-lg md:text-2xl font-bold text-center leading-tight">

                            {card}

                          </div>

                          <div className="mt-4 text-yellow-100/40 text-xs tracking-[3px]">

                            THE CHARIOT

                          </div>
                        </>

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

          {/* LANGUAGE */}
          <div className="mb-6">

            <label className="block text-yellow-200 mb-2">

              Language

            </label>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-yellow-500/30 bg-black/30 p-4 text-yellow-100"
            >

              <option value="id">
                Bahasa Indonesia
              </option>

              <option value="en">
                English
              </option>

            </select>

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

        </div>

      )}

    </main>

  );

}