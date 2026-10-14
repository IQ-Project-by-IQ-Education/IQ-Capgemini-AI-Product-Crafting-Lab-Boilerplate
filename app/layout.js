import "./globals.css";

export const metadata = {
  title: "TeoExpert",
  description: "Find internal experts by skill and project experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
