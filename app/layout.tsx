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

      </body>

    </html>

  );

}