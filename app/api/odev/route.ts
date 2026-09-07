import { NextResponse } from "next/server";

export interface OdevKaydi {
  id: string;
  ogrenciAdi: string;
  toplamSoru: number;
  dogruSayisi: number;
  hataliHamleler: number;
  tamamlanmaTarihi: string;
  durum: "Tamamlandı" | "Kısmi";
}

// Global bellek deposu (Gelişmiş veritabanı gerektirmeden çalışır)
const globalOdevler: OdevKaydi[] = (globalThis as any).__odevKayitlari || [];
(globalThis as any).__odevKayitlari = globalOdevler;

// Öğretmen panelinin sonuçları çekmesi için
export async function GET() {
  return NextResponse.json({ success: true, data: globalOdevler });
}

// Öğrenci ödevi bitirince sonucun kaydedilmesi için
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ogrenciAdi, toplamSoru, dogruSayisi, hataliHamleler } = body;

    if (!ogrenciAdi || ogrenciAdi.trim() === "") {
      return NextResponse.json({ success: false, message: "İsim gerekli" }, { status: 400 });
    }

    const yeniKayit: OdevKaydi = {
      id: Date.now().toString(),
      ogrenciAdi: ogrenciAdi.trim(),
      toplamSoru: toplamSoru || 5,
      dogruSayisi: dogruSayisi || 0,
      hataliHamleler: hataliHamleler || 0,
      tamamlanmaTarihi: new Date().toLocaleString("tr-TR"),
      durum: dogruSayisi === toplamSoru ? "Tamamlandı" : "Kısmi",
    };

    globalOdevler.unshift(yeniKayit);

    return NextResponse.json({ success: true, data: yeniKayit });
  } catch {
    return NextResponse.json({ success: false, message: "Hata oluştu" }, { status: 500 });
  }
}

// Öğretmenin listeyi sıfırlayabilmesi için
export async function DELETE() {
  globalOdevler.length = 0;
  return NextResponse.json({ success: true, message: "Liste temizlendi" });
}
