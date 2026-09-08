"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface InteraktifOrnek {
  id: number;
  karakter: string;
  karakterAdi: string;
  soruMetni: string;
  tahtaTipi: "baslangic" | "kaleYolu" | "filCapraz" | "atL" | "sahAdim" | "piyonIleri" | "matVurusu";
  secenekler: { id: string; sembol: string; aciklama: string; dogru: boolean }[];
  dogruMesaj: string;
}

interface KazanimDetay {
  kod: string;
  uniteId: number;
  uniteBaslik: string;
  baslik: string;
  resmiAciklama: string;
  ornekler: InteraktifOrnek[];
}

const KAZANIMLAR_VERISI: KazanimDetay[] = [
  {
    kod: "1.1.",
    uniteId: 1,
    uniteBaslik: "1. Satranç Oyunu, Tahtası ve Yönler",
    baslik: "Satranç oyununu ve tahtasını tanır.",
    resmiAciklama: "Satranç tahtasının kare şekli, yatay, dikey, çapraz hatları ve açık-koyu kareleri incelenir.",
    ornekler: [
      {
        id: 1,
        karakter: "🦁",
        karakterAdi: "Aslan Şakir",
        soruMetni: "Aslan Şakir tahtayı masaya koydu. Sağ alt köşedeki doğru karenin rengi hangisidir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "⬛", aciklama: "Koyu Kare", dogru: false },
          { id: "b", sembol: "⬜", aciklama: "Açık (Beyaz) Kare", dogru: true },
          { id: "c", sembol: "🔺", aciklama: "Üçgen", dogru: false },
        ],
        dogruMesaj: "Harikasın! 'Beyaz sağda' kuralını tahtada başarıyla buldun!",
      },
      {
        id: 2,
        karakter: "🐰",
        karakterAdi: "Tavşan Pamuk",
        soruMetni: "Pamuk 64 karelik satranç tahtasının şeklini inceliyor. Tahtanın geometri şekli nedir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "⚪", aciklama: "Daire", dogru: false },
          { id: "b", sembol: "⏹️", aciklama: "Kare Şekli", dogru: true },
          { id: "c", sembol: "⭐", aciklama: "Yıldız", dogru: false },
        ],
        dogruMesaj: "Süper! Satranç tahtası 64 eşit kareden oluşan dev bir karedir!",
      },
      {
        id: 3,
        karakter: "🦊",
        karakterAdi: "Dedektif Tilki",
        soruMetni: "Tahtanın köşesindeki ilk karede hangi renk zemin var?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "⬜", aciklama: "Açık Renk", dogru: true },
          { id: "b", sembol: "🟨", aciklama: "Sarı", dogru: false },
          { id: "c", sembol: "🟦", aciklama: "Mavi", dogru: false },
        ],
        dogruMesaj: "İpuçlarını topladın! Köşeler her zaman açık renkle başlar.",
      },
    ],
  },
  {
    kod: "1.2.",
    uniteId: 1,
    uniteBaslik: "1. Satranç Oyunu, Tahtası ve Yönler",
    baslik: "Satranç tahtasında nesneleri yatay ve dikey yönlerde hareket ettirir.",
    resmiAciklama: "Karelerden oluşan zeminde dikey (ileri-geri) ve yatay (yana) yön hareketleri yapılır.",
    ornekler: [
      {
        id: 1,
        karakter: "🚗",
        karakterAdi: "Şimşek Araba",
        soruMetni: "Araba tahta üzerinde dikey caddede ileri sürülecek. Hangi yönleri takip etmelidir?",
        tahtaTipi: "kaleYolu",
        secenekler: [
          { id: "a", sembol: "⬆️⬇️", aciklama: "Dikey Hat (İleri ve Geri)", dogru: true },
          { id: "b", sembol: "↗️", aciklama: "Sadece Çapraz", dogru: false },
          { id: "c", sembol: "🔄", aciklama: "Dönemeç", dogru: false },
        ],
        dogruMesaj: "Vınnn! Dikey hat üzerinde ileriye ve geriye doğru hareket ettin!",
      },
      {
        id: 2,
        karakter: "🐼",
        karakterAdi: "Panda Po",
        soruMetni: "Panda yatay (yana) yönde adım atıyor. Doğru yatay hat hangisidir?",
        tahtaTipi: "kaleYolu",
        secenekler: [
          { id: "a", sembol: "⬅️➡️", aciklama: "Yatay Hat (Sağa ve Sola)", dogru: true },
          { id: "b", sembol: "↕️", aciklama: "Sadece Dikey", dogru: false },
          { id: "c", sembol: "⚡", aciklama: "Şimşek", dogru: false },
        ],
        dogruMesaj: "Harika adımlar! Yatay yollarda sağa ve sola kayabilirsin!",
      },
      {
        id: 3,
        karakter: "🐻",
        karakterAdi: "Ayıcık Bobo",
        soruMetni: "Düz caddeler boyunca ilerleyen taşın takip ettiği hatlar ne ad alır?",
        tahtaTipi: "kaleYolu",
        secenekler: [
          { id: "a", sembol: "➕", aciklama: "Yatay ve Dikey Hatlar", dogru: true },
          { id: "b", sembol: "✖️", aciklama: "Sadece Çapraz", dogru: false },
          { id: "c", sembol: "🕳️", aciklama: "Çukur", dogru: false },
        ],
        dogruMesaj: "Nefis! Düz hatlar yatay ve dikey yollardır.",
      },
    ],
  },
  {
    kod: "1.3.",
    uniteId: 1,
    uniteBaslik: "1. Satranç Oyunu, Tahtası ve Yönler",
    baslik: "Satranç tahtasında nesneleri çapraz yönlerde hareket ettirir.",
    resmiAciklama: "Çapraz yön kavramı tahta üzerinde çizilen çizgilerle pekiştirilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🚀",
        karakterAdi: "Roket Ali",
        soruMetni: "Tahtada iki köşe arasında X harfi gibi uzanan çapraz yönün adı nedir?",
        tahtaTipi: "filCapraz",
        secenekler: [
          { id: "a", sembol: "❌", aciklama: "Çapraz Hat (Köşeden Köşeye)", dogru: true },
          { id: "b", sembol: "➕", aciklama: "Düz Hat", dogru: false },
          { id: "c", sembol: "⏹️", aciklama: "Kare", dogru: false },
        ],
        dogruMesaj: "Ateş! Çapraz patikada köşeden köşeye süzüldün!",
      },
      {
        id: 2,
        karakter: "🦜",
        karakterAdi: "Papağan Riki",
        soruMetni: "Çapraz hareket eden bir nesne tahtada hangi şekli çizer?",
        tahtaTipi: "filCapraz",
        secenekler: [
          { id: "a", sembol: "❌", aciklama: "Çarpı (X) Şekli", dogru: true },
          { id: "b", sembol: "➕", aciklama: "Artı Şekli", dogru: false },
          { id: "c", sembol: "⭕", aciklama: "Daire", dogru: false },
        ],
        dogruMesaj: "Riki çapraz patikadan uçarak tahtayı geçti!",
      },
      {
        id: 3,
        karakter: "🐱",
        karakterAdi: "Yavru Kedi Mırmır",
        soruMetni: "Çapraz yolda ilerleyen kedinin takip ettiği yön seçeneği hangisidir?",
        tahtaTipi: "filCapraz",
        secenekler: [
          { id: "a", sembol: "↗️↙️", aciklama: "Çapraz Yönler", dogru: true },
          { id: "b", sembol: "⬆️", aciklama: "Sadece İleri", dogru: false },
          { id: "c", sembol: "⬅️", aciklama: "Sadece Sola", dogru: false },
        ],
        dogruMesaj: "Miyav! Mırmır çapraz patikadan hedefine ulaştı!",
      },
    ],
  },
  {
    kod: "2.1.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Kale taşının hareketini uygular.",
    resmiAciklama: "Kale taşı tanıtılır, dümdüz ileri, geri ve yanlara hareket ettiği gösterilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🏰",
        karakterAdi: "Muhafız Kale",
        soruMetni: "Tahta üzerinde kalenin gidebileceği yolları gösteren ok şekli hangisidir?",
        tahtaTipi: "kaleYolu",
        secenekler: [
          { id: "a", sembol: "➕", aciklama: "Artı Şeklinde Düz Oklar", dogru: true },
          { id: "b", sembol: "❌", aciklama: "Sadece Çapraz", dogru: false },
          { id: "c", sembol: "🔀", aciklama: "Zikzak", dogru: false },
        ],
        dogruMesaj: "Harika! Kaleler artı biçiminde düz caddelerde kayar!",
      },
      {
        id: 2,
        karakter: "🤖",
        karakterAdi: "Demir Robot",
        soruMetni: "Kale yolundaki başka bir taşın üzerinden atlayabilir mi?",
        tahtaTipi: "kaleYolu",
        secenekler: [
          { id: "a", sembol: "❌", aciklama: "Hayır, Atlayamaz!", dogru: true },
          { id: "b", sembol: "✅", aciklama: "Evet, Atlar", dogru: false },
          { id: "c", sembol: "🛸", aciklama: "Uçar", dogru: false },
        ],
        dogruMesaj: "Doğru! Kale önü kapalıysa durmak zorundadır.",
      },
      {
        id: 3,
        karakter: "🦁",
        karakterAdi: "Cesur Aslan",
        soruMetni: "Sağlam kalenin puan değeri kaç puandır?",
        tahtaTipi: "kaleYolu",
        secenekler: [
          { id: "a", sembol: "🌟🌟🌟🌟🌟", aciklama: "5 Puan", dogru: true },
          { id: "b", sembol: "🌟", aciklama: "1 Puan", dogru: false },
          { id: "c", sembol: "🌟🌟🌟🌟🌟🌟🌟🌟🌟", aciklama: "9 Puan", dogru: false },
        ],
        dogruMesaj: "Bravo! Kale tam 5 puan gücündedir!",
      },
    ],
  },
  {
    kod: "2.2.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Fil taşının hareketini uygular.",
    resmiAciklama: "Fil taşının çapraz hareketleri tahta üzerinde gösterilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🐘",
        karakterAdi: "Uçan Fil Dumbo",
        soruMetni: "Fil tahtada hangi yönde hareket eder?",
        tahtaTipi: "filCapraz",
        secenekler: [
          { id: "a", sembol: "❌", aciklama: "Çarpı (Çapraz) Yönde", dogru: true },
          { id: "b", sembol: "➕", aciklama: "Düz Artı Yönde", dogru: false },
          { id: "c", sembol: "⭕", aciklama: "Daire", dogru: false },
        ],
        dogruMesaj: "Mükemmel! Filler tahtada çapraz süzülür.",
      },
      {
        id: 2,
        karakter: "🧙‍♂️",
        karakterAdi: "Sihirbaz Fil",
        soruMetni: "Beyaz karede başlayan bir fil oyun boyunca hangi renk karelerde kalır?",
        tahtaTipi: "filCapraz",
        secenekler: [
          { id: "a", sembol: "⬜", aciklama: "Sadece Beyaz Karelerde", dogru: true },
          { id: "b", sembol: "⬛", aciklama: "Siyah Kareye Geçer", dogru: false },
          { id: "c", sembol: "🌈", aciklama: "Tüm Renkler", dogru: false },
        ],
        dogruMesaj: "Sihirli kural! Fil başladığı rengi asla değiştirmez.",
      },
      {
        id: 3,
        karakter: "🦄",
        karakterAdi: "Tekboynuz Filo",
        soruMetni: "Filin puan değeri kaç puandır?",
        tahtaTipi: "filCapraz",
        secenekler: [
          { id: "a", sembol: "🪙🪙🪙", aciklama: "3 Puan", dogru: true },
          { id: "b", sembol: "🪙🪙🪙🪙🪙", aciklama: "5 Puan", dogru: false },
          { id: "c", sembol: "🪙", aciklama: "1 Puan", dogru: false },
        ],
        dogruMesaj: "Harika! Fil 3 puan değerinde hafif bir taştır.",
      },
    ],
  },
  {
    kod: "2.3.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Vezir taşının hareketini uygular.",
    resmiAciklama: "Vezirin hem kale hem fil gibi her yöne gidebildiği tahta üzerinde gösterilir.",
    ornekler: [
      {
        id: 1,
        karakter: "👸",
        karakterAdi: "Süper Prenses Vezir",
        soruMetni: "Vezir tahtada hangi yönlere gidebilir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🌟", aciklama: "Düz ve Çapraz (Her Yöne)", dogru: true },
          { id: "b", sembol: "➕", aciklama: "Sadece Düz", dogru: false },
          { id: "c", sembol: "❌", aciklama: "Sadece Çapraz", dogru: false },
        ],
        dogruMesaj: "Süper güç! Vezir hem düz hem çapraz her yere gidebilir!",
      },
      {
        id: 2,
        karakter: "🦸‍♀️",
        karakterAdi: "Kahraman Vezir",
        soruMetni: "Vezirin puan değeri kaç puandır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "👑👑👑👑👑👑👑👑👑", aciklama: "9 Puan (En Güçlü)", dogru: true },
          { id: "b", sembol: "👑👑👑", aciklama: "3 Puan", dogru: false },
          { id: "c", sembol: "👑", aciklama: "1 Puan", dogru: false },
        ],
        dogruMesaj: "Vooov! Vezir 9 piyon gücünde devasa bir güce sahiptir!",
      },
      {
        id: 3,
        karakter: "🧚‍♀️",
        karakterAdi: "Orman Perisi Vezir",
        soruMetni: "Tahtanın ortasında duran vezir aynı anda kaç farklı yöne bakabilir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "8️⃣", aciklama: "8 Farklı Yöne", dogru: true },
          { id: "b", sembol: "2️⃣", aciklama: "2 Yöne", dogru: false },
          { id: "c", sembol: "1️⃣", aciklama: "Tek Yön", dogru: false },
        ],
        dogruMesaj: "Mükemmel! Vezir tahtanın tüm kollarına hakimdir.",
      },
    ],
  },
  {
    kod: "2.4.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Şah taşının hareketini uygular.",
    resmiAciklama: "Şahın her yöne sadece 1 adım gidebildiği tahta üzerinde gösterilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🤴",
        karakterAdi: "Bilge Şah",
        soruMetni: "Şah tahtada bir kareden komşu kareye kaç adım atabilir?",
        tahtaTipi: "sahAdim",
        secenekler: [
          { id: "a", sembol: "1️⃣", aciklama: "Sadece 1 Adım", dogru: true },
          { id: "b", sembol: "5️⃣", aciklama: "5 Adım", dogru: false },
          { id: "c", sembol: "🔟", aciklama: "Sınırsız", dogru: false },
        ],
        dogruMesaj: "Çok doğru! Şah her yöne ama yalnızca 1 adım atar.",
      },
      {
        id: 2,
        karakter: "🦉",
        karakterAdi: "Bilge Baykuş",
        soruMetni: "Şah tehlike altındaki bir kareye (rakibin vurduğu yere) basabilir mi?",
        tahtaTipi: "sahAdim",
        secenekler: [
          { id: "a", sembol: "❌", aciklama: "Asla Basamaz!", dogru: true },
          { id: "b", sembol: "✅", aciklama: "Basabilir", dogru: false },
          { id: "c", sembol: "🤾", aciklama: "Atlar", dogru: false },
        ],
        dogruMesaj: "Akıllıca! Şah asla tehlikeli kareye adım atmaz.",
      },
      {
        id: 3,
        karakter: "🦁",
        karakterAdi: "Aslan Kral",
        soruMetni: "Şahın oyundaki puan değeri nedir?",
        tahtaTipi: "sahAdim",
        secenekler: [
          { id: "a", sembol: "♾️", aciklama: "Ölçülemez / Sonsuz (Oyunun Kalbi)", dogru: true },
          { id: "b", sembol: "1️⃣", aciklama: "1 Puan", dogru: false },
          { id: "c", sembol: "0️⃣", aciklama: "0 Puan", dogru: false },
        ],
        dogruMesaj: "Harika! Şah paha biçilemezdir, o mat olursa oyun biter.",
      },
    ],
  },
  {
    kod: "2.5.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "At taşının hareketini uygular.",
    resmiAciklama: "Atın L harfi şeklindeki zıplaması tahta üzerinde gösterilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🐴",
        karakterAdi: "Sevimli Tay Pony",
        soruMetni: "At tahtada hangi harf biçiminde zıplayarak dans eder?",
        tahtaTipi: "atL",
        secenekler: [
          { id: "a", sembol: "🇱", aciklama: "'L' Harfi Şeklinde", dogru: true },
          { id: "b", sembol: "➕", aciklama: "Artı Şeklinde", dogru: false },
          { id: "c", sembol: "❌", aciklama: "Çarpı Şeklinde", dogru: false },
        ],
        dogruMesaj: "Dıgıdık dıgıdık! At daima 'L' çizer.",
      },
      {
        id: 2,
        karakter: "🦘",
        karakterAdi: "Kanguru Zıpzıp",
        soruMetni: "Satranç tahtasında diğer taşların üzerinden atlayabilen TEK taş hangisidir?",
        tahtaTipi: "atL",
        secenekler: [
          { id: "a", sembol: "♞", aciklama: "Sevimli At", dogru: true },
          { id: "b", sembol: "♜", aciklama: "Kale", dogru: false },
          { id: "c", sembol: "♝", aciklama: "Fil", dogru: false },
        ],
        dogruMesaj: "Hop! At, önü dolu olsa bile üzerinden zıplayabilir.",
      },
      {
        id: 3,
        karakter: "🎠",
        karakterAdi: "Lunapark Atı",
        soruMetni: "Atın puan değeri kaç puandır?",
        tahtaTipi: "atL",
        secenekler: [
          { id: "a", sembol: "🪙🪙🪙", aciklama: "3 Puan", dogru: true },
          { id: "b", sembol: "🪙🪙🪙🪙🪙", aciklama: "5 Puan", dogru: false },
          { id: "c", sembol: "🪙", aciklama: "1 Puan", dogru: false },
        ],
        dogruMesaj: "Tebrikler! At 3 puan değerinde çevik bir taştır.",
      },
    ],
  },
  {
    kod: "3.1.",
    uniteId: 3,
    uniteBaslik: "3. Satrançta Şah Tehdidi ve Mat",
    baslik: "Şahın, oyun için önemini açıklar.",
    resmiAciklama: "Şahın oyunun kalbi olduğu vurgulanır.",
    ornekler: [
      {
        id: 1,
        karakter: "🎯",
        karakterAdi: "Hedef",
        soruMetni: "Satranç oyununda asıl ele geçirilmek istenen hedef kimdir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🤴", aciklama: "Bilge Şah", dogru: true },
          { id: "b", sembol: "♟️", aciklama: "Piyon", dogru: false },
          { id: "c", sembol: "♝", aciklama: "Fil", dogru: false },
        ],
        dogruMesaj: "Tam isabet! Satranç şahı koruma ve mat etme oyunudur.",
      },
      {
        id: 2,
        karakter: "🛑",
        karakterAdi: "Dur",
        soruMetni: "Şah mat olduğunda oyun biter mi?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🏁", aciklama: "Evet, Oyun Sona Erer", dogru: true },
          { id: "b", sembol: "⏳", aciklama: "Sonsuza Kadar Sürer", dogru: false },
          { id: "c", sembol: "🔁", aciklama: "Başa Döner", dogru: false },
        ],
        dogruMesaj: "Bayrak sallandı! Şah mat olunca maç biter.",
      },
      {
        id: 3,
        karakter: "👑",
        karakterAdi: "Kral",
        soruMetni: "Şahı korumak satrançta neden en önemli kuraldır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "❤️", aciklama: "Çünkü O Oyunun Kalbidir", dogru: true },
          { id: "b", sembol: "🗑️", aciklama: "Değersizdir", dogru: false },
          { id: "c", sembol: "🎈", aciklama: "Süs gibidir", dogru: false },
        ],
        dogruMesaj: "Kesinlikle! Şah düşerse krallık düşer.",
      },
    ],
  },
  {
    kod: "3.2.",
    uniteId: 3,
    uniteBaslik: "3. Satrançta Şah Tehdidi ve Mat",
    baslik: "Şah çeker.",
    resmiAciklama: "Rakip şaha saldırı durumu işlenir.",
    ornekler: [
      {
        id: 1,
        karakter: "📢",
        karakterAdi: "Haberci",
        soruMetni: "Taşımız doğrudan rakip şaha saldırdığında ne bağırırız?",
        tahtaTipi: "matVurusu",
        secenekler: [
          { id: "a", sembol: "📣", aciklama: "'ŞAH!'", dogru: true },
          { id: "b", sembol: "🤫", aciklama: "Sessizlik", dogru: false },
          { id: "c", sembol: "😴", aciklama: "Uyku", dogru: false },
        ],
        dogruMesaj: "ŞAH! Rakip hemen önlem almak zorundadır.",
      },
      {
        id: 2,
        karakter: "🏹",
        karakterAdi: "Okçu",
        soruMetni: "Şah çekilen bir şah tehlike altında mıdır?",
        tahtaTipi: "matVurusu",
        secenekler: [
          { id: "a", sembol: "⚠️", aciklama: "Evet, Tehdit Altındadır", dogru: true },
          { id: "b", sembol: "🏖️", aciklama: "Tatildedir", dogru: false },
          { id: "c", sembol: "🎉", aciklama: "Güvendedir", dogru: false },
        ],
        dogruMesaj: "Tehlike sinyali! Şah çekildiyse korunmalıdır.",
      },
      {
        id: 3,
        karakter: "⚡",
        karakterAdi: "Şimşek",
        soruMetni: "Şah çeken taş rakip tarafından alınabilir mi?",
        tahtaTipi: "matVurusu",
        secenekler: [
          { id: "a", sembol: "⚔️", aciklama: "Uygunsa Alınabilir", dogru: true },
          { id: "b", sembol: "❌", aciklama: "Asla Alınamaz", dogru: false },
          { id: "c", sembol: "🔒", aciklama: "Kilitlenir", dogru: false },
        ],
        dogruMesaj: "Evet! Tehdit eden taş vurularak şah kurtarılabilir.",
      },
    ],
  },
];

