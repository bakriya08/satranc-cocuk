import { NextResponse } from "next/server";

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
  toplamSoru: number;
  dogruSayisi: number;
  toplamHata: number;
  gecenSureSaniye: number;
  tamamlanmaTarihi: string;
  soruDetaylari: SoruAnalizItem[];
}

// Varsayılan Başlangıç Soruları
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

// Global Veri Havuzu
const globalStorage = (globalThis as any);
if (!globalStorage.__odevSorulari) globalStorage.__odevSorulari = [...VARSAYILAN_SORULAR];
if (!globalStorage.__aktifOdevler) globalStorage.__aktifOdevler = [];
if (!globalStorage.__arsivlenmisOdevler) globalStorage.__arsivlenmisOdevler = [];

// GET: Soruları ve kayıtları getir
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "sorular") {
    return NextResponse.json({ success: true, data: globalStorage.__odevSorulari });
  }

  return NextResponse.json({
    success: true,
    data: {
      sorular: globalStorage.__odevSorulari,
      aktifOdevler: globalStorage.__aktifOdevler,
      arsivSayisi: globalStorage.__arsivlenmisOdevler.length,
    },
  });
}

// POST: Öğrenci teslimi VEYA Öğretmen soru ekleme VEYA Arşivleme
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // 1. Yeni Soru Ekleme
    if (action === "soruEkle") {
      const { title, fen, hint } = body;
      if (!fen || !title) {
        return NextResponse.json({ success: false, message: "FEN ve başlık zorunludur" }, { status: 400 });
      }
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

    // 2. Soru Silme
    if (action === "soruSil") {
      const { id } = body;
      globalStorage.__odevSorulari = globalStorage.__odevSorulari.filter((s: SoruItem) => s.id !== id);
      return NextResponse.json({ success: true, data: globalStorage.__odevSorulari });
    }

    // 3. Soruları Sıfırlama (Varsayılana dön)
    if (action === "sorulariSifirla") {
      globalStorage.__odevSorulari = [...VARSAYILAN_SORULAR];
      return NextResponse.json({ success: true, data: globalStorage.__odevSorulari });
    }

    // 4. Haftayı Arşivle / Yeni Hafta Başlat
    if (action === "haftayiArsivle") {
      if (globalStorage.__aktifOdevler.length > 0) {
        globalStorage.__arsivlenmisOdevler.push({
          arsivTarihi: new Date().toLocaleString("tr-TR"),
          kayitlar: [...globalStorage.__aktifOdevler],
        });
        globalStorage.__aktifOdevler = [];
      }
      return NextResponse.json({ success: true, message: "Hafta arşivlendi, yeni hafta başladı!" });
    }

    // 5. Öğrenci Ödev Teslimi (Varsayılan POST)
    const { ogrenciAdi, toplamSoru, dogruSayisi, toplamHata, gecenSureSaniye, soruDetaylari } = body;

    if (!ogrenciAdi || ogrenciAdi.trim() === "") {
      return NextResponse.json({ success: false, message: "Öğrenci adı gerekli" }, { status: 400 });
    }

    const yeniTeslim: OdevKaydi = {
      id: Date.now().toString(),
      ogrenciAdi: ogrenciAdi.trim(),
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
