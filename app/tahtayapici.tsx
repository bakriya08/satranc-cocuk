"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Chess } from "chess.js";

type TasSecimi = "r" | "n" | "b" | "q" | "k" | "p" | "R" | "N" | "B" | "Q" | "K" | "P" | "bos";

export default function TahtaYapiciPage() {
  const [oyun, setOyun] = useState<Chess | null>(null);
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [secilenTas, setSecilenTas] = useState<TasSecimi>("P");
  const [mesaj, setMesaj] = useState("Tahtadan bir kareye tıklayarak seçtiğiniz taşı yerleştirebilirsiniz.");
  const [kopyalandi, setKopyalandi] = useState(false);

  useEffect(() => {
    try {
      const yeniOyun = new Chess();
      setOyun(yeniOyun);
      setFen(yeniOyun.fen());
    } catch (e) {
      console.error(e);
    }
  }, []);

  function handleKareTikla(kareAdi: string) {
    if (!oyun) return;

    try {
      const mevcutTas = oyun.get(kareAdi as any);
      
      if (secilenTas === "bos") {
        if (mevcutTas) {
          oyun.remove(kareAdi as any);
        }
      } else {
        oyun.put({ type: secilenTas.toLowerCase() as any, color: secilenTas === secilenTas.toUpperCase() ? "w" : "b" }, kareAdi as any);
      }

      setFen(oyun.fen());
      setMesaj(`Başarıyla güncellendi: ${kareAdi}`);
    } catch (err) {
      setMesaj("Geçersiz yerleştirme hamlesi!");
    }
  }

  function tahtayiSifirla() {
    if (!oyun) return;
    oyun.load("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    setFen(oyun.fen());
    setMesaj("Tahta başlangıç konumuna sıfırlandı.");
  }

  function tahtayiTemizle() {
    if (!oyun) return;
    oyun.clear();
    setFen(oyun.fen());
    setMesaj("Tahta tamamen temizlendi.");
  }

  function feniKopyala() {
    navigator.clipboard.writeText(fen);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2500);
  }

  function fenToBoard(fenStr: string) {
    const fenParca = fenStr.split(" ")[0];
    const satirlar = fenParca.split("/");
    return satirlar.map((satir) => {
      let sonuc: string[] = [];
      for (const karakter of satir) {
        if (!isNaN(Number(karakter))) {
          for (let i = 0; i < Number(karakter); i++) sonuc.push(".");
        } else {
          sonuc.push(karakter);
        }
      }
      return sonuc;
    });
  }

  function tasGoster(kod: string) {
    const taslar: Record<string, string> = {
      r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟",
      R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", P: "♙"
    };
    return taslar[kod] || "";
  }

  const tahtaMatris = fenToBoard(fen);
  const dosyalar = ["a", "b", "c", "d", "e", "f", "g", "h"];

  return (
    <div
      style={{
        maxWidth: "720px",
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "24px",
        border: "3px solid #0284c7",
        boxShadow: "0 10px 30px rgba(2, 132, 199, 0.1)",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "40px" }}>🛠️♟️</span>
      <h1 style={{ fontSize: "20px", fontWeight: "900", color: "#0369a1", margin: "4px 0" }}>
        Satranç Tahta Yapıcı & Analiz Stüdyosu
      </h1>
      <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 14px 0" }}>
        İstediğiniz pozisyonu kurun, FEN kodunu kopyalayın ve analiz edin!
      </p>

      <div style={{ backgroundColor: "#f0f9ff", border: "2px solid #bae6fd", borderRadius: "12px", padding: "10px", fontSize: "12px", color: "#0369a1", fontWeight: "bold", marginBottom: "14px" }}>
        💡 {mesaj}
      </div>

      <div style={{ backgroundColor: "#f8fafc", padding: "10px", borderRadius: "14px", border: "1px solid #e2e8f0", marginBottom: "14px" }}>
        <div style={{ fontSize: "10px", fontWeight: "900", color: "#475569", marginBottom: "6px" }}>
          YERLEŞTİRMEK İÇİN TAŞ SEÇİN:
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap" }}>
          {(["R", "N", "B", "Q", "K", "P", "r", "n", "b", "q", "k", "p", "bos"] as TasSecimi[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSecilenTas(t)}
              style={{
                width: "36px",
                height: "36px",
                fontSize: "20px",
                backgroundColor: secilenTas === t ? "#dcfce7" : "#ffffff",
                border: secilenTas === t ? "2px solid #10b981" : "1px solid #cbd5e1",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {t === "bos" ? "📭" : tasGoster(t)}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gridTemplateRows: "repeat(8, 1fr)",
          width: "350px",
          height: "350px",
          margin: "0 auto 14px auto",
          border: "4px solid #451a03",
          borderRadius: "6px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        }}
      >
        {tahtaMatris.map((satir, r) =>
          satir.map((tas, c) => {
            const dosyaHarfi = dosyalar[c];
            const siraSayisi = 8 - r;
            const kareAdi = `${dosyaHarfi}${siraSayisi}`;
            const beyazKare = (r + c) % 2 === 0;

            return (
              <div
                key={kareAdi}
                onClick={() => handleKareTikla(kareAdi)}
                style={{
                  backgroundColor: beyazKare ? "#ebecd0" : "#739552",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "34px",
                  cursor: "pointer",
                  userSelect: "none",
                  width: "100%",
                  height: "100%",
                }}
              >
                {tasGoster(tas)}
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginBottom: "14px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
        <div style={{ fontSize: "11px", fontWeight: "bold", color: "#334155" }}>Konum Kodu (FEN):</div>
        <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "400px" }}>
          <input
            type="text"
            readOnly
            value={fen}
            style={{ flex: 1, padding: "8px", fontSize: "11px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", textAlign: "center" }}
          />
          <button
            type="button"
            onClick={feniKopyala}
            style={{ padding: "8px 12px", backgroundColor: kopyalandi ? "#16a34a" : "#0284c7", color: "#fff", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}
          >
            {kopyalandi ? "Kopyalandı! ✅" : "Kopyala"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={tahtayiSifirla}
          style={{ padding: "8px 14px", backgroundColor: "#f59e0b", color: "#ffffff", borderRadius: "10px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}
        >
          🔄 Başlangıç Konumu
        </button>
        <button
          type="button"
          onClick={tahtayiTemizle}
          style={{ padding: "8px 14px", backgroundColor: "#ef4444", color: "#ffffff", borderRadius: "10px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}
        >
          🧹 Tahtayı Temizle
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <Link
          href="/"
          style={{ padding: "8px 14px", backgroundColor: "#0284c7", color: "#ffffff", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", fontSize: "11px" }}
        >
          🤖 Bot Oyunu
        </Link>
        <Link
          href="/dersler"
          style={{ padding: "8px 14px", backgroundColor: "#10b981", color: "#ffffff", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", fontSize: "11px" }}
        >
          🎓 Dersler
        </Link>
      </div>
    </div>
  );
}
