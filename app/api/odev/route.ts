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

export interface OgretmenProfil {
  id: string;
  adSoyad: string;
  unvan: string;
  sifre: string;
  rol: "yonetici" | "ogretmen";
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

const VARSAYILAN_OGRETMENLER: OgretmenProfil[] = [
  {
    id: "admin-1",
    adSoyad: "Yönetici Öğretmen",
    unvan: "Baş Antrenör",
    sifre: "satranc123",
    rol: "yonetici",
  },
];

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
  if (type === "sorular") return NextResponse.json({ success: true, data: sorular });

  const ogrenciler = await redisGet<OgrenciProfil[]>("kayitli_ogrenciler", []);
  if (type === "ogrenciler") return NextResponse.json({ success: true, data: ogrenciler });

  const ogretmenler = await redisGet<OgretmenProfil[]>("kayitli_ogretmenler", VARSAYILAN_OGRETMENLER);
  const aktifOdevler = await redisGet<OdevKaydi[]>("aktif_odevler", []);
  const arsivler = await redisGet<any[]>("arsiv_odevler", []);

  return NextResponse.json({
    success: true,
    data: {
      sorular,
      aktifOdevler,
      arsivSayisi: arsivler.length,
      ogrenciler,
      ogretmenler,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // ÖĞRETMEN GİRİŞ KONTROLÜ
    if (action === "ogretmenGiris") {
      const { sifre } = body;
      const ogretmenler = await redisGet<OgretmenProfil[]>("kayitli_ogretmenler", VARSAYILAN_OGRETMENLER);
      const bulunan = ogretmenler.find((o) => o.sifre === String(sifre).trim());

      if (bulunan || sifre === "satranc123") {
        return NextResponse.json({
          success: true,
          data: bulunan || { id: "admin", adSoyad: "Öğretmen", unvan: "Eğitmen", rol: "yonetici" },
        });
      }
      return NextResponse.json({ success: false, message: "Hatalı şifre!" }, { status: 401 });
    }

    // YENİ ÖĞRETMEN EKLEME
    if (action === "ogretmenEkle") {
      const { adSoyad, unvan, sifre } = body;
      if (!adSoyad || !sifre) {
        return NextResponse.json({ success: false, message: "İsim ve şifre zorunludur" }, { status: 400 });
      }
      const ogretmenler = await redisGet<OgretmenProfil[]>("kayitli_ogretmenler", VARSAYILAN_OGRETMENLER);
      const yeni: OgretmenProfil = {
        id: Date.now().toString(),
        adSoyad: String(adSoyad).trim(),
        unvan: String(unvan || "Satranç Eğitmeni").trim(),
        sifre: String(sifre).trim(),
        rol: "ogretmen",
      };
      ogretmenler.push(yeni);
      await redisSet("kayitli_ogretmenler", ogretmenler);
      return NextResponse.json({ success: true, data: ogretmenler });
    }

    // ÖĞRETMEN SİLME
    if (action === "ogretmenSil") {
      const { id } = body;
      let ogretmenler = await redisGet<OgretmenProfil[]>("kayitli_ogretmenler", VARSAYILAN_OGRETMENLER);
      ogretmenler = ogretmenler.filter((o) => o.id !== id);
      await redisSet("kayitli_ogretmenler", ogretmenler);
      return NextResponse.json({ success: true, data: ogretmenler });
    }

    // ÖĞRENCİ KAYIT
    if (action === "ogrenciKayit") {
      const { adSoyad, sinifGrup, avatar, pin } = body;
      const ogrenciler = await redisGet<OgrenciProfil[]>("kayitli_ogrenciler", []);
      const yeniOgrenci: OgrenciProfil = {
        id: Date.now().toString(),
        adSoyad: String(adSoyad).trim(),
        sinifGrup: String(sinifGrup || "Genel").trim(),
        avatar: String(avatar || "🦁"),
        pin: String(pin || "1234"),
        kayitTarihi: new Date().toLocaleDateString("tr-TR"),
      };
      ogrenciler.push(yeniOgrenci);
      await redisSet("kayitli_ogrenciler", ogrenciler);
      return NextResponse.json({ success: true, data: yeniOgrenci });
    }

    // PIN SIFIRLAMA
    if (action === "pinSifirla") {
      const { ogrenciId, yeniPin } = body;
      let ogrenciler = await redisGet<OgrenciProfil[]>("kayitli_ogrenciler", []);
      ogrenciler = ogrenciler.map((o) => (o.id === ogrenciId ? { ...o, pin: String(yeniPin || "1234") } : o));
      await redisSet("kayitli_ogrenciler", ogrenciler);
      return NextResponse.json({ success: true });
    }

    // ÖĞRENCİ SİLME
    if (action === "ogrenciSil") {
      const { ogrenciId } = body;
      let ogrenciler = await redisGet<OgrenciProfil[]>("kayitli_ogrenciler", []);
      ogrenciler = ogrenciler.filter((o) => o.id !== ogrenciId);
      await redisSet("kayitli_ogrenciler", ogrenciler);
      return NextResponse.json({ success: true });
    }

    // SORU EKLEME / SİLME
    if (action === "soruEkle") {
      const { title, fen, hint } = body;
      const sorular = await redisGet<SoruItem[]>("odev_sorulari", VARSAYILAN_SORULAR);
      const yeniId = sorular.length > 0 ? Math.max(...sorular.map((s) => s.id)) + 1 : 1;
      sorular.push({ id: yeniId, title: String(title), fen: String(fen), hint: String(hint) });
      await redisSet("odev_sorulari", sorular);
      return NextResponse.json({ success: true, data: sorular });
    }

    if (action === "soruSil") {
      const { id } = body;
      let sorular = await redisGet<SoruItem[]>("odev_sorulari", VARSAYILAN_SORULAR);
      sorular = sorular.filter((s) => s.id !== id);
      await redisSet("odev_sorulari", sorular);
      return NextResponse.json({ success: true, data: sorular });
    }

    // ARŞİVLEME
    if (action === "haftayiArsivle") {
      const aktif = await redisGet<OdevKaydi[]>("aktif_odevler", []);
      if (aktif.length > 0) {
        const arsiv = await redisGet<any[]>("arsiv_odevler", []);
        arsiv.push({ tarih: new Date().toLocaleString("tr-TR"), kayitlar: aktif });
        await redisSet("arsiv_odevler", arsiv);
        await redisSet("aktif_odevler", []);
      }
      return NextResponse.json({ success: true });
    }

    // ÖDEV TESLİMİ
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
