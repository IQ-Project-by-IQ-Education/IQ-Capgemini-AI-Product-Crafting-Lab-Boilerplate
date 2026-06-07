import "./globals.css";

export const metadata = {
  title: "Capgemini Build Challenge",
  description: "Your blank canvas — tell Claude what you'd like to build.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