function SatrançTahtasiGorseli({ tip }: { tip: string }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "260px",
        margin: "12px auto",
        backgroundColor: "#292524",
        padding: "8px",
        borderRadius: "14px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <svg viewBox="0 0 200 200" style={{ width: "100%", height: "auto", borderRadius: "8px" }}>
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => {
            const isWhite = (row + col) % 2 === 0;
            return (
              <rect
                key={`${row}-${col}`}
                x={col * 25}
                y={row * 25}
                width={25}
                height={25}
                fill={isWhite ? "#fef08a" : "#ca8a04"}
              />
            );
          })
        )}

        {tip === "baslangic" && (
          <>
            <text x="12" y="145" fontSize="16" textAnchor="middle">♖</text>
            <text x="100" y="105" fontSize="18" textAnchor="middle" fill="#dc2626">♔</text>
            <rect x="175" y="175" width="25" height="25" fill="#22c55e" opacity="0.7" />
            <text x="187" y="192" fontSize="12" textAnchor="middle" fill="#ffffff">✔</text>
          </>
        )}

        {tip === "kaleYolu" && (
          <>
            <text x="100" y="105" fontSize="18" textAnchor="middle">♜</text>
            <line x1="100" y1="100" x2="100" y2="25" stroke="#ef4444" strokeWidth="4" strokeDasharray="4" />
            <line x1="100" y1="100" x2="100" y2="175" stroke="#ef4444" strokeWidth="4" strokeDasharray="4" />
            <line x1="100" y1="100" x2="25" y2="100" stroke="#ef4444" strokeWidth="4" strokeDasharray="4" />
            <line x1="100" y1="100" x2="175" y2="100" stroke="#ef4444" strokeWidth="4" strokeDasharray="4" />
          </>
        )}

        {tip === "filCapraz" && (
          <>
            <text x="100" y="105" fontSize="18" textAnchor="middle">♝</text>
            <line x1="100" y1="100" x2="25" y2="25" stroke="#3b82f6" strokeWidth="4" strokeDasharray="4" />
            <line x1="100" y1="100" x2="175" y2="175" stroke="#3b82f6" strokeWidth="4" strokeDasharray="4" />
            <line x1="100" y1="100" x2="25" y2="175" stroke="#3b82f6" strokeWidth="4" strokeDasharray="4" />
            <line x1="100" y1="100" x2="175" y2="25" stroke="#3b82f6" strokeWidth="4" strokeDasharray="4" />
          </>
        )}

        {tip === "atL" && (
          <>
            <text x="100" y="105" fontSize="18" textAnchor="middle">♞</text>
            <path d="M 100 100 L 100 50 L 125 50" stroke="#a855f7" strokeWidth="4" fill="none" />
            <circle cx="125" cy="50" r="6" fill="#22c55e" />
          </>
        )}

        {tip === "sahAdim" && (
          <>
            <text x="100" y="105" fontSize="18" textAnchor="middle">♚</text>
            <circle cx="100" cy="80" r="4" fill="#ef4444" />
            <circle cx="120" cy="80" r="4" fill="#ef4444" />
            <circle cx="120" cy="100" r="4" fill="#ef4444" />
            <circle cx="100" cy="120" r="4" fill="#ef4444" />
            <circle cx="80" cy="120" r="4" fill="#ef4444" />
            <circle cx="80" cy="100" r="4" fill="#ef4444" />
          </>
        )}

        {tip === "piyonIleri" && (
          <>
            <text x="100" y="125" fontSize="18" textAnchor="middle">♟️</text>
            <line x1="100" y1="110" x2="100" y2="60" stroke="#eab308" strokeWidth="4" />
            <polygon points="100,50 95,65 105,65" fill="#eab308" />
          </>
        )}

        {tip === "matVurusu" && (
          <>
            <text x="100" y="105" fontSize="18" textAnchor="middle">👑</text>
            <text x="100" y="55" fontSize="16" textAnchor="middle" fill="#ef4444">💥</text>
            <rect x="87" y="37" width="25" height="25" fill="none" stroke="#ef4444" strokeWidth="3" />
          </>
        )}
      </svg>
      <div style={{ fontSize: "10px", color: "#a855f7", fontWeight: "bold", marginTop: "4px" }}>
        ♟️ İnteraktif Satranç Tahtası & Taktik Hattı
      </div>
    </div>
  );
}

export default function DerslerPage() {
  const [seciliKod, setSeciliKod] = useState<string>("1.1.");
  const [tamamlananKazanimlar, setTamamlananKazanimlar] = useState<string[]>([]);
  const [ornekCevaplari, setOrnekCevaplari] = useState<Record<number, string>>({});

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlKod = urlParams.get("kod");
      if (urlKod && KAZANIMLAR_VERISI.some((k) => k.kod === urlKod)) {
        setSeciliKod(urlKod);
      }
      const kayitli = localStorage.getItem("mebKazanımTakip");
      if (kayitli) setTamamlananKazanimlar(JSON.parse(kayitli));
    } catch {}
  }, []);

  const aktifKazanim =
    KAZANIMLAR_VERISI.find((k) => k.kod === seciliKod) || KAZANIMLAR_VERISI[0];

  function konus(metin: string) {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const ses = new SpeechSynthesisUtterance(metin);
      ses.lang = "tr-TR";
      ses.rate = 0.9;
      window.speechSynthesis.speak(ses);
    }
  }

  function handleKazanimDegistir(yeniKod: string) {
    setSeciliKod(yeniKod);
    setOrnekCevaplari({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCevapSec(ornekId: number, secenekId: string) {
    setOrnekCevaplari((onceki) => ({
      ...onceki,
      [ornekId]: secenekId,
    }));
  }

  function handleTamamlaToggle(kod: string) {
    let yeni: string[];
    if (tamamlananKazanimlar.includes(kod)) {
      yeni = tamamlananKazanimlar.filter((k) => k !== kod);
    } else {
      yeni = [...tamamlananKazanimlar, kod];
    }
    setTamamlananKazanimlar(yeni);
    try {
      localStorage.setItem("mebKazanımTakip", JSON.stringify(yeni));
    } catch {}
  }

  const mevcutIndex = KAZANIMLAR_VERISI.findIndex((k) => k.kod === aktifKazanim.kod);
  const oncekiKazanim = mevcutIndex > 0 ? KAZANIMLAR_VERISI[mevcutIndex - 1] : null;
  const sonrakiKazanim =
    mevcutIndex < KAZANIMLAR_VERISI.length - 1 ? KAZANIMLAR_VERISI[mevcutIndex + 1] : null;

  return (
    <div
      style={{
        maxWidth: "960px",
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "24px",
        border: "3px solid #bae6fd",
        boxShadow: "0 10px 30px rgba(2, 132, 199, 0.1)",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          paddingBottom: "16px",
          borderBottom: "2px dashed #e2e8f0",
          marginBottom: "20px",
        }}
      >
        <div>
          <span
            style={{
              display: "inline-block",
              padding: "4px 10px",
              backgroundColor: "#e0f2fe",
              color: "#0369a1",
              borderRadius: "10px",
              fontSize: "11px",
              fontWeight: "900",
              marginBottom: "4px",
            }}
          >
            📚 {aktifKazanim.uniteBaslik}
          </span>
          <h1 style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
            🎯 {aktifKazanim.kod} {aktifKazanim.baslik}
          </h1>
        </div>

        <select
          value={aktifKazanim.kod}
          onChange={(e) => handleKazanimDegistir(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "12px",
            border: "2px solid #0284c7",
            backgroundColor: "#ffffff",
            color: "#0369a1",
            fontWeight: "bold",
            fontSize: "12px",
            cursor: "pointer",
            maxWidth: "280px",
          }}
        >
          {KAZANIMLAR_VERISI.map((k, index) => (
            <option key={k.kod} value={k.kod}>
              {index + 1}. {tamamlananKazanimlar.includes(k.kod) ? "✅ " : "⚪ "} {k.kod} {k.baslik}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          backgroundColor: "#f8fafc",
          border: "2px solid #e2e8f0",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "11px", fontWeight: "900", color: "#0284c7", marginBottom: "4px" }}>
            📖 Resmi Kazanım Açıklaması:
          </div>
          <p style={{ fontSize: "13px", lineHeight: "1.6", color: "#334155", margin: 0 }}>
            {aktifKazanim.resmiAciklama}
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleTamamlaToggle(aktifKazanim.kod)}
          style={{
            padding: "8px 16px",
            backgroundColor: tamamlananKazanimlar.includes(aktifKazanim.kod)
              ? "#16a34a"
              : "#0284c7",
            color: "#ffffff",
            borderRadius: "12px",
            border: "none",
            fontWeight: "900",
            fontSize: "12px",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          {tamamlananKazanimlar.includes(aktifKazanim.kod)
            ? "✨ Kazanım Tamamlandı"
            : "⚪ Kazanımı Tamamla"}
        </button>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <span style={{ fontSize: "28px" }}>♟️🗺️🔊</span>
          <h2 style={{ fontSize: "16px", fontWeight: "900", color: "#1e293b", margin: "4px 0" }}>
            Satranç Tahtası Üzerinde Örnek Görevler
          </h2>
          <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
            Soruları dinlemek için hoparlör (🔊) butonuna tıklayabilirsin!
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {aktifKazanim.ornekler.map((ornek, idx) => {
            const secilenSecenekId = ornekCevaplari[ornek.id];
            const secilenSecenek = ornek.secenekler.find((s) => s.id === secilenSecenekId);
            const dogruMu = secilenSecenek?.dogru === true;

            return (
              <div
                key={ornek.id}
                style={{
                  backgroundColor: "#fffdf9",
                  borderRadius: "18px",
                  border: "2px solid #fed7aa",
                  padding: "16px 20px",
                  boxShadow: "0 4px 12px rgba(251, 146, 60, 0.08)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "28px" }}>{ornek.karakter}</span>
                      <div style={{ fontSize: "12px", fontWeight: "900", color: "#c2410c" }}>
                        {idx + 1}. Görev: {ornek.karakterAdi}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => konus(`${ornek.karakterAdi} soruyor: ${ornek.soruMetni}`)}
                      style={{
                        padding: "6px 10px",
                        backgroundColor: "#fef3c7",
                        border: "1px solid #f59e0b",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#b45309",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                      title="Soruyu Sesli Dinle"
                    >
                      🔊 Dinle
                    </button>
                  </div>

                  <div style={{ fontSize: "13px", fontWeight: "bold", color: "#1e293b", marginBottom: "12px" }}>
                    {ornek.soruMetni}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {ornek.secenekler.map((s) => {
                      const secili = secilenSecenekId === s.id;
                      let bgColor = "#ffffff";
                      let borderColor = "#cbd5e1";
                      if (secili) {
                        bgColor = s.dogru ? "#dcfce7" : "#fee2e2";
                        borderColor = s.dogru ? "#22c55e" : "#ef4444";
                      }

                      return (
                        <div key={s.id} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <button
                            type="button"
                            onClick={() => handleCevapSec(ornek.id, s.id)}
                            style={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 12px",
                              backgroundColor: bgColor,
                              border: `2px solid ${borderColor}`,
                              borderRadius: "10px",
                              cursor: "pointer",
                              textAlign: "left",
                              fontWeight: "bold",
                              fontSize: "12px",
                              color: "#334155",
                            }}
                          >
                            <span style={{ fontSize: "18px" }}>{s.sembol}</span>
                            <span>{s.aciklama}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => konus(s.aciklama)}
                            style={{
                              padding: "8px",
                              backgroundColor: "#f8fafc",
                              border: "1px solid #cbd5e1",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                            title="Şıkkı Sesli Dinle"
                          >
                            🔊
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {secilenSecenekId && (
                    <div
                      style={{
                        marginTop: "10px",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        backgroundColor: dogruMu ? "#f0fdf4" : "#fef2f2",
                        border: dogruMu ? "1px solid #86efac" : "1px solid #fca5a5",
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: dogruMu ? "#15803d" : "#b91c1c",
                      }}
                    >
                      {dogruMu ? `🎉 ${ornek.dogruMesaj}` : "❌ Yanlış! Tahta üzerindeki ipucunu tekrar incele."}
                    </div>
                  )}
                </div>

                <div>
                  <SatrançTahtasiGorseli tip={ornek.tahtaTipi} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          paddingTop: "16px",
          borderTop: "2px dashed #e2e8f0",
        }}
      >
        {oncekiKazanim ? (
          <button
            type="button"
            onClick={() => handleKazanimDegistir(oncekiKazanim.kod)}
            style={{
              padding: "8px 14px",
              backgroundColor: "#f1f5f9",
              color: "#334155",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              fontWeight: "bold",
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            ⬅️ Önceki Kazanım
          </button>
        ) : (
          <div />
        )}

        <div style={{ display: "flex", gap: "8px" }}>
          <Link
            href="/masallar"
            style={{
              padding: "8px 14px",
              backgroundColor: "#ec4899",
              color: "#ffffff",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "11px",
            }}
          >
            ✨ Masallara Git
          </Link>
          <Link
            href="/odev"
            style={{
              padding: "8px 14px",
              backgroundColor: "#ef4444",
              color: "#ffffff",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "11px",
            }}
          >
            📚 Ödevlere Git
          </Link>
        </div>

        {sonrakiKazanim ? (
          <button
            type="button"
            onClick={() => handleKazanimDegistir(sonrakiKazanim.kod)}
            style={{
              padding: "8px 14px",
              backgroundColor: "#0284c7",
              color: "#ffffff",
              borderRadius: "12px",
              border: "none",
              fontWeight: "bold",
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            Sonraki Kazanım ➡️
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
