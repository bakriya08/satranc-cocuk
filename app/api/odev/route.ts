import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisGet<T>(key: string, fallback: T): Promise<T> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return fallback;
  try {
    const res = await fetch(`${UPSTASH_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: "no-store",
    });
    const json = await res.json();
    if (json && json.result) {
      return typeof json.result === "string" ? JSON.parse(json.result) : json.result;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

async function redisSet(key: string, value: any): Promise<void> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return;
  try {
    await fetch(`${UPSTASH_URL}/set/${key}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(JSON.stringify(value)),
      cache: "no-store",
    });
  } catch {}
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const sorular = await redisGet<SoruItem[]>("odev_sorulari", VARSAYILAN_SORULAR);

  if (type === "sorular") {
    return NextResponse.json({ success: true, data: sorular });
  }

  const ogrenciler = await redisGet<OgrenciProfil[]>("kayitli_ogrenciler", []);
  if (type === "ogrenciler") {
    return NextResponse.json({ success: true, data: ogrenciler });
  }

  const aktifOdevler = await redisGet<OdevKaydi[]>("aktif_odevler", []);
  const arsivler = await redisGet<any[]>("arsiv_odevler", []);

  return NextResponse.json({
    success: true,
    data: {
      sorular,
      aktifOdevler,
      arsivSayisi: arsivler.length,
      ogrenciler,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // 1. ÖĞRENCİ KAYIT
    if (action === "ogrenciKayit") {
      const { adSoyad, sinifGrup, avatar, pin } = body;
      if (!adSoyad || !String(adSoyad).trim()) {
        return NextResponse.json({ success: false, message: "İsim gereklidir" }, { status: 400 });
      }

      const ogrenciler = await redisGet<OgrenciProfil[]>("kayitli_ogrenciler", []);
      const yeniOgrenci: OgrenciProfil = {
        id: Date.now().toString(),
        adSoyad: String(adSoyad).trim(),
        sinifGrup: String(sinifGrup || "Genel").trim(),
        avatar: String(avatar || "🦁"),
        pin: String(pin || "1234"),
        kayitTarihi: new Date().toLocaleDateString("tr-TR"),
      };

      const mevcutIdx = ogrenciler.findIndex(
        (o) => o.adSoyad.toLowerCase() === yeniOgrenci.adSoyad.toLowerCase()
      );
      if (mevcutIdx >= 0) {
        ogrenciler[mevcutIdx] = yeniOgrenci;
      } else {
        ogrenciler.push(yeniOgrenci);
      }

      await redisSet("kayitli_ogrenciler", ogrenciler);
      return NextResponse.json({ success: true, data: yeniOgrenci });
    }

    // 2. ÖĞRETMEN: PIN SIFIRLAMA
    if (action === "pinSifirla") {
      const { ogrenciId, yeniPin } = body;
      let ogrenciler = await redisGet<OgrenciProfil[]>("kayitli_ogrenciler", []);
      ogrenciler = ogrenciler.map((o) =>
        o.id === ogrenciId ? { ...o, pin: String(yeniPin || "1234") } : o
      );
      await redisSet("kayitli_ogrenciler", ogrenciler);
      return NextResponse.json({ success: true, message: "PIN başarıyla güncellendi!" });
    }

    // 3. ÖĞRETMEN: ÖĞRENCİ SİLME
    if (action === "ogrenciSil") {
      const { ogrenciId } = body;
      let ogrenciler = await redisGet<OgrenciProfil[]>("kayitli_ogrenciler", []);
      ogrenciler = ogrenciler.filter((o) => o.id !== ogrenciId);
      await redisSet("kayitli_ogrenciler", ogrenciler);
      return NextResponse.json({ success: true, message: "Öğrenci silindi!" });
    }

    // 4. YENİ SORU EKLEME
    if (action === "soruEkle") {
      const { title, fen, hint } = body;
      const sorular = await redisGet<SoruItem[]>("odev_sorulari", VARSAYILAN_SORULAR);
      const yeniId = sorular.length > 0 ? Math.max(...sorular.map((s) => s.id)) + 1 : 1;

      const yeniSoru: SoruItem = {
        id: yeniId,
        title: String(title || "").trim(),
        fen: String(fen || "").trim(),
        hint: String(hint || "").trim(),
      };
      sorular.push(yeniSoru);
      await redisSet("odev_sorulari", sorular);
      return NextResponse.json({ success: true, data: sorular });
    }

    // 5. SORU SİLME
    if (action === "soruSil") {
      const { id } = body;
      let sorular = await redisGet<SoruItem[]>("odev_sorulari", VARSAYILAN_SORULAR);
      sorular = sorular.filter((s) => s.id !== id);
      await redisSet("odev_sorulari", sorular);
      return NextResponse.json({ success: true, data: sorular });
    }

    // 6. HAFTAYI ARŞİVLE
    if (action === "haftayiArsivle") {
      const aktifOdevler = await redisGet<OdevKaydi[]>("aktif_odevler", []);
      if (aktifOdevler.length > 0) {
        const arsivler = await redisGet<any[]>("arsiv_odevler", []);
        arsivler.push({
          arsivTarihi: new Date().toLocaleString("tr-TR"),
          kayitlar: aktifOdevler,
        });
        await redisSet("arsiv_odevler", arsivler);
        await redisSet("aktif_odevler", []);
      }
      return NextResponse.json({ success: true, message: "Hafta arşivlendi!" });
    }

    // 7. ÖĞRENCİ ÖDEV TESLİMİ
    const { ogrenciAdi, sinifGrup, avatar, toplamSoru, dogruSayisi, toplamHata, gecenSureSaniye, soruDetaylari } = body;

    const aktifOdevler = await redisGet<OdevKaydi[]>("aktif_odevler", []);
    const yeniTeslim: OdevKaydi = {
      id: Date.now().toString(),
      ogrenciAdi: String(ogrenciAdi || "İsimsiz").trim(),
      sinifGrup: String(sinifGrup || "Genel"),
      avatar: String(avatar || "🦁"),
      toplamSoru: Number(toplamSoru) || 0,
      dogruSayisi: Number(dogruSayisi) || 0,
      toplamHata: Number(toplamHata) || 0,
      gecenSureSaniye: Number(gecenSureSaniye) || 0,
      tamamlanmaTarihi: new Date().toLocaleString("tr-TR"),
      soruDetaylari: Array.isArray(soruDetaylari) ? soruDetaylari : [],
    };

    aktifOdevler.unshift(yeniTeslim);
    await redisSet("aktif_odevler", aktifOdevler);

    return NextResponse.json({ success: true, data: yeniTeslim });
  } catch {
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}
