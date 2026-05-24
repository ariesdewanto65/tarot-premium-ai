"use client";

import { useState } from "react";

export default function Home() {

  const [question, setQuestion] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [language, setLanguage] = useState("id");

  const [loading, setLoading] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [reading, setReading] = useState("");

  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [replaceIndex, setReplaceIndex] = useState(0);

  /* START READING */
  const handleReading = () => {

    setLoading(true);

    setTimeout(() => {

      setLoading(false);

      setShowCards(true);

    }, 2500);

  };

  /* REVEAL RESULT */
  const handleReveal = async () => {

    setLoading(true);

    try {

      const tarotMap: Record<number, string> = {

        1: "The Magician",
        2: "The High Priestess",
        3: "The Empress",
        4: "The Emperor",
        5: "Five of Wands",
        6: "The Lovers",
        7: "The Chariot",
        8: "Strength",
        9: "The Hermit",

      };

      const cardNames = selectedCards.map(
        (card) => tarotMap[card]
      );

      const response = await fetch(
        "/api/tarot",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            question,
            cards: cardNames,
            language,

          }),

        }
      );

      const data = await response.json();

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

    const file = e.target.files?.[0];

    if (!file) return;

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {

      alert(
        language === "id"
          ? "Ukuran foto maksimal 5 MB"
          : "Maximum photo size is 5 MB"
      );

      return;

    }

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);

  };

  /* CARD SELECT */
  const handleCardSelect = (card: number) => {

    if (selectedCards.includes(card)) return;

    if (selectedCards.length < 3) {

      setSelectedCards([
        ...selectedCards,
        card,
      ]);

    } else {

      const updated = [...selectedCards];

      updated[replaceIndex] = card;

      setSelectedCards(updated);

      setReplaceIndex(
        (replaceIndex + 1) % 3
      );

    }

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

      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute w-[500px] h-[500px] bg-yellow-500/20 rounded-full blur-3xl top-[-200px] left-[-100px] animate-pulse" />

        <div className="absolute w-[500px] h-[500px] bg-green-400/20 rounded-full blur-3xl bottom-[-200px] right-[-100px] animate-pulse" />

      </div>

      {/* RESULT PAGE */}
      {showResult ? (

        <div className="relative z-10 w-full max-w-3xl rounded-[32px] border border-yellow-500/20 bg-white/5 backdrop-blur-md shadow-[0_0_80px_rgba(255,215,0,0.08)] p-6 md:p-10">

          <h1 className="text-4xl md:text-6xl text-center font-bold text-yellow-300 mb-6">

            {language === "id"
              ? "Hasil Pembacaan"
              : "Reading Result"}

          </h1>

          {/* RESULT CARDS */}
          <div className="grid grid-cols-3 gap-4 mb-8">

            {selectedCards.map((card, i) => (

              <div
                key={i}
                className="h-24 md:h-36 rounded-3xl border border-yellow-500/20 bg-black/40 flex flex-col items-center justify-center text-yellow-300"
              >

                <div className="text-4xl font-bold mb-2">

                  {card}

                </div>

                <div className="text-xs text-yellow-100/60">

                  {
                    {
                      1: "The Magician",
                      2: "The High Priestess",
                      3: "The Empress",
                      4: "The Emperor",
                      5: "Five of Wands",
                      6: "The Lovers",
                      7: "The Chariot",
                      8: "Strength",
                      9: "The Hermit",
                    }[card]
                  }

                </div>

              </div>

            ))}

          </div>

          {/* AI RESULT */}
          <div className="rounded-3xl border border-yellow-500/20 bg-black/40 p-6 text-yellow-100/80 leading-relaxed text-sm md:text-lg whitespace-pre-line">

            {reading}

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

            {[1,2,3,4,5,6,7,8,9].map((card) => {

              const active =
                selectedCards.includes(card);

              return (

                <button
                  key={card}
                  onClick={() =>
                    handleCardSelect(card)
                  }
                  className={`h-32 md:h-48 rounded-3xl border flex items-center justify-center text-4xl font-bold transition-all duration-300 cursor-pointer backdrop-blur-md hover:scale-105 ${
                    active
                      ? "border-yellow-300 bg-yellow-500/10 shadow-[0_0_40px_rgba(255,215,0,0.45)]"
                      : "border-yellow-500/20 bg-black/40 shadow-[0_0_40px_rgba(255,215,0,0.1)]"
                  }`}
                >

                  {card}

                </button>

              );

            })}

          </div>

          {/* SELECTED */}
          <div className="mt-10 w-full max-w-xl">

            <h2 className="text-yellow-200 text-xl mb-4 text-center">

              {language === "id"
                ? "Kartu Terpilih"
                : "Selected Cards"}

            </h2>

            <div className="grid grid-cols-3 gap-4">

              {[0,1,2].map((slot) => (

                <div
                  key={slot}
                  className="h-20 rounded-2xl border border-yellow-500/20 bg-black/40 flex items-center justify-center text-3xl font-bold text-yellow-300 shadow-[0_0_30px_rgba(255,215,0,0.08)]"
                >

                  {selectedCards[slot] || "?"}

                </div>

              ))}

            </div>

            {/* REVEAL BUTTON */}
            {selectedCards.length === 3 && (

              <button
                onClick={handleReveal}
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

        /* MAIN PAGE */
        <div className="relative z-10 w-full max-w-md md:max-w-2xl rounded-[32px] border border-yellow-500/20 bg-white/5 backdrop-blur-md shadow-[0_0_80px_rgba(255,215,0,0.08)] p-5 md:p-10">

          {/* LOGO */}
          <div className="flex flex-col items-center text-center mb-8">

            <h1 className="text-3xl md:text-6xl font-extrabold tracking-[4px] md:tracking-[8px] text-yellow-300">

              THE CHARIOT

            </h1>

          </div>

          {/* LANGUAGE */}
          <div className="mb-6">

            <label className="block text-yellow-200 mb-2 text-sm md:text-lg">

              Language

            </label>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
              className="w-full rounded-2xl border border-yellow-500/30 bg-black/30 p-3 md:p-4 text-yellow-100 outline-none"
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

            <label className="block text-yellow-200 mb-3 text-sm md:text-lg">

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
                    className="w-full h-[180px] md:h-[300px] object-contain bg-black"
                  />

                ) : (

                  <div className="h-[180px] md:h-[300px] flex items-center justify-center text-yellow-100/50">

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

            <label className="block text-yellow-200 mb-2 text-sm md:text-lg">

              {language === "id"
                ? "Pertanyaan Kamu"
                : "Your Question"}

            </label>

            <textarea
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              maxLength={2000}
              placeholder={
                language === "id"
                  ? "Tulis pertanyaan kamu di sini..."
                  : "Type your question here..."
              }
              className="w-full h-28 md:h-40 rounded-2xl border border-yellow-500/30 bg-black/30 p-4 text-yellow-100 placeholder:text-yellow-100/30 outline-none"
            />

            <div className="mt-2 flex justify-between text-xs md:text-sm text-yellow-100/40">

              <span>

                {language === "id"
                  ? "Maksimal 2000 karakter"
                  : "Maximum 2000 characters"}

              </span>

              <span>

                {question.length}/2000

              </span>

            </div>

          </div>

          {/* BUTTON */}
          {question.trim() !== "" && (

            <button
              type="button"
              onClick={handleReading}
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