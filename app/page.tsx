"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Chess } from "chess.js";

type TakimTipi = "gs" | "fb" | "bjk";

export default function BotOyunuPage() {
  const [oyun, setOyun] = useState<Chess | null>(null);
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [zorluk, setZorluk] = useState<"kolay" | "orta" | "zor">("kolay");
  const [botMesaji, setBotMesaji] = useState("Manifest - Toz Pembe eşliğinde derbi heyecanı başladı! Takımını seç ve maçı başlat! 🎵♟️");
  const [secilenKare, setSecilenKare] = useState<string | null>(null);
  const [imkanliKareler, setImkanliKareler] = useState<string[]>([]);
  const [oyunDurumu, setOyunDurumu] = useState("Sıra Sende (Senin Takımın)");

  const [benimTakimim, setBenimTakimim] = useState<TakimTipi>("gs");
  const [rakipTakim, setRakipTakim] = useState<TakimTipi>("fb");

  const [aktifSekme, setAktifSekme] = useState<"bot" | "gununBulmacasi">("bot");
  const [bulmacaPuani, setBulmacaPuani] = useState(0);
  const [bulmacaMesaji, setBulmacaMesaji] = useState("Günün taktiğini çöz, ekstra kulüp puanını kap! 🧩");

  const [muzikCaliyor, setMuzikCaliyor] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const yeniOyun = new Chess();
    setOyun(yeniOyun);
    setFen(yeniOyun.fen());

    try {
      const kayitliPuan = localStorage.getItem("kulupBulmacaPuani");
      if (kayitliPuan) setBulmacaPuani(Number(kayitliPuan));
    } catch {}

    // Manifest - Toz Pembe / Ritmik Müzik Akış Kaynağı
    audioRef.current = new Audio("https://youtu.be/0pg0raFMNIU?list=RD0pg0raFMNIU"); 
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  function muzikKontrol() {
    if (!audioRef.current) return;
    if (muzikCaliyor) {
      audioRef.current.pause();
      setMuzikCaliyor(false);
      botuKonustur("Müzik durduruldu.");
    } else {
      audioRef.current.play().catch(() => {});
      setMuzikCaliyor(true);
      botuKonustur("Manifest - Toz Pembe çalıyor, keyifli oyunlar! 🎵💖");
    }
  }

  function botuKonustur(metin: string) {
    setBotMesaji(metin);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const ses = new SpeechSynthesisUtterance(metin);
      ses.lang = "tr-TR";
      ses.rate = 0.95;
      window.speechSynthesis.speak(ses);
    }
  }

  function handleKareTikla(kareAdi: string) {
    if (!oyun || oyun.isGameOver()) return;

    if (secilenKare === null) {
      const tas = oyun.get(kareAdi as any);
      if (tas && tas.color === "w") {
        setSecilenKare(kareAdi);
        const hamleler = oyun.moves({ square: kareAdi as any, verbose: true });
        setImkanliKareler(hamleler.map((h) => h.to));
        botuKonustur("Güzel bir taş seçtin, kaleye doğru ilerleyelim!");
      }
    } else {
      try {
        const hamleObj = oyun.moves({ square: secilenKare as any, verbose: true }).find((h) => h.to === kareAdi);
        
        const hamle = oyun.move({
          from: secilenKare,
          to: kareAdi,
          promotion: "q",
        });

        if (hamle) {
          setFen(oyun.fen());
          setSecilenKare(null);
          setImkanliKareler([]);

          if (oyun.isGameOver()) {
            setOyunDurumu("Maç Bitti, Muhteşem Zafer!");
            botuKonustur("Maçı kazandın, harika bir satranç zaferi! 🏆");
            return;
          }

          degerlendirHamle(hamleObj);
          setOyunDurumu("Rakip takım hamle yapıyor... 🤔");

          setTimeout(() => {
            botHamlesiYap(oyun);
          }, 1400);
        } else {
          const tas = oyun.get(kareAdi as any);
          if (tas && tas.color === "w") {
            setSecilenKare(kareAdi);
            const hamleler = oyun.moves({ square: kareAdi as any, verbose: true });
            setImkanliKareler(hamleler.map((h) => h.to));
          } else {
            setSecilenKare(null);
            setImkanliKareler([]);
          }
        }
      } catch {
        setSecilenKare(null);
        setImkanliKareler([]);
      }
    }
  }

  function degerlendirHamle(hamle: any) {
    if (!hamle) return;

    if (hamle.captured) {
      botuKonustur("Harika bir hamleyle rakip taşı kaptın! 🔥");
    } else if (hamle.san.includes("+")) {
      botuKonustur("Müthiş! Rakip şaha saldırdın, şah çektin! ⚡");
    } else if (["d4", "e4", "d5", "e5"].includes(hamle.to)) {
      botuKonustur("Merkezi ele geçirdin, tahtanın hakimi sensin! 🎯");
    } else {
      botuKonustur("Güzel ve dengeli bir hamle, devam et!");
    }
  }

  function botHamlesiYap(guncelOyun: Chess) {
    if (guncelOyun.isGameOver()) return;

    const yasalHamleler = guncelOyun.moves({ verbose: true });
    if (yasalHamleler.length === 0) return;

    let secilenHamle = yasalHamleler[Math.floor(Math.random() * yasalHamleler.length)];

    if (zorluk === "orta") {
      const tasAlanlar = yasalHamleler.filter((h) => h.captured);
      if (tasAlanlar.length > 0) {
        secilenHamle = tasAlanlar[Math.floor(Math.random() * tasAlanlar.length)];
      }
    } else if (zorluk === "zor") {
      const matEden = yasalHamleler.find((h) => h.san.includes("#"));
      const sahCeken = yasalHamleler.find((h) => h.san.includes("#") || h.san.includes("+"));
      const tasAlan = yasalHamleler.find((h) => h.captured);
      secilenHamle = matEden || sahCeken || tasAlan || secilenHamle;
    }

    guncelOyun.move(secilenHamle);
    setFen(guncelOyun.fen());
    setOyunDurumu("Sıra Sende (Senin Takımın)");
  }

  function fenToBoard(fenStr: string) {
    const fenParca = fenStr.split(" ")[0];
    const satirlar = fenParca.split("/");
    return satirlar.map((satir) => {
      const sonuc: string[] = [];
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
    const isWhite = kod === kod.toUpperCase();
    const aktifTakim = isWhite ? benimTakimim : rakipTakim;

    const klasikSemboller: Record<string, string> = {
      p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
      P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔"
    };

    const sembol = klasikSemboller[kod] || "";
    
    let renkKodu = "#1e293b";
    if (aktifTakim === "gs") {
      renkKodu = isWhite ? "#fbbf24" : "#dc2626";
    } else if (aktifTakim === "fb") {
      renkKodu = isWhite ? "#facc15" : "#2563eb";
    } else {
      renkKodu = isWhite ? "#ffffff" : "#09090b";
    }

    return (
      <span style={{ color: renkKodu, textShadow: "0 2px 4px rgba(0,0,0,0.3)", fontSize: "36px", fontWeight: "900" }}>
        {sembol}
      </span>
    );
  }

  function renkSec(beyazKare: boolean) {
    if (benimTakimim === "gs") return beyazKare ? "#fef08a" : "#991b1b";
    if (benimTakimim === "fb") return beyazKare ? "#fef08a" : "#1e3a8a";
    return beyazKare ? "#f1f5f9" : "#18181b";
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
        border: "3px solid #ec4899",
        boxShadow: "0 10px 30px rgba(236, 72, 153, 0.15)",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "40px" }}>🎵💖</span>
      <h1 style={{ fontSize: "20px", fontWeight: "900", color: "#db2777", margin: "4px 0" }}>
        Manifest - Toz Pembe & Derbi Arenası
      </h1>
      <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 14px 0" }}>
        Arkaplanda "Manifest - Toz Pembe" eşliğinde keyifli satranç maçı yapın!
      </p>

      {/* MANİFEST - TOZ PEMBE MÜZİK ÇALAR KONTROLÜ */}
      <div style={{ backgroundColor: "#fdf2f8", border: "2px solid #fbcfe8", borderRadius: "14px", padding: "10px 16px", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "22px" }}>🎧</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "11px", fontWeight: "950", color: "#9d174d" }}>MANİFEST - TOZ PEMBE</div>
            <div style={{ fontSize: "10px", color: "#be185d", fontWeight: "bold" }}>{muzikCaliyor ? "🎵 Çalıyor..." : "Müzik Durduruldu"}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={muzikKontrol}
          style={{
            padding: "8px 14px",
            backgroundColor: muzikCaliyor ? "#dc2626" : "#db2777",
            color: "#ffffff",
            borderRadius: "10px",
            border: "none",
            fontWeight: "900",
            fontSize: "11px",
            cursor: "pointer",
          }}
        >
          {muzikCaliyor ? "⏹️ Müziği Durdur" : "▶️ Şarkıyı Başlat"}
        </button>
      </div>

      {/* ANA SEKME DEĞİŞTİRME */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "16px" }}>
        <button
          type="button"
          onClick={() => setAktifSekme("bot")}
          style={{
            padding: "8px 16px",
            backgroundColor: aktifSekme === "bot" ? "#db2777" : "#f1f5f9",
            color: aktifSekme === "bot" ? "#ffffff" : "#334155",
            borderRadius: "10px",
            border: "none",
            fontWeight: "900",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          ♟️ Derbi Bot Arenası
        </button>
        <button
          type="button"
          onClick={() => setAktifSekme("gununBulmacasi")}
          style={{
            padding: "8px 16px",
            backgroundColor: aktifSekme === "gununBulmacasi" ? "#d97706" : "#f1f5f9",
            color: aktifSekme === "gununBulmacasi" ? "#ffffff" : "#334155",
            borderRadius: "10px",
            border: "none",
            fontWeight: "900",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          🧩 Günün Bulmacası (+50 Puan)
        </button>
      </div>

      {aktifSekme === "bot" ? (
        <div>
          <div style={{ backgroundColor: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: "16px", padding: "12px", marginBottom: "14px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <div style={{ fontSize: "10px", fontWeight: "950", color: "#db2777", marginBottom: "4px" }}>⭐ SENİN TAKIMIN</div>
              <div style={{ display: "flex", gap: "4px" }}>
                <button type="button" onClick={() => setBenimTakimim("gs")} style={{ padding: "4px 8px", backgroundColor: benimTakimim === "gs" ? "#991b1b" : "#e2e8f0", color: benimTakimim === "gs" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Galatasaray</button>
                <button type="button" onClick={() => setBenimTakimim("fb")} style={{ padding: "4px 8px", backgroundColor: benimTakimim === "fb" ? "#1e3a8a" : "#e2e8f0", color: benimTakimim === "fb" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Fenerbahçe</button>
                <button type="button" onClick={() => setBenimTakimim("bjk")} style={{ padding: "4px 8px", backgroundColor: benimTakimim === "bjk" ? "#18181b" : "#e2e8f0", color: benimTakimim === "bjk" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Beşiktaş</button>
              </div>
            </div>

            <div>
              <div style={{ fontSize: "10px", fontWeight: "950", color: "#b91c1c", marginBottom: "4px" }}>🛡️ RAKİP TAKIM</div>
              <div style={{ display: "flex", gap: "4px" }}>
                <button type="button" onClick={() => setRakipTakim("gs")} style={{ padding: "4px 8px", backgroundColor: rakipTakim === "gs" ? "#991b1b" : "#e2e8f0", color: rakipTakim === "gs" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Galatasaray</button>
                <button type="button" onClick={() => setRakipTakim("fb")} style={{ padding: "4px 8px", backgroundColor: rakipTakim === "fb" ? "#1e3a8a" : "#e2e8f0", color: rakipTakim === "fb" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Fenerbahçe</button>
                <button type="button" onClick={() => setRakipTakim("bjk")} style={{ padding: "4px 8px", backgroundColor: rakipTakim === "bjk" ? "#18181b" : "#e2e8f0", color: rakipTakim === "bjk" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Beşiktaş</button>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "12px" }}>
            <button type="button" onClick={() => { setZorluk("kolay"); botuKonustur("Kolay mod aktif!"); }} style={{ padding: "5px 10px", backgroundColor: zorluk === "kolay" ? "#22c55e" : "#f1f5f9", color: zorluk === "kolay" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}>🟢 Kolay</button>
            <button type="button" onClick={() => { setZorluk("orta"); botuKonustur("Orta mod aktif!"); }} style={{ padding: "5px 10px", backgroundColor: zorluk === "orta" ? "#f59e0b" : "#f1f5f9", color: zorluk === "orta" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}>🟡 Orta</button>
            <button type="button" onClick={() => { setZorluk("zor"); botuKonustur("Zor mod aktif!"); }} style={{ padding: "5px 10px", backgroundColor: zorluk === "zor" ? "#ef4444" : "#f1f5f9", color: zorluk === "zor" ? "#fff" : "#333", borderRadius: "6px", border: "none", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}>🔴 Zor</button>
          </div>

          <div style={{ backgroundColor: "#fdf2f8", border: "2px solid #fbcfe8", borderRadius: "12px", padding: "10px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px", textAlign: "left" }}>
            <span style={{ fontSize: "24px" }}>🎙️</span>
            <div>
              <div style={{ fontSize: "9px", fontWeight: "900", color: "#9d174d" }}>ANTRENÖR KOÇ:</div>
              <p style={{ fontSize: "11px", fontWeight: "bold", color: "#831843", margin: 0 }}>"{botMesaji}"</p>
            </div>
          </div>

          <div style={{ fontSize: "12px", fontWeight: "900", color: "#db2777", marginBottom: "8px" }}>{oyunDurumu}</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gridTemplateRows: "repeat(8, 1fr)",
              width: "370px",
              height: "370px",
              margin: "0 auto 16px auto",
              border: "4px solid #db2777",
              borderRadius: "6px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            }}
          >
            {tahtaMatris.map((satir, r) =>
              satir.map((tas, c) => {
                const dosyaHarfi = dosyalar[c];
                const siraSayisi = 8 - r;
                const kareAdi = `${dosyaHarfi}${siraSayisi}`;

                const beyazKare = (r + c) % 2 === 0;
                const secili = secilenKare === kareAdi;
                const hedefteMi = imkanliKareler.includes(kareAdi);

                let arkaplan = renkSec(beyazKare);
                if (secili) arkaplan = "#fde047";
                else if (hedefteMi) arkaplan = beyazKare ? "#fbcfe8" : "#ec4899";

                return (
                  <div
                    key={kareAdi}
                    onClick={() => handleKareTikla(kareAdi)}
                    style={{
                      backgroundColor: arkaplan,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      position: "relative",
                      userSelect: "none",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {hedefteMi && tas === "." && (
                      <div
                        style={{
