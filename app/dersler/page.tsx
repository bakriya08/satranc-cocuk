"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface InteraktifOrnek {
  id: number;
  karakter: string;
  karakterAdi: string;
  soruMetni: string;
  tahtaTipi: "baslangic" | "kaleYolu" | "filCapraz" | "atL" | "sahAdim" | "piyonIleri" | "matVurusu";
  okYonu?: "duz" | "capraz" | "lSekli" | "etraf";
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
    kod: "ST.OÖ. 1.1.",
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
    kod: "ST.OÖ. 1.2.",
    uniteId: 1,
    uniteBaslik: "1. Satranç Oyunu, Tahtası ve Yönler",
    baslik: "Satranç tahtasında nesneleri yatay ve dikey yönlerde hareket ettirir.",
    resmiAciklama: "Karelerden oluşan zeminde dikey (ileri-geri) ve yatay (yana) yön hareketleri yapılır.",
    ornekler: [
      {
        id: 1,
        karakter: "🚗",
        karakterAdi: "Şimşek Araba",
        soruMetni: "Araba tahta üzerinde dikey caddede ileri sürülecek. Hangi ok yönünü göstermelidir?",
        tahtaTipi: "kaleYolu",
        okYonu: "duz",
        secenekler: [
          { id: "a", sembol: "⬆️", aciklama: "Dikey İleri Oku", dogru: true },
          { id: "b", sembol: "↗️", aciklama: "Çapraz Ok", dogru: false },
          { id: "c", sembol: "🔄", aciklama: "Dönemeç", dogru: false },
        ],
        dogruMesaj: "Vınnn! Dikey hat üzerinde ileriye doğru hareket ettin!",
      },
      {
        id: 2,
        karakter: "🐼",
        karakterAdi: "Panda Po",
        soruMetni: "Panda yatay (yana) yönde adım atıyor. Doğru yatay ok hangisidir?",
        tahtaTipi: "kaleYolu",
        okYonu: "duz",
        secenekler: [
          { id: "a", sembol: "➡️", aciklama: "Yatay Sağa Ok", dogru: true },
          { id: "b", sembol: "⬇️", aciklama: "Aşağı", dogru: false },
          { id: "c", sembol: "⚡", aciklama: "Şimşek", dogru: false },
        ],
        dogruMesaj: "Harika adımlar! Yatay yollarda sağa ve sola kayabilirsin!",
      },
      {
        id: 3,
        karakter: "🐻",
        karakterAdi: "Ayıcık Bobo",
        soruMetni: "Düz caddeler boyunca ilerleyen taşın takip ettiği hat ne ad alır?",
        tahtaTipi: "kaleYolu",
        secenekler: [
          { id: "a", sembol: "➕", aciklama: "Düz / Yatay-Dikey Hat", dogru: true },
          { id: "b", sembol: "✖️", aciklama: "Sadece Çapraz", dogru: false },
          { id: "c", sembol: "🕳️", aciklama: "Çukur", dogru: false },
        ],
        dogruMesaj: "Nefis! Düz hatlar yatay ve dikey yollardır.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 1.3.",
    uniteId: 1,
    uniteBaslik: "1. Satranç Oyunu, Tahtası ve Yönler",
    baslik: "Satranç tahtasında nesneleri çapraz yönlerde hareket ettirir.",
    resmiAciklama: "Çapraz yön kavramı tahta üzerinde çizilen çizgilerle pekiştirilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🚀",
        karakterAdi: "Roket Ali",
        soruMetni: "Tahtada iki köşe arasında X harfi gibi uzanan yönün adı nedir?",
        tahtaTipi: "filCapraz",
        okYonu: "capraz",
        secenekler: [
          { id: "a", sembol: "↗️", aciklama: "Çapraz Hat", dogru: true },
          { id: "b", sembol: "⬆️", aciklama: "Düz Hat", dogru: false },
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
        soruMetni: "Çapraz yönlü ok işaretine tıklayarak kedinin yolunu göster!",
        tahtaTipi: "filCapraz",
        okYonu: "capraz",
        secenekler: [
          { id: "a", sembol: "↗️", aciklama: "Çapraz Ok", dogru: true },
          { id: "b", sembol: "➡️", aciklama: "Düz Ok", dogru: false },
          { id: "c", sembol: "⬇️", aciklama: "Aşağı Ok", dogru: false },
        ],
        dogruMesaj: "Miyav! Mırmır çapraz patikadan hedefine ulaştı!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 2.1.",
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
        okYonu: "duz",
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
        tahtaTipi: "baslangic",
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
    kod: "ST.OÖ. 2.2.",
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
        okYonu: "capraz",
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
        tahtaTipi: "baslangic",
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
    kod: "ST.OÖ. 2.3.",
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
        okYonu: "etraf",
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
    kod: "ST.OÖ. 2.4.",
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
        okYonu: "etraf",
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
        tahtaTipi: "baslangic",
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
    kod: "ST.OÖ. 2.5.",
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
        okYonu: "lSekli",
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
        tahtaTipi: "baslangic",
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
    kod: "ST.OÖ. 2.6.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Piyon taşının hareketini uygular.",
    resmiAciklama: "Piyonun düz ileri yürüyüşü ve çapraz taş alışı tahta üzerinde gösterilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🐜",
        karakterAdi: "Cesur Karınca",
        soruMetni: "Piyon tahtada yürürken arkasına bakabilir mi (geri yürüyebilir mi)?",
        tahtaTipi: "piyonIleri",
        secenekler: [
          { id: "a", sembol: "❌", aciklama: "Asla Geri Yürüyemez!", dogru: true },
          { id: "b", sembol: "✅", aciklama: "Geri Yürür", dogru: false },
          { id: "c", sembol: "🔄", aciklama: "Döner", dogru: false },
        ],
        dogruMesaj: "Doğru! Piyonlar sadece ileriye yürür.",
      },
      {
        id: 2,
        karakter: "🐣",
        karakterAdi: "Minik Civciv",
        soruMetni: "Piyon başlangıç çizgisindeyken tek seferde kaç kare ileri fırlayabilir?",
        tahtaTipi: "piyonIleri",
        secenekler: [
          { id: "a", sembol: "2️⃣", aciklama: "İsterse 2 Kare", dogru: true },
          { id: "b", sembol: "5️⃣", aciklama: "5 Kare", dogru: false },
          { id: "c", sembol: "8️⃣", aciklama: "8 Kare", dogru: false },
        ],
        dogruMesaj: "Harika! Başlangıçta 1 veya 2 adım atabilir.",
      },
      {
        id: 3,
        karakter: "🐱",
        karakterAdi: "Akıllı Kedi",
        soruMetni: "Piyon düz yürür ama rakip taşı hangi yönde alır?",
        tahtaTipi: "piyonIleri",
        secenekler: [
          { id: "a", sembol: "❌", aciklama: "Çapraz Yönde", dogru: true },
          { id: "b", sembol: "➕", aciklama: "Düz Yönde", dogru: false },
          { id: "c", sembol: "🔙", aciklama: "Geriye Doğru", dogru: false },
        ],
        dogruMesaj: "Mükemmel! Piyon düz yürür, çapraz yer!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 2.7.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Piyon terfisini uygular.",
    resmiAciklama: "En son sıraya varan piyonun vezir veya başka bir taşa dönüşmesi gösterilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🐛",
        karakterAdi: "Tırtıl Piyon",
        soruMetni: "Tahtanın en son (karşı) sırasına ulaşan piyon neye dönüşür?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "👑", aciklama: "Vezir (Terfi Eder)", dogru: true },
          { id: "b", sembol: "🗑️", aciklama: "Oyundan Çıkar", dogru: false },
          { id: "c", sembol: "📦", aciklama: "Kutuya Girer", dogru: false },
        ],
        dogruMesaj: "Muazzam! Piyon en son karede taç giyip vezir olur.",
      },
      {
        id: 2,
        karakter: "✨",
        karakterAdi: "Sihirli Yıldız",
        soruMetni: "Terfi eden piyon hangi taşa DÖNÜŞEMEZ?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🤴", aciklama: "İkinci Bir Şah Olamaz", dogru: true },
          { id: "b", sembol: "♛", aciklama: "Vezir Olabilir", dogru: false },
          { id: "c", sembol: "♜", aciklama: "Kale Olabilir", dogru: false },
        ],
        dogruMesaj: "Çok akıllıca! Piyon şah olamaz.",
      },
      {
        id: 3,
        karakter: "🏅",
        karakterAdi: "Şampiyon",
        soruMetni: "Piyon terfisi tahtanın kaçıncı yatay sırasında gerçekleşir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "8️⃣", aciklama: "En Son (8.) Sıra", dogru: true },
          { id: "b", sembol: "1️⃣", aciklama: "1. Sıra", dogru: false },
          { id: "c", sembol: "4️⃣", aciklama: "Orta Sıra", dogru: false },
        ],
        dogruMesaj: "Tebrikler! Karşı sınıra ulaşan piyon terfi eder.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 2.8.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Satrançtaki başlangıç konumunu dizer.",
    resmiAciklama: "Taşların tahtaya doğru yerleştirilmesi kuralı işlenir.",
    ornekler: [
      {
        id: 1,
        karakter: "👗",
        karakterAdi: "Modacı Prenses",
        soruMetni: "Vezir hangi renge ait karede oyuna başlar?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🎨", aciklama: "Kendi Rengindeki Karede", dogru: true },
          { id: "b", sembol: "🌈", aciklama: "Fark Etmez", dogru: false },
          { id: "c", sembol: "⬛", aciklama: "Sadece Siyah", dogru: false },
        ],
        dogruMesaj: "Harika! Vezir elbisesinin rengini sever.",
      },
      {
        id: 2,
        karakter: "🏰",
        karakterAdi: "Saray Bekçisi",
        soruMetni: "Tahtanın 4 köşesinde hangi taşlar durur?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "♜", aciklama: "Kaleler", dogru: true },
          { id: "b", sembol: "♟️", aciklama: "Piyonlar", dogru: false },
          { id: "c", sembol: "♞", aciklama: "Atlar", dogru: false },
        ],
        dogruMesaj: "Köşeler güvende! 4 köşede kaleler yer alır.",
      },
      {
        id: 3,
        karakter: "💂‍♂️",
        karakterAdi: "Muhafız",
        soruMetni: "Ön sırayı dolduran 8 asker hangi taştır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "♟️", aciklama: "Piyonlar", dogru: true },
          { id: "b", sembol: "♝", aciklama: "Filler", dogru: false },
          { id: "c", sembol: "♚", aciklama: "Şahlar", dogru: false },
        ],
        dogruMesaj: "Piyon duvarı ikinci sırayı baştan sona kaplar.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 2.9.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Taşların puan değerlerini kavrar.",
    resmiAciklama: "Taşların puanları kıyaslanır.",
    ornekler: [
      {
        id: 1,
        karakter: "⚖️",
        karakterAdi: "Terazi",
        soruMetni: "Tahtadaki en yüksek puanlı normal taş hangisidir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "👑 (9 Puan)", aciklama: "Vezir", dogru: true },
          { id: "b", sembol: "♜ (5 Puan)", aciklama: "Kale", dogru: false },
          { id: "c", sembol: "♞ (3 Puan)", aciklama: "At", dogru: false },
        ],
        dogruMesaj: "Doğru! Vezir 9 puanla en güçlü taştır.",
      },
      {
        id: 2,
        karakter: "🎯",
        karakterAdi: "Avcı",
        soruMetni: "Piyonun puan değeri kaçtır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "1️⃣", aciklama: "1 Puan", dogru: true },
          { id: "b", sembol: "3️⃣", aciklama: "3 Puan", dogru: false },
          { id: "c", sembol: "5️⃣", aciklama: "5 Puan", dogru: false },
        ],
        dogruMesaj: "Harika! Piyon 1 puandır.",
      },
      {
        id: 3,
        karakter: "💎",
        karakterAdi: "Elmas",
        soruMetni: "At ile Filin puanları birbiriyle nasıl ilişkilidir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🟰", aciklama: "İkisi de Eşittir (3'er Puan)", dogru: true },
          { id: "b", sembol: "➕", aciklama: "Biri 9 Puandır", dogru: false },
          { id: "c", sembol: "➖", aciklama: "Biri 0 Puandır", dogru: false },
        ],
        dogruMesaj: "Çok iyi! At ve fil eşit güçtedir.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 2.10.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Satrançta taş almayı bilir.",
    resmiAciklama: "Taş alışverişi ve karlı değişimler incelenir.",
    ornekler: [
      {
        id: 1,
        karakter: "🦊",
        karakterAdi: "Tilki",
        soruMetni: "1 puanlık piyon verip 9 puanlık vezir almak karlı bir alış mıdır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "✅", aciklama: "Evet, Çok Karlı Alış!", dogru: true },
          { id: "b", sembol: "❌", aciklama: "Kötü Alış", dogru: false },
          { id: "c", sembol: "⚠️", aciklama: "Zararlı", dogru: false },
        ],
        dogruMesaj: "Muazzam kazanç! Az puan verip çok puan aldın.",
      },
      {
        id: 2,
        karakter: "🐻",
        karakterAdi: "Ayı",
        soruMetni: "5 puanlık kaleyi korumasız bırakıp kaptırmak iyi bir şey midir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "❌", aciklama: "Hayır, Büyük Hata!", dogru: true },
          { id: "b", sembol: "✅", aciklama: "Çok İyi", dogru: false },
          { id: "c", sembol: "🎉", aciklama: "Harika", dogru: false },
        ],
        dogruMesaj: "Doğru! Değerli taşlarımızı korumalıyız.",
      },
      {
        id: 3,
        karakter: "🤝",
        karakterAdi: "Dost",
        soruMetni: "3 puanlık file karşılık rakibin 3 puanlık filini almak nasıl bir değişimdir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🟰", aciklama: "Eşit Değişim", dogru: true },
          { id: "b", sembol: "🚀", aciklama: "Uçurur", dogru: false },
          { id: "c", sembol: "📉", aciklama: "Zarar", dogru: false },
        ],
        dogruMesaj: "Eşit güçte karşılıklı değişim!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 2.11.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Satrançta saldırı altındaki taşın koruması kavramını açıklar.",
    resmiAciklama: "Korumalı ve korumasız taşlar incelenir.",
    ornekler: [
      {
        id: 1,
        karakter: "🛡️",
        karakterAdi: "Kalkan",
        soruMetni: "Başka bir taş tarafından korunan taşlara ne denir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🛡️", aciklama: "Korumalı Güvenli Taş", dogru: true },
          { id: "b", sembol: "🍂", aciklama: "Sahipsiz", dogru: false },
          { id: "c", sembol: "🕳️", aciklama: "Kuyu", dogru: false },
        ],
        dogruMesaj: "Koruma devrede! Taşımız güvende.",
      },
      {
        id: 2,
        karakter: "👀",
        karakterAdi: "Göz",
        soruMetni: "Hiçbir taşın korumadığı boşta kalan taşa ne denir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "💫", aciklama: "Korumasız (Boşta) Taş", dogru: true },
          { id: "b", sembol: "🏰", aciklama: "Kale", dogru: false },
          { id: "c", sembol: "🧱", aciklama: "Duvar", dogru: false },
        ],
        dogruMesaj: "Dikkat! Korumasız taşlar kolay av olur.",
      },
      {
        id: 3,
        karakter: "🐾",
        karakterAdi: "Pati",
        soruMetni: "Tehlikedeki taşımıza yardım etmek için ne yaparız?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🤝", aciklama: "Destek Taş Getirip Koruruz", dogru: true },
          { id: "b", sembol: "💤", aciklama: "Uyuruz", dogru: false },
          { id: "c", sembol: "🏃", aciklama: "Kaçarız", dogru: false },
        ],
        dogruMesaj: "Dayanışma ile taşımızı koruma altına alırız!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 3.1.",
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
    kod: "ST.OÖ. 3.2.",
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
        tahtaTipi: "baslangic",
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
        tahtaTipi: "baslangic",
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
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "⚔️", aciklama: "Uygunsa Alınabilir", dogru: true },
          { id: "b", sembol: "❌", aciklama: "Asla Alınamaz", dogru: false },
          { id: "c", sembol: "🔒", aciklama: "Kilitlenir", dogru: false },
        ],
        dogruMesaj: "Evet! Tehdit eden taş vurularak şah kurtarılabilir.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 3.3.",
    uniteId: 3,
    uniteBaslik: "3. Satrançta Şah Tehdidi ve Mat",
    baslik: "Şah tehdidinden çeşitli teknikleri uygulayarak kurtulur.",
    resmiAciklama: "Şahın kaçma, alma ve perdeleme yolları öğretilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🏃‍♂️",
        karakterAdi: "Koşucu",
        soruMetni: "Şah çekildiğinde ilk kurtulma yolu nedir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "👟", aciklama: "Güvenli Kareye Kaçmak", dogru: true },
          { id: "b", sembol: "🛑", aciklama: "Olduğun Yerde Kal", dogru: false },
          { id: "c", sembol: "🪑", aciklama: "Oturmak", dogru: false },
        ],
        dogruMesaj: "Tıkır tıkır! Güvenli komşu kareye kaçılır.",
      },
      {
        id: 2,
        karakter: "⚔️",
        karakterAdi: "Savaşçı",
        soruMetni: "Şaha saldıran taşı kendi taşımızla vurmaya ne denir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "⚔️", aciklama: "Tehdit Eden Taşı Almak", dogru: true },
          { id: "b", sembol: "🏳️", aciklama: "Teslim olmak", dogru: false },
          { id: "c", sembol: "🎈", aciklama: "Uçurmak", dogru: false },
        ],
        dogruMesaj: "Saldırgan taş tahtadan temizlendi!",
      },
      {
        id: 3,
        karakter: "🧱",
        karakterAdi: "Duvar",
        soruMetni: "Saldıran taş ile şah arasına dost taş koyup siper etmeye ne denir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🧱", aciklama: "Perdeleme Yapmak", dogru: true },
          { id: "b", sembol: "🪟", aciklama: "Pencere", dogru: false },
          { id: "c", sembol: "🚪", aciklama: "Kapı", dogru: false },
        ],
        dogruMesaj: "Harika! Araya taş koyarak perdeleme yapıldı.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 3.4.",
    uniteId: 3,
    uniteBaslik: "3. Satrançta Şah Tehdidi ve Mat",
    baslik: "Şahın diğer taşlar gibi alınamayacağını kavrar.",
    resmiAciklama: "Şahın tahtadan yenerek çıkarılamayacağı benimsetilir.",
    ornekler: [
      {
        id: 1,
        karakter: "⛔",
        karakterAdi: "Dur",
        soruMetni: "Şah tahtadan yenilip dışarı atılabilir mi?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🛑", aciklama: "HAYIR! Şah Asla Alınamaz", dogru: true },
          { id: "b", sembol: "🟢", aciklama: "Evet Alınır", dogru: false },
          { id: "c", sembol: "🟡", aciklama: "Bazen", dogru: false },
        ],
        dogruMesaj: "Kesinlikle yasak! Şah yenmez, sadece mat edilir.",
      },
      {
        id: 2,
        karakter: "⚖️",
        karakterAdi: "Hakem",
        soruMetni: "Şahı almaya kalkışmak hangi kural ihlalidir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🎷", aciklama: "Kural Dışı Hamle", dogru: true },
          { id: "b", sembol: "👏", aciklama: "Ödül", dogru: false },
          { id: "c", sembol: "🎁", aciklama: "Hediye", dogru: false },
        ],
        dogruMesaj: "Düüüt! Kural dışı hamledir.",
      },
      {
        id: 3,
        karakter: "🏰",
        karakterAdi: "Saray",
        soruMetni: "Şah oyun boyunca nerede kalır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🏯", aciklama: "Tahtada Güvende Yaşar", dogru: true },
          { id: "b", sembol: "🗑️", aciklama: "Kutuda", dogru: false },
          { id: "c", sembol: "📦", aciklama: "Pakette", dogru: false },
        ],
        dogruMesaj: "Şah oyun sonuna kadar tahtayı terk etmez.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 3.5.",
    uniteId: 3,
    uniteBaslik: "3. Satrançta Şah Tehdidi ve Mat",
    baslik: "Mat etmeyi açıklar.",
    resmiAciklama: "Mat durumu ve oyunun sonu açıklanır.",
    ornekler: [
      {
        id: 1,
        karakter: "🎉",
        karakterAdi: "Kutlama",
        soruMetni: "Şah tehdit altında ve kurtuluş yolu kalmadıysa ne olur?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🎊", aciklama: "ŞAH VE MAT!", dogru: true },
          { id: "b", sembol: "💤", aciklama: "Uyku", dogru: false },
          { id: "c", sembol: "🌧️", aciklama: "Yağmur", dogru: false },
        ],
        dogruMesaj: "ŞAH VE MAT! Stratejik zafer!",
      },
      {
        id: 2,
        karakter: "🔒",
        karakterAdi: "Kilit",
        soruMetni: "Mat olunca şahın kaçacak karesi var mıdır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🔒", aciklama: "Hiçbir Yeri Kalmamıştır", dogru: true },
          { id: "b", sembol: "🔓", aciklama: "Çok Yeri Var", dogru: false },
          { id: "c", sembol: "🚪", aciklama: "Kapı Açık", dogru: false },
        ],
        dogruMesaj: "Kilit kapandı! Kaçış yolu yoktur.",
      },
      {
        id: 3,
        karakter: "🏆",
        karakterAdi: "Kupa",
        soruMetni: "Mat eden oyuncu ne kazanır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🏆", aciklama: "Maçın Galibiyeti (Kupa)", dogru: true },
          { id: "b", sembol: "🩹", aciklama: "Ceza", dogru: false },
          { id: "c", sembol: "🧹", aciklama: "Temizlik", dogru: false },
        ],
        dogruMesaj: "Şampiyonluk kupası senin!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 3.6.",
    uniteId: 3,
    uniteBaslik: "3. Satrançta Şah Tehdidi ve Mat",
    baslik: "Tek hamlelik mat alıştırmalarını yapar.",
    resmiAciklama: "Basit konumda tek hamlede mat bulma.",
    ornekler: [
      {
        id: 1,
        karakter: "🎯",
        karakterAdi: "Nişan",
        soruMetni: "Tek hamlede şahı sıkıştıran son vuruşa ne denir?",
        tahtaTipi: "matVurusu",
        secenekler: [
          { id: "a", sembol: "🎯", aciklama: "Mat Hamlesi", dogru: true },
          { id: "b", sembol: "🚗", aciklama: "Sürüş", dogru: false },
          { id: "c", sembol: "🎈", aciklama: "Uçurma", dogru: false },
        ],
        dogruMesaj: "Tam isabet! Mat hamlesi tamamlandı.",
      },
      {
        id: 2,
        karakter: "🏰",
        karakterAdi: "Kale",
        soruMetni: "Arka sırada şahı koridorda sıkıştırıp yapılan mata ne denir?",
        tahtaTipi: "matVurusu",
        secenekler: [
          { id: "a", sembol: "🚪", aciklama: "Koridor Matı", dogru: true },
          { id: "b", sembol: "🛟", aciklama: "Simit", dogru: false },
          { id: "c", sembol: "🏖️", aciklama: "Plaj", dogru: false },
        ],
        dogruMesaj: "Harika! Koridor matı başarıyla uygulandı.",
      },
      {
        id: 3,
        karakter: "💡",
        karakterAdi: "Ampul",
        soruMetni: "Mat bulmacasını çözerken zihnimizde ne parıldar?",
        tahtaTipi: "matVurusu",
        secenekler: [
          { id: "a", sembol: "💡", aciklama: "Harika Bir Fikir / Mat", dogru: true },
          { id: "b", sembol: "🌑", aciklama: "Karanlık", dogru: false },
          { id: "c", sembol: "🔌", aciklama: "Kablo", dogru: false },
        ],
        dogruMesaj: "Fikir parıldadı! Mat hamlesi bulundu.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 3.7.",
    uniteId: 3,
    uniteBaslik: "3. Satrançta Şah Tehdidi ve Mat",
    baslik: "Pat durumunu bilir.",
    resmiAciklama: "Tehdit yokken hamle kalmama durumu (beraberlik).",
    ornekler: [
      {
        id: 1,
        karakter: "🧊",
        karakterAdi: "Buz",
        soruMetni: "Şaha saldırı yok ama oynayacak hiç yasal hamle kalmadıysa bu nedir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🧊", aciklama: "PAT (Beraberlik)", dogru: true },
          { id: "b", sembol: "👑", aciklama: "Mat", dogru: false },
          { id: "c", sembol: "🔥", aciklama: "Savaş", dogru: false },
        ],
        dogruMesaj: "Dondu kaldı! Oyun pat oldu ve berabere bitti.",
      },
      {
        id: 2,
        karakter: "🕊️",
        karakterAdi: "Güvercin",
        soruMetni: "Pat olunca maç nasıl biter?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🟰", aciklama: "Berabere (Yarımşar Puan)", dogru: true },
          { id: "b", sembol: "🥇", aciklama: "Tek Kazanan", dogru: false },
          { id: "c", sembol: "🥊", aciklama: "Kavga", dogru: false },
        ],
        dogruMesaj: "Barışçıl beraberlik!",
      },
      {
        id: 3,
        karakter: "⚖️",
        karakterAdi: "Terazi",
        soruMetni: "Pat pozisyonunda şah tehdit altında mıdır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "❌", aciklama: "Hayır, Tehdit Altında Değildir", dogru: true },
          { id: "b", sembol: "⚠️", aciklama: "Evet, Şah Altındadır", dogru: false },
          { id: "c", sembol: "💥", aciklama: "Saldırı Var", dogru: false },
        ],
        dogruMesaj: "Çok doğru! Tehdit yok ama hamle yapacak taş yok.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 3.8.",
    uniteId: 3,
    uniteBaslik: "3. Satrançta Şah Tehdidi ve Mat",
    baslik: "Berabere kalmanın ne olduğunu bilir.",
    resmiAciklama: "Yetersiz güç ve anlaşmalı beraberlikler.",
    ornekler: [
      {
        id: 1,
        karakter: "🏜️",
        karakterAdi: "Çöl",
        soruMetni: "Tahtada sadece iki şah kaldığında ne olur?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "💛", aciklama: "Taş Yetmezliği ile Beraberlik", dogru: true },
          { id: "b", sembol: "⚔️", aciklama: "Savaş Sürüyor", dogru: false },
          { id: "c", sembol: "🧨", aciklama: "Patlama", dogru: false },
        ],
        dogruMesaj: "İki şah birbirini mat edemez, berabere biter.",
      },
      {
        id: 2,
        karakter: "🤝",
        karakterAdi: "Tokalaşma",
        soruMetni: "İki oyuncu anlaşarak maçı bitirirse buna ne denir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🤝", aciklama: "Anlaşmalı Beraberlik", dogru: true },
          { id: "b", sembol: "🏃", aciklama: "Kaçış", dogru: false },
          { id: "c", sembol: "😭", aciklama: "Ağlama", dogru: false },
        ],
        dogruMesaj: "Centilmence anlaşarak berabere bitti.",
      },
      {
        id: 3,
        karakter: "⏳",
        karakterAdi: "Saat",
        soruMetni: "50 hamle boyunca hiç taş alınmazsa kural gereği ne ilan edilir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "⚖️", aciklama: "Beraberlik", dogru: true },
          { id: "b", sembol: "🏆", aciklama: "Galibiyet", dogru: false },
          { id: "c", sembol: "❌", aciklama: "İptal", dogru: false },
        ],
        dogruMesaj: "Süre ve hamle kuralı gereği berabere ilan edilir.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 3.9.",
    uniteId: 3,
    uniteBaslik: "3. Satrançta Şah Tehdidi ve Mat",
    baslik: "Mat ile pat konumlarını ayırt eder.",
    resmiAciklama: "Mat ve pat farkının pekiştirilmesi.",
    ornekler: [
      {
        id: 1,
        karakter: "🔍",
        karakterAdi: "Büyüteç",
        soruMetni: "Şah saldırı altındaysa ve kaçamıyorsa bu nedir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "👑", aciklama: "MAT", dogru: true },
          { id: "b", sembol: "🧊", aciklama: "PAT", dogru: false },
          { id: "c", sembol: "🌈", aciklama: "Tatil", dogru: false },
        ],
        dogruMesaj: "Saldırı varsa MAT'tır!",
      },
      {
        id: 2,
        karakter: "🕊️",
        karakterAdi: "Kuş",
        soruMetni: "Şaha saldıran yok ama hamle yapacak yer yoksa bu nedir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🌸", aciklama: "PAT (Beraberlik)", dogru: true },
          { id: "b", sembol: "👑", aciklama: "Mat", dogru: false },
          { id: "c", sembol: "🏆", aciklama: "Kupa", dogru: false },
        ],
        dogruMesaj: "Saldırı yoksa PAT'tır!",
      },
      {
        id: 3,
        karakter: "💡",
        karakterAdi: "Akıl",
        soruMetni: "Mat ve pat farkını öğrendin mi?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "💡", aciklama: "Evet, Artık Biliyorum!", dogru: true },
          { id: "b", sembol: "💤", aciklama: "Bilmiyorum", dogru: false },
          { id: "c", sembol: "❌", aciklama: "Karıştırdım", dogru: false },
        ],
        dogruMesaj: "Harika! Artık ikisini karıştırmazsın.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 4.1.",
    uniteId: 4,
    uniteBaslik: "4. Satrançta Tehdit ve Savunma",
    baslik: "Satrançta tehdit durumlarını fark eder.",
    resmiAciklama: "Tehdit altındaki taşları önceden sezme.",
    ornekler: [
      {
        id: 1,
        karakter: "🚨",
        karakterAdi: "Alarm",
        soruMetni: "Rakip taş taşımıza saldırınca ne çalışır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🚨", aciklama: "Tehlike Alarmı", dogru: true },
          { id: "b", sembol: "🎵", aciklama: "Şarkı", dogru: false },
          { id: "c", sembol: "🎈", aciklama: "Eğlence", dogru: false },
        ],
        dogruMesaj: "Tehlike alarmı çalındı!",
      },
      {
        id: 2,
        karakter: "🦊",
        karakterAdi: "Tilki",
        soruMetni: "Tehditleri önceden görmek oyuncuya ne kazandırır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🛡️", aciklama: "Taşımızı Kurtarma Şansı", dogru: true },
          { id: "b", sembol: "😴", aciklama: "Uyku", dogru: false },
          { id: "c", sembol: "💤", aciklama: "Hiç", dogru: false },
        ],
        dogruMesaj: "Zamanında savunma yapmanı sağlar.",
      },
      {
        id: 3,
        karakter: "👀",
        karakterAdi: "Göz",
        soruMetni: "Gözlerimizi tahtada nerede tutmalıyız?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "👁️‍🗨️", aciklama: "Tüm Tahtada ve Tehditlerde", dogru: true },
          { id: "b", sembol: "🥾", aciklama: "Yerde", dogru: false },
          { id: "c", sembol: "☁️", aciklama: "Bulutta", dogru: false },
        ],
        dogruMesaj: "Gözler daima tahtada olmalıdır.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 4.2.",
    uniteId: 4,
    uniteBaslik: "4. Satrançta Tehdit ve Savunma",
    baslik: "Taşının önüne perdeleme yapar.",
    resmiAciklama: "Araya taş koyarak saldırıyı engelleme.",
    ornekler: [
      {
        id: 1,
        karakter: "🎭",
        karakterAdi: "Perde",
        soruMetni: "Saldıran taş ile hedef taş arasına başka taş koymaya ne denir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🎭", aciklama: "Perdeleme Yapmak", dogru: true },
          { id: "b", sembol: "🏃", aciklama: "Kaçmak", dogru: false },
          { id: "c", sembol: "🥊", aciklama: "Vurmak", dogru: false },
        ],
        dogruMesaj: "Araya perde çekilerek yol kapatıldı.",
      },
      {
        id: 2,
        karakter: "🧱",
        karakterAdi: "Duvar",
        soruMetni: "Perdeleme hangi taşların saldırısını durdurmak için etkilidir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "♜♝♛", aciklama: "Kale, Fil ve Vezir", dogru: true },
          { id: "b", sembol: "♞", aciklama: "At", dogru: false },
          { id: "c", sembol: "♟️", aciklama: "Piyon", dogru: false },
        ],
        dogruMesaj: "Uzaktan saldıran taşlara karşı perdeleme işe yarar.",
      },
      {
        id: 3,
        karakter: "☂️",
        karakterAdi: "Şemsiye",
        soruMetni: "Perdeleme taşı ne görevi görür?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🛡️", aciklama: "Siper / Kalkan Görevi", dogru: true },
          { id: "b", sembol: "🎈", aciklama: "Süs", dogru: false },
          { id: "c", sembol: "📦", aciklama: "Kutu", dogru: false },
        ],
        dogruMesaj: "Güvenli bir siper oluşturur.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 4.3.",
    uniteId: 4,
    uniteBaslik: "4. Satrançta Tehdit ve Savunma",
    baslik: "Satrançta güvenli kareleri ayırt eder.",
    resmiAciklama: "Güvenli ve tehlikeli karelerin ayrımı.",
    ornekler: [
      {
        id: 1,
        karakter: "🏝️",
        karakterAdi: "Ada",
        soruMetni: "Rakibin saldırı altında tutmadığı karelere ne denir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🏝️", aciklama: "Güvenli Kare", dogru: true },
          { id: "b", sembol: "🌋", aciklama: "Tehlike Çukuru", dogru: false },
          { id: "c", sembol: "🕳️", aciklama: "Tuzak", dogru: false },
        ],
        dogruMesaj: "Güvenli kareler taşlarımız için limandır.",
      },
      {
        id: 2,
        karakter: "🚦",
        karakterAdi: "Trafik",
        soruMetni: "Tehlikeli kareye taş koymak neye yol açar?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "❌", aciklama: "Taşımızı Kaybetmemize", dogru: true },
          { id: "b", sembol: "🏆", aciklama: "Kazanmaya", dogru: false },
          { id: "c", sembol: "🎉", aciklama: "Ödüle", dogru: false },
        ],
        dogruMesaj: "Tehlikeli karede taşlarımızı kaybederiz.",
      },
      {
        id: 3,
        karakter: "⚓",
        karakterAdi: "Çapa",
        soruMetni: "Taşımızı nereye oynamalıyız?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🟢", aciklama: "Güvenli Karelere", dogru: true },
          { id: "b", sembol: "🔴", aciklama: "Tehlikeli Yerlere", dogru: false },
          { id: "c", sembol: "🗑️", aciklama: "Çöpe", dogru: false },
        ],
        dogruMesaj: "Daima güvenli kareleri tercih ederiz.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 4.4.",
    uniteId: 4,
    uniteBaslik: "4. Satrançta Tehdit ve Savunma",
    baslik: "Taşını korur.",
    resmiAciklama: "Saldırı altındaki taşı koruma veya kaçırma.",
    ornekler: [
      {
        id: 1,
        karakter: "🦸‍♂️",
        karakterAdi: "Kahraman",
        soruMetni: "Tehdit altındaki taşımızı korumanın yolları nelerdir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🛡️🏃", aciklama: "Koruma Sağlamak veya Kaçırmak", dogru: true },
          { id: "b", sembol: "💤", aciklama: "Hiçbir şey yapmamak", dogru: false },
          { id: "c", sembol: "🎁", aciklama: "Hediye etmek", dogru: false },
        ],
        dogruMesaj: "Taşımızı ya koruruz ya da kaçırırız.",
      },
      {
        id: 2,
        karakter: "🏃‍♀️",
        karakterAdi: "Koşucu",
        soruMetni: "Koruyamadığımız taşı nereye götürmeliyiz?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🏝️", aciklama: "Güvenli Bir Kareye", dogru: true },
          { id: "b", sembol: "🌋", aciklama: "Tehlikeye", dogru: false },
          { id: "c", sembol: "📦", aciklama: "Kutuya", dogru: false },
        ],
        dogruMesaj: "Güvenli kareye kaçırarak kurtarırız.",
      },
      {
        id: 3,
        karakter: "🤝",
        karakterAdi: "Dost",
        soruMetni: "Taşlarımız birbirini korursa ne olur?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "💪", aciklama: "Güçlü Savunma Zinciri Olur", dogru: true },
          { id: "b", sembol: "💔", aciklama: "Zayıflar", dogru: false },
          { id: "c", sembol: "📉", aciklama: "Düşer", dogru: false },
        ],
        dogruMesaj: "Kopmaz bir savunma zinciri oluşur.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 4.5.",
    uniteId: 4,
    uniteBaslik: "4. Satrançta Tehdit ve Savunma",
    baslik: "Satrançta taş alır.",
    resmiAciklama: "Rakip taşın yerine geçerek taş alma.",
    ornekler: [
      {
        id: 1,
        karakter: "🥊",
        karakterAdi: "Boksör",
        soruMetni: "Rakip taş alındığında o kareye ne konur?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "♟️", aciklama: "Kendi Taşımız Konur", dogru: true },
          { id: "b", sembol: "🕳️", aciklama: "Boş Bırakılır", dogru: false },
          { id: "c", sembol: "🗑️", aciklama: "Kapatılır", dogru: false },
        ],
        dogruMesaj: "Rakip taş kalkar, bizim taşımız o kareye yerleşir.",
      },
      {
        id: 2,
        karakter: "🧁",
        karakterAdi: "Tatlı",
        soruMetni: "Boşta duran rakip taş alınmalı mıdır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "✅", aciklama: "Evet, Fırsat Değerlendirilir", dogru: true },
          { id: "b", sembol: "❌", aciklama: "Asla Alınmaz", dogru: false },
          { id: "c", sembol: "💤", aciklama: "Uyunur", dogru: false },
        ],
        dogruMesaj: "Boştaki taşlar kuralına uygun şekilde alınır.",
      },
      {
        id: 3,
        karakter: "⭐",
        karakterAdi: "Yıldız",
        soruMetni: "Taş alırken tahtadaki kare sayısı değişir mi?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "⏹️", aciklama: "Hayır, 64 Kare Sabittir", dogru: true },
          { id: "b", sembol: "📈", aciklama: "Artar", dogru: false },
          { id: "c", sembol: "📉", aciklama: "Azalır", dogru: false },
        ],
        dogruMesaj: "Tahta her zaman 64 karedir.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 5.1.",
    uniteId: 5,
    uniteBaslik: "5. Satrancın Özel Kuralları",
    baslik: "Rok hamlesini uygular.",
    resmiAciklama: "Şah ve kalenin ortak özel hamlesi.",
    ornekler: [
      {
        id: 1,
        karakter: "🏰",
        karakterAdi: "Saray",
        soruMetni: "Rok hamlesi kimin güvenliği için yapılır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🤴", aciklama: "Bilge Şah", dogru: true },
          { id: "b", sembol: "♟️", aciklama: "Piyon", dogru: false },
          { id: "c", sembol: "♞", aciklama: "At", dogru: false },
        ],
        dogruMesaj: "Şahı güvenli köşeye almak için rok yapılır.",
      },
      {
        id: 2,
        karakter: "☝️",
        karakterAdi: "Hakem",
        soruMetni: "Rok yaparken tahtada ilk olarak hangi taşa dokunulmalıdır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "♚", aciklama: "Önce Şaha", dogru: true },
          { id: "b", sembol: "♜", aciklama: "Önce Kaleye", dogru: false },
          { id: "c", sembol: "♟️", aciklama: "Piyona", dogru: false },
        ],
        dogruMesaj: "Rok şah hamlesidir, önce şaha dokunulur.",
      },
      {
        id: 3,
        karakter: "🔒",
        karakterAdi: "Kilit",
        soruMetni: "Daha önce oynamış şah ile rok yapılabilir mi?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "❌", aciklama: "Hayır, Rok Hakkı Yanar", dogru: true },
          { id: "b", sembol: "✅", aciklama: "Evet Yapılır", dogru: false },
          { id: "c", sembol: "🎉", aciklama: "Serbesttir", dogru: false },
        ],
        dogruMesaj: "Şah veya kale oynamışsa rok yapılamaz.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 5.2.",
    uniteId: 5,
    uniteBaslik: "5. Satrancın Özel Kuralları",
    baslik: "Piyonun geçerken alma hamlesini kavrar.",
    resmiAciklama: "Geçerken alma (En Passant) kuralı.",
    ornekler: [
      {
        id: 1,
        karakter: "👻",
        karakterAdi: "Hayalet",
        soruMetni: "İlk çıkışta iki adım atlayan piyonun atladığı kareyi çaprazdan almasına ne denir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "👻", aciklama: "Geçerken Alma", dogru: true },
          { id: "b", sembol: "🚀", aciklama: "Uçuş", dogru: false },
          { id: "c", sembol: "💣", aciklama: "Bomba", dogru: false },
        ],
        dogruMesaj: "Büyülü kural: Geçerken alma!",
      },
      {
        id: 2,
        karakter: "⚡",
        karakterAdi: "Şimşek",
        soruMetni: "Geçerken alma ne zaman yapılmalıdır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "⚡", aciklama: "Hemen O Anda (İlk Hamlede)", dogru: true },
          { id: "b", sembol: "📅", aciklama: "İstediğimiz Zaman", dogru: false },
          { id: "c", sembol: "⏳", aciklama: "Oyun Sonunda", dogru: false },
        ],
        dogruMesaj: "Hemen o anda yapılmazsa hak kaybolur.",
      },
      {
        id: 3,
        karakter: "🪄",
        karakterAdi: "Sihir",
        soruMetni: "Geçerken alma kuralı hangi taşlar arasında geçerlidir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "♟️", aciklama: "Sadece Piyonlar", dogru: true },
          { id: "b", sembol: "♜", aciklama: "Kaleler", dogru: false },
          { id: "c", sembol: "♚", aciklama: "Şahlar", dogru: false },
        ],
        dogruMesaj: "Yalnızca piyonlara özel bir sırdır.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 6.1.",
    uniteId: 6,
    uniteBaslik: "6. Satranç Oynuyorum",
    baslik: "Karşılıklı satranç oynar.",
    resmiAciklama: "Centilmenlik ve sırayla oynama bilinci.",
    ornekler: [
      {
        id: 1,
        karakter: "🤝",
        karakterAdi: "Dost",
        soruMetni: "Maç başlamadan önce rakibimize ne söyleriz?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "💖", aciklama: "'İyi Oyunlar / Başarılar'", dogru: true },
          { id: "b", sembol: "😜", aciklama: "Kötü Söz", dogru: false },
          { id: "c", sembol: "😠", aciklama: "Kızmak", dogru: false },
        ],
        dogruMesaj: "Başarılar diler, dostça başlarız.",
      },
      {
        id: 2,
        karakter: "⚪",
        karakterAdi: "Beyaz",
        soruMetni: "Satranç tahtasında maça her zaman hangi renk başlar?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "⚪", aciklama: "Daima Beyaz Taşlar", dogru: true },
          { id: "b", sembol: "⚫", aciklama: "Siyahlar", dogru: false },
          { id: "c", sembol: "🔴", aciklama: "Kırmızı", dogru: false },
        ],
        dogruMesaj: "İlk hamle her zaman beyazlarındır.",
      },
      {
        id: 3,
        karakter: "🔄",
        karakterAdi: "Sıra",
        soruMetni: "Hamle sırası kuralı nasıldır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🔁", aciklama: "Sırayla Birer Hamle", dogru: true },
          { id: "b", sembol: "⏩", aciklama: "İstediğimiz Kadar", dogru: false },
          { id: "c", sembol: "⏸️", aciklama: "Durmaksızın", dogru: false },
        ],
        dogruMesaj: "Sırayla bir sen, bir rakip oynar.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 6.2.",
    uniteId: 6,
    uniteBaslik: "6. Satranç Oynuyorum",
    baslik: "Oyun esnasında yardım ister.",
    resmiAciklama: "Hakemden sessizce yardım isteme kuralları.",
    ornekler: [
      {
        id: 1,
        karakter: "🙋‍♂️",
        karakterAdi: "Öğrenci",
        soruMetni: "Sorun yaşayınca hakemi nasıl çağırırız?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🙋", aciklama: "Sessizce El Kaldırarak", dogru: true },
          { id: "b", sembol: "📢", aciklama: "Bağırarak", dogru: false },
          { id: "c", sembol: "🤾", aciklama: "Koşarak", dogru: false },
        ],
        dogruMesaj: "Sessizce el kaldırıp yardım isteriz.",
      },
      {
        id: 2,
        karakter: "🤫",
        karakterAdi: "Sessizlik",
        soruMetni: "Satranç salonunda ortam nasıl olmalıdır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🤫", aciklama: "Çıt Çıkmayan Sessizlik", dogru: true },
          { id: "b", sembol: "🥁", aciklama: "Gürültülü", dogru: false },
          { id: "c", sembol: "🎉", aciklama: "Parti", dogru: false },
        ],
        dogruMesaj: "Sessizlik düşüncenin dostudur.",
      },
      {
        id: 3,
        karakter: "🧑‍🏫",
        karakterAdi: "Öğretmen",
        soruMetni: "Hakem geldiğinde nasıl davranmalıyız?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "👂", aciklama: "Sakinçe Dinlemeliyiz", dogru: true },
          { id: "b", sembol: "🏃", aciklama: "Kaçmalıyız", dogru: false },
          { id: "c", sembol: "🙈", aciklama: "Görmezden gelmeliyiz", dogru: false },
        ],
        dogruMesaj: "Hakemi dinleyip kurala uyarız.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 6.3.",
    uniteId: 6,
    uniteBaslik: "6. Satranç Oynuyorum",
    baslik: "Oyun bitişini açıklar.",
    resmiAciklama: "Maç sonu taşları toplama ve düzen.",
    ornekler: [
      {
        id: 1,
        karakter: "📦",
        karakterAdi: "Kutu",
        soruMetni: "Maç bitince taşlar ne yapılır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "📦", aciklama: "Düzenli Kutusuna Toplanır", dogru: true },
          { id: "b", sembol: "🌪️", aciklama: "Yere Atılır", dogru: false },
          { id: "c", sembol: "🏃", aciklama: "Bırakılıp Kaçılır", dogru: false },
        ],
        dogruMesaj: "Taşlar kutusuna düzenli toplanır.",
      },
      {
        id: 2,
        karakter: "🏁",
        karakterAdi: "Bitiş",
        soruMetni: "Oyun sonucu kime bildirilir?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "💮", aciklama: "Hakeme veya Görevliye", dogru: true },
          { id: "b", sembol: "❌", aciklama: "Kimseye", dogru: false },
          { id: "c", sembol: "💤", aciklama: "Unutulur", dogru: false },
        ],
        dogruMesaj: "Sonuç kaydedilir.",
      },
      {
        id: 3,
        karakter: "🧹",
        karakterAdi: "Temizlik",
        soruMetni: "Masa nasıl bırakılmalıdır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "⭐", aciklama: "Tertemiz ve Düzenli", dogru: true },
          { id: "b", sembol: "🗑️", aciklama: "Çöplü", dogru: false },
          { id: "c", sembol: "🔥", aciklama: "Kötü", dogru: false },
        ],
        dogruMesaj: "Masayı temiz ve düzenli bırakırız.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 6.4.",
    uniteId: 6,
    uniteBaslik: "6. Satranç Oynuyorum",
    baslik: "Satrancın etik kurallarının farkına varır.",
    resmiAciklama: "Fair-play, rakibe saygı ve sessizlik.",
    ornekler: [
      {
        id: 1,
        karakter: "💖",
        karakterAdi: "Kalp",
        soruMetni: "Maç bittikten sonra rakibimize ne deriz?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "❤️", aciklama: "'Tebrik Ederim, Güzel Maçtı'", dogru: true },
          { id: "b", sembol: "😜", aciklama: "Alay Ederiz", dogru: false },
          { id: "c", sembol: "😠", aciklama: "Küseriz", dogru: false },
        ],
        dogruMesaj: "Tebrik eder, dostça el sıkışırız.",
      },
      {
        id: 2,
        karakter: "🤫",
        karakterAdi: "Sessiz",
        soruMetni: "Devam eden diğer maçlara nasıl davranmalıyız?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "👣", aciklama: "Sessiz Olup Karışmayız", dogru: true },
          { id: "b", sembol: "📢", aciklama: "Bağırırız", dogru: false },
          { id: "c", sembol: "🗣️", aciklama: "Hamle Söyleriz", dogru: false },
        ],
        dogruMesaj: "Diğer maçlara saygı duyup sessiz oluruz.",
      },
      {
        id: 3,
        karakter: "🌟",
        karakterAdi: "Yıldız",
        soruMetni: "Gerçek bir satranç sporcusu nasıl unvan alır?",
        tahtaTipi: "baslangic",
        secenekler: [
          { id: "a", sembol: "🌟", aciklama: "Centilmen ve Kurallara Uyarak", dogru: true },
          { id: "b", sembol: "🍂", aciklama: "Kural Bozarak", dogru: false },
          { id: "c", sembol: "❌", aciklama: "Kavga Ederek", dogru: false },
        ],
        dogruMesaj: "Centilmenlik en büyük kazançtır!",
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
  const [seciliKod, setSeciliKod] = useState<string>("ST.OÖ. 1.1.");
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
      {/* 1. ÜST BAŞLIK VE AÇILIR LİSTE */}
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

      {/* 2. RESMİ KAZANIM AÇIKLAMASI */}
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

      {/* 3. ÇİZGİ FİLM VE TAHTA ÜZERİNDE GÖRSEL ÖRNEKLER */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <span style={{ fontSize: "28px" }}>♟️🗺️✨</span>
          <h2 style={{ fontSize: "16px", fontWeight: "900", color: "#1e293b", margin: "4px 0" }}>
            Satranç Tahtası Üzerinde 3 Örnek Görev
          </h2>
          <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
            Tahta üzerindeki okları ve taş konumlarını incele, doğru cevaba tıkla!
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
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "28px" }}>{ornek.karakter}</span>
                    <div style={{ fontSize: "12px", fontWeight: "900", color: "#c2410c" }}>
                      {idx + 1}. Görev: {ornek.karakterAdi}
                    </div>
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
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleCevapSec(ornek.id, s.id)}
                          style={{
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

      {/* 4. ALT GEÇİŞLER */}
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
