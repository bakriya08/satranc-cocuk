import { NextResponse } from "next/server";

export interface OgrenciProfil {
  id: string;
  adSoyad: string;
  sinifGrup: string;
  avatar: string;
  pin: string;
  kayitTarihi: string;
}

export interface SoruItem {
  id: number;
  title: string;
  fen: string;
  hint: string;
}

export interface SoruAnalizItem {
  soruId: number;
  soruBaslik: string;
  hataliDeneme: number;
}

export interface OdevKaydi {
  id: string;
  ogrenciAdi: string;
  sinifGrup?: string;
  avatar?: string;
  toplamSoru: number;
  dogruSayisi: number;
  toplamHata: number;
  gecenSureSaniye: number;
  tamamlanmaTarihi: string;
  soruDetaylari: SoruAnalizItem[];
}

const VARSAYILAN_SORULAR: SoruItem[] = [
  {
    id: 1,
    title: "1. Görev: Çoban Matı Taktik Darbesi 🎯",
    fen: "r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4",
    hint: "İpucu: Vezir zayıf f7 karesine saldırabilir!",
  },
  {
    id: 2,
    title: "2. Görev: Koridor Matı (Arka Sıra) 🏰",
    fen: "6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1",
    hint: "İpucu: Kaleyi 8. yataya indir!",
  },
  {
    id: 3,
    title: "3. Görev: Vezir Dalışı 👑",
    fen: "r1b2rk1/ppp2ppp/2n5/3p4/7q/2B5/PPP1QPPP/2KR1B1R w - - 0 1",
    hint: "İpucu: Vezir e8 karesinden son sırayı vuruyor!",
  },
  {
    id: 4,
    title: "4. Görev: Zıplayan At Matı 🐴",
    fen: "6k1/5ppp/8/8/5N2/8/8/6K1 w - - 0 1",
    hint: "İpucu: At f4'ten e7'ye zıplayarak şaha kaçış bırakmıyor!",
  },
  {
    id: 5,
    title: "5. Görev: Merdiven Matı 🪜",
    fen: "7k/R7/8/8/8/8/1R6/6K1 w - - 0 1",
    hint: "İpucu: b2 kalesini b8'e indirerek mat et!",
  },
];

const globalStorage = globalThis as any;
if (!globalStorage.__odevSorulari) globalStorage.__odevSorulari = [...VARSAYILAN_SORULAR];
if (!globalStorage.__aktifOdevler) globalStorage.__aktifOdevler = [];
if (!globalStorage.__arsivlenmisOdevler) globalStorage.__arsivlenmisOdevler = [];
if (!globalStorage.__kayitliOgrenciler) globalStorage.__kayitliOgrenciler = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "sorular") {
    return NextResponse.json({ success: true, data: globalStorage.__odevSorulari });
  }

  if (type === "ogrenciler") {
    return NextResponse.json({ success: true, data: globalStorage.__kayitliOgrenciler });
  }

  return NextResponse.json({
    success: true,
    data: {
      sorular: globalStorage.__odevSorulari,
      aktifOdevler: globalStorage.__aktifOdevler,
      arsivSayisi: globalStorage.__arsivlenmisOdevler.length,
      ogrenciler: globalStorage.__kayitliOgrenciler,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // ÖĞRENCİ KAYIT
    if (action === "ogrenciKayit") {
      const { adSoyad, sinifGrup, avatar, pin } = body;
      if (!adSoyad || !adSoyad.trim()) {
        return NextResponse.json({ success: false, message: "İsim gereklidir" }, { status: 400 });
      }

      const yeniOgrenci: OgrenciProfil = {
        id: Date.now().toString(),
        adSoyad: adSoyad.trim(),
        sinifGrup: (sinifGrup || "Genel").trim(),
        avatar: avatar || "🦁",
        pin: pin || "1234",
        kayitTarihi: new Date().toLocaleDateString("tr-TR"),
      };

      // Varsa güncelle, yoksa ekle
      const mevcutIndex = globalStorage.__kayitliOgrenciler.findIndex(
        (o: OgrenciProfil) => o.adSoyad.toLowerCase() === yeniOgrenci.adSoyad.toLowerCase()
      );
      if (mevcutIndex >= 0) {
        globalStorage.__kayitliOgrenciler[mevcutIndex] = yeniOgrenci;
      } else {
        globalStorage.__kayitliOgrenciler.push(yeniOgrenci);
      }

      return NextResponse.json({ success: true, data: yeniOgrenci });
    }

    // YENİ SORU EKLEME
    if (action === "soruEkle") {
      const { title, fen, hint } = body;
      const yeniId = globalStorage.__odevSorulari.length > 0
        ? Math.max(...globalStorage.__odevSorulari.map((s: SoruItem) => s.id)) + 1
        : 1;

      const yeniSoru: SoruItem = {
        id: yeniId,
        title: title.trim(),
        fen: fen.trim(),
        hint: (hint || "").trim(),
      };
      globalStorage.__odevSorulari.push(yeniSoru);
      return NextResponse.json({ success: true, data: globalStorage.__odevSorulari });
    }

    // SORU SİLME
    if (action === "soruSil") {
      const { id } = body;
      globalStorage.__odevSorulari = globalStorage.__odevSorulari.filter((s: SoruItem) => s.id !== id);
      return NextResponse.json({ success: true, data: globalStorage.__odevSorulari });
    }

    // HAFTAYI ARŞİVLE
    if (action === "haftayiArsivle") {
      if (globalStorage.__aktifOdevler.length > 0) {
        globalStorage.__arsivlenmisOdevler.push({
          arsivTarihi: new Date().toLocaleString("tr-TR"),
          kayitlar: [...globalStorage.__aktifOdevler],
        });
        globalStorage.__aktifOdevler = [];
      }
      return NextResponse.json({ success: true, message: "Hafta arşivlendi!" });
    }

    // ÖDEV TESLİMİ
    const { ogrenciAdi, sinifGrup, avatar, toplamSoru, dogruSayisi, toplamHata, gecenSureSaniye, soruDetaylari } = body;

    const yeniTeslim: OdevKaydi = {
      id: Date.now().toString(),
      ogrenciAdi: (ogrenciAdi || "İsimsiz").trim(),
      sinifGrup: sinifGrup || "Genel",
      avatar: avatar || "🦁",
      toplamSoru: toplamSoru || 0,
      dogruSayisi: dogruSayisi || 0,
      toplamHata: toplamHata || 0,
      gecenSureSaniye: gecenSureSaniye || 0,
      tamamlanmaTarihi: new Date().toLocaleString("tr-TR"),
      soruDetaylari: soruDetaylari || [],
    };

    globalStorage.__aktifOdevler.unshift(yeniTeslim);
    return NextResponse.json({ success: true, data: yeniTeslim });
  } catch {
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}
