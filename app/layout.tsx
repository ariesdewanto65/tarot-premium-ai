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
        
        <script
         src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key="Mid-client-2jn-DmgJzchdMdBHtaskkill /PID 15376 /F"
          
>        </script>
      </body> 

    </html>

  );

}