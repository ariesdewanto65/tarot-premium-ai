import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "Tarot Premium",
  description: "AI Tarot Reading",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}

        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key="Mid-client-mtLz68f3Tqv8I6PQ"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}