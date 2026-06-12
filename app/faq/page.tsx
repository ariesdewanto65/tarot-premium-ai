import Link from "next/link";

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-950 via-green-900 to-black px-4 py-12 text-white">
      <div className="mx-auto max-w-4xl rounded-3xl border border-yellow-400/30 bg-black/35 p-6 shadow-[0_0_50px_rgba(250,204,21,0.12)] md:p-10">
        <h1 className="text-center text-3xl font-bold text-yellow-300 md:text-4xl">
          Frequently Asked Questions
        </h1>

        <p className="mt-4 text-center text-sm text-white/60">
          Pertanyaan yang sering diajukan
        </p>

        <section className="mt-10 space-y-8 leading-8 text-white/85">
          <div>
            <h2 className="text-xl font-semibold text-yellow-200">
              1. Apa itu THE CHARIOT?
            </h2>
            <p className="mt-2">
              THE CHARIOT adalah layanan hiburan digital berbasis kecerdasan
              buatan yang menyediakan pembacaan tarot dan oracle secara online.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-200">
              2. Apakah hasil pembacaan bersifat pasti?
            </h2>
            <p className="mt-2">
              Tidak. Hasil pembacaan dibuat untuk hiburan dan refleksi pribadi,
              bukan sebagai kepastian masa depan atau pengganti nasihat
              profesional.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-200">
              3. Bagaimana cara melakukan pembayaran?
            </h2>
            <p className="mt-2">
              Pilih layanan premium, lanjutkan ke halaman pembayaran, lalu
              selesaikan transaksi melalui metode pembayaran yang tersedia.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-200">
              4. Kapan akses premium aktif?
            </h2>
            <p className="mt-2">
              Akses premium akan aktif setelah pembayaran berhasil dikonfirmasi
              oleh sistem pembayaran.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-200">
              5. Apa yang harus dilakukan jika pembayaran berhasil tetapi akses belum aktif?
            </h2>
            <p className="mt-2">
              Gunakan tombol pemeriksaan pembayaran jika tersedia. Apabila akses
              tetap belum aktif, hubungi kami melalui halaman Kontak dan
              sertakan nomor pesanan serta bukti pembayaran.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-200">
              6. Apakah pembayaran dapat dikembalikan?
            </h2>
            <p className="mt-2">
              Pengembalian dana hanya dapat dipertimbangkan dalam kondisi
              tertentu, seperti pembayaran ganda atau gangguan sistem. Detailnya
              tersedia pada halaman Kebijakan Pengembalian Dana.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-200">
              7. Apakah data pengguna aman?
            </h2>
            <p className="mt-2">
              Kami menggunakan data pengguna hanya untuk menjalankan layanan,
              memproses transaksi, dan memberikan dukungan sesuai kebijakan
              privasi yang berlaku.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-200">
              8. Bagaimana cara menghubungi pengelola?
            </h2>
            <p className="mt-2">
              Pengguna dapat menghubungi kami melalui halaman Kontak yang
              tersedia pada website.
            </p>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap justify-center gap-5 text-center">
          <Link
            href="/refund-policy"
            className="font-semibold text-yellow-300 underline underline-offset-4 transition hover:text-yellow-200"
          >
            Kebijakan Pengembalian Dana
          </Link>

          <Link
            href="/contact"
            className="font-semibold text-yellow-300 underline underline-offset-4 transition hover:text-yellow-200"
          >
            Kontak
          </Link>

          <Link
            href="/"
            className="font-semibold text-yellow-300 underline underline-offset-4 transition hover:text-yellow-200"
          >
            ← Kembali ke halaman utama
          </Link>
        </div>
      </div>
    </main>
  );
}