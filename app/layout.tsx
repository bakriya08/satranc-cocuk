import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Çocuklar İçin Sevimli Satranç ♟️",
  description: "Çocuklar için eğlenceli satranç oyunu, dersler, botlar, ödevler, masallar ve taktik bulmacalar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#fef3c7",
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "#171717",
          minHeight: "100vh",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
            padding: "10px 14px",
            backgroundColor: "#fffbeb",
            borderBottom: "3px solid #fde68a",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            position: "sticky",
            top: 0,
            zIndex: 40,
          }}
        >
          <Link "#f59e0b", "#ffffff", "12px", "14px", "7px "900", "none", 12px", backgroundColor: borderRadius: color: fontSize: fontWeight: href="/" padding: style="{{" textDecoration: }}>
            🏠 Bot Oyunu
          </Link>

          <Link "#0284c7", "#ffffff", "12px", "14px", "7px "900", "none", 12px", backgroundColor: borderRadius: color: fontSize: fontWeight: href="/dersler" padding: style="{{" textDecoration: }}>
            🎓 Derslerim
          </Link>

          <Link "#ef4444", "#ffffff", "12px", "14px", "7px "900", "none", 12px", backgroundColor: borderRadius: color: fontSize: fontWeight: href="/odev" padding: style="{{" textDecoration: }}>
            📚 Haftalık Ödev
          </Link>

          <Link "#ec4899", "#ffffff", "12px", "14px", "7px "900", "none", 12px", backgroundColor: borderRadius: color: fontSize: fontWeight: href="/masallar" padding: style="{{" textDecoration: }}>
            ✨ Masallar
          </Link>

          <Link "#8b5cf6", "#ffffff", "12px", "14px", "7px "900", "none", 12px", backgroundColor: borderRadius: color: fontSize: fontWeight: href="/kayit" padding: style="{{" textDecoration: }}>
            🌟 Kulübe Kayıt
          </Link>

          <Link "#3b82f6", "#ffffff", "12px", "14px", "7px "900", "none", 12px", backgroundColor: borderRadius: color: fontSize: fontWeight: href="/arkadasinla-oyna" padding: style="{{" textDecoration: }}>
            👥 2 Kişilik Oyna
          </Link>
        </header>

        <main style={{ padding: "14px", display: "flex", justifyContent: "center" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
