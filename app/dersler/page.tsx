"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface InteraktifOrnek {
  id: number;
  karakter: string;
  karakterAdi: string;
  soruMetni: string;
  hedefSekil: string;
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
  // 1. ÜNİTE
  {
    kod: "ST.OÖ. 1.1.",
    uniteId: 1,
    uniteBaslik: "1. Satranç Oyunu, Tahtası ve Yönler",
    baslik: "Satranç oyununu ve tahtasını tanır.",
    resmiAciklama:
      "Satranç tahtasının kare şekli, yatay, dikey, çapraz hatları ve açık-koyu kareleri incelenir. Yatay ve dikeyde sekize kadar sayma etkinlikleri yapılır.",
    ornekler: [
      {
        id: 1,
        karakter: "🦁",
        karakterAdi: "Aslan Şakir",
        soruMetni: "Aslan Şakir masaya oturdu ve tahtayı kuracak. Sağ alt köşesinde parıldayan BEYAZ KARE'yi bulup tıkla!",
        hedefSekil: "Beyaz Kare ⬜",
        secenekler: [
          { id: "a", sembol: "⬛", aciklama: "Koyu Kare", dogru: false },
          { id: "b", sembol: "⬜", aciklama: "Açık (Beyaz) Kare", dogru: true },
          { id: "c", sembol: "🔺", aciklama: "Üçgen", dogru: false },
        ],
        dogruMesaj: "Harikasın! 'Beyaz sağda' kuralını Aslan Şakir asla unutmayacak!",
      },
      {
        id: 2,
        karakter: "🐰",
        karakterAdi: "Tavşan Pamuk",
        soruMetni: "Pamuk tahtanın tam 64 kareden oluştuğunu öğrendi. Satranç tahtasının asıl şekli olan KARE kutucuğa bas!",
        hedefSekil: "Kare ⏹️",
        secenekler: [
          { id: "a", sembol: "⚪", aciklama: "Daire", dogru: false },
          { id: "b", sembol: "⏹️", aciklama: "Dört Köşeli Kare", dogru: true },
          { id: "c", sembol: "⭐", aciklama: "Yıldız", dogru: false },
        ],
        dogruMesaj: "Süper! Satranç tahtası 64 eşit kareden oluşan dev bir karedir!",
      },
      {
        id: 3,
        karakter: "🦊",
        karakterAdi: "Dedektif Tilki",
        soruMetni: "Dedektif Tilki gizli bir ipucu arıyor. Açık renkli karelerin yanındaki IŞILDAYAN YILDIZA bas!",
        hedefSekil: "Işıltılı Yıldız ⭐",
        secenekler: [
          { id: "a", sembol: "⭐", aciklama: "Parlayan Yıldız", dogru: true },
          { id: "b", sembol: "🍎", aciklama: "Elma", dogru: false },
          { id: "c", sembol: "🌑", aciklama: "Karanlık Taş", dogru: false },
        ],
        dogruMesaj: "İpuçlarını topladın! Açık ve koyu kareler yan yana gelir.",
      },
    ],
  },
  {
    kod: "ST.OÖ. 1.2.",
    uniteId: 1,
    uniteBaslik: "1. Satranç Oyunu, Tahtası ve Yönler",
    baslik: "Satranç tahtasında nesneleri yatay ve dikey yönlerde hareket ettirir.",
    resmiAciklama:
      "Karelerden oluşan zeminde, bedenin veya nesnelerin yatay (yana) ve dikey (ileri-geri) yönlerde hareket ettirilmesi sağlanır.",
    ornekler: [
      {
        id: 1,
        karakter: "🚗",
        karakterAdi: "Şimşek Araba",
        soruMetni: "Şimşek Araba dümdüz ileriye (dikey yola) gaz basmak istiyor. İLERİ OK simgesine dokun!",
        hedefSekil: "Yukarı Ok ⬆️",
        secenekler: [
          { id: "a", sembol: "⬆️", aciklama: "Dikey İleri", dogru: true },
          { id: "b", sembol: "🔄", aciklama: "Dönemeç", dogru: false },
          { id: "c", sembol: "↗️", aciklama: "Çapraz", dogru: false },
        ],
        dogruMesaj: "Vınnn! Dikey hat üzerinde ileriye doğru hızla ilerledin!",
      },
      {
        id: 2,
        karakter: "🐼",
        karakterAdi: "Panda Po",
        soruMetni: "Panda Po sağa doğru yan yan (yatay) yürümek istiyor. YANA OK işaretine bas!",
        hedefSekil: "Sağa Ok ➡️",
        secenekler: [
          { id: "a", sembol: "⬇️", aciklama: "Aşağı", dogru: false },
          { id: "b", sembol: "➡️", aciklama: "Yatay Sağa", dogru: true },
          { id: "c", sembol: "⚡", aciklama: "Şimşek", dogru: false },
        ],
        dogruMesaj: "Harika adımlar! Yatay yollarda sağa ve sola dümdüz kayabilirsin!",
      },
      {
        id: 3,
        karakter: "🐻",
        karakterAdi: "Ayıcık Bobo",
        soruMetni: "Bobo düz caddelerin ortasındaki TATLI BAL KAVANOZU'nu bulmak istiyor. Bal sembolüne tıkla!",
        hedefSekil: "Bal 🍯",
        secenekler: [
          { id: "a", sembol: "🍯", aciklama: "Tatlı Bal", dogru: true },
          { id: "b", sembol: "🍄", aciklama: "Mantar", dogru: false },
          { id: "c", sembol: "🌵", aciklama: "Diken", dogru: false },
        ],
        dogruMesaj: "Nefis! Bobo düz caddeden yürüyüp balını afiyetle aldı!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 1.3.",
    uniteId: 1,
    uniteBaslik: "1. Satranç Oyunu, Tahtası ve Yönler",
    baslik: "Satranç tahtasında nesneleri çapraz yönlerde hareket ettirir.",
    resmiAciklama:
      "Çapraz yön kavramı uygulamalı olarak nesnelerle gösterilir ve kareler üzerinde pekiştirilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🚀",
        karakterAdi: "Roket Ali",
        soruMetni: "Roket Ali gökyüzüne doğru çapraz süzülmek istiyor. ÇAPRAZ OK sembolünü bul ve ateşle!",
        hedefSekil: "Çapraz Ok ↗️",
        secenekler: [
          { id: "a", sembol: "➡️", aciklama: "Düz Yatay", dogru: false },
          { id: "b", sembol: "↗️", aciklama: "Çapraz Uçuş", dogru: true },
          { id: "c", sembol: "⬇️", aciklama: "Düz Aşağı", dogru: false },
        ],
        dogruMesaj: "3, 2, 1... Ateş! Çapraz patikada gökyüzüne uçtun!",
      },
      {
        id: 2,
        karakter: "🦜",
        karakterAdi: "Papağan Riki",
        soruMetni: "Riki aynı renkteki çapraz kareler boyunca uçuyor. Çapraz patikanın sonundaki RENKLİ TÜY'e bas!",
        hedefSekil: "Tüy 🪶",
        secenekler: [
          { id: "a", sembol: "🪨", aciklama: "Kaya", dogru: false },
          { id: "b", sembol: "🪶", aciklama: "Sihirli Tüy", dogru: true },
          { id: "c", sembol: "🧱", aciklama: "Duvar", dogru: false },
        ],
        dogruMesaj: "Riki çaprazdan süzülüp sihirli tüyünü yakaladı!",
      },
      {
        id: 3,
        karakter: "🐱",
        karakterAdi: "Yavru Kedi Mırmır",
        soruMetni: "Mırmır çapraz köşedeki KIRMIZI KALP'e koşmak istiyor. Kırmızı Kalbe basarak ona yolu göster!",
        hedefSekil: "Kırmızı Kalp ❤️",
        secenekler: [
          { id: "a", sembol: "❤️", aciklama: "Sevgi Kalbi", dogru: true },
          { id: "b", sembol: "⚽", aciklama: "Top", dogru: false },
          { id: "c", sembol: "🚗", aciklama: "Araba", dogru: false },
        ],
        dogruMesaj: "Miyav! Mırmır çapraz patikadan sevgi kalbine ulaştı!",
      },
    ],
  },

  // 2. ÜNİTE
  {
    kod: "ST.OÖ. 2.1.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Kale taşının hareketini uygular.",
    resmiAciklama:
      "Kale taşı tanıtılır, dümdüz ileri, geri ve yanlara hareket ettiği gösterilir ve denettirilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🏰",
        karakterAdi: "Muhafız Kale",
        soruMetni: "Kaya gibi sağlam Kale dümdüz ileriye fırlamak istiyor. DÜZ ARTI İŞARETİNE dokun!",
        hedefSekil: "Artı ➕",
        secenekler: [
          { id: "a", sembol: "❌", aciklama: "Çarpı", dogru: false },
          { id: "b", sembol: "➕", aciklama: "Düz Hatlar (+)", dogru: true },
          { id: "c", sembol: "🌀", aciklama: "Girdap", dogru: false },
        ],
        dogruMesaj: "Harika! Kaleler sadece artı (+) gibi düz caddelerde kayar!",
      },
      {
        id: 2,
        karakter: "🤖",
        karakterAdi: "Demir Robot",
        soruMetni: "Robot Kale yolundaki engellerin üzerinden atlayamaz. Yolu açmak için YEŞİL ANAHTAR'a bas!",
        hedefSekil: "Yeşil Anahtar 🗝️",
        secenekler: [
          { id: "a", sembol: "🗝️", aciklama: "Yolu Açan Anahtar", dogru: true },
          { id: "b", sembol: "💣", aciklama: "Engel", dogru: false },
          { id: "c", sembol: "🧱", aciklama: "Tuğla", dogru: false },
        ],
        dogruMesaj: "Yol temizlendi! Kale dümdüz koridordan hedefe vardı!",
      },
      {
        id: 3,
        karakter: "🦁",
        karakterAdi: "Cesur Aslan",
        soruMetni: "Aslan köşedeki Kaleyi koruyor. Kalenin değerini simgeleyen 5 ALTIN YILDIZ'a tıkla!",
        hedefSekil: "Altın Yıldız 🌟",
        secenekler: [
          { id: "a", sembol: "🌟", aciklama: "5 Puanlık Güç", dogru: true },
          { id: "b", sembol: "🍂", aciklama: "1 Puan", dogru: false },
          { id: "c", sembol: "💧", aciklama: "Su Damlası", dogru: false },
        ],
        dogruMesaj: "Bravo! Kale 5 puan gücünde sağlam bir taştır!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 2.2.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Fil taşının hareketini uygular.",
    resmiAciklama:
      "Fil taşının çapraz hareketleri ve doğduğu karenin renginde kalma kuralı pekiştirilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🐘",
        karakterAdi: "Uçan Fil Dumbo",
        soruMetni: "Beyaz karede başlayan Fil sadece beyaz çapraz patikada koşar. ÇARPI İŞARETİNE (X) bas!",
        hedefSekil: "Çarpı ❌",
        secenekler: [
          { id: "a", sembol: "➕", aciklama: "Düz Hat", dogru: false },
          { id: "b", sembol: "❌", aciklama: "Çapraz Hat (X)", dogru: true },
          { id: "c", sembol: "⭕", aciklama: "Çember", dogru: false },
        ],
        dogruMesaj: "Mükemmel! Filler tahtada bir 'X' çizer gibi çapraz uçar!",
      },
      {
        id: 2,
        karakter: "🧙‍♂️",
        karakterAdi: "Sihirbaz Fil",
        soruMetni: "Filimiz beyaz patikadaki SİHİRLİ ELMAS'a ulaşmak istiyor. Mavi Elmasa dokun!",
        hedefSekil: "Mavi Elmas 💎",
        secenekler: [
          { id: "a", sembol: "💎", aciklama: "Sihirli Elmas", dogru: true },
          { id: "b", sembol: "🪵", aciklama: "Kuru Odun", dogru: false },
          { id: "c", sembol: "🕸️", aciklama: "Örümcek Ağı", dogru: false },
        ],
        dogruMesaj: "Sihirli elmas parıldadı! Fil renginden asla ayrılmadı!",
      },
      {
        id: 3,
        karakter: "🦄",
        karakterAdi: "Tekboynuz Filo",
        soruMetni: "Filin 3 puan değerindeki sihirli gücünü uyandırmak için PEMBE KALP'e bas!",
        hedefSekil: "Pembe Kalp 💖",
        secenekler: [
          { id: "a", sembol: "💖", aciklama: "3 Puanlık Sevgi", dogru: true },
          { id: "b", sembol: "⛈️", aciklama: "Fırtına", dogru: false },
          { id: "c", sembol: "🕳️", aciklama: "Çukur", dogru: false },
        ],
        dogruMesaj: "Çapraz patikalar sevgiyle doldu! Fil 3 puan kazandı!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 2.3.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Vezir taşının hareketini uygular.",
    resmiAciklama:
      "Vezirin hem kale gibi düz hem fil gibi çapraz hareket ettiği ve gücü gösterilir.",
    ornekler: [
      {
        id: 1,
        karakter: "👸",
        karakterAdi: "Süper Prenses Vezir",
        soruMetni: "Vezir tahtanın en güçlü kahramanıdır. Başındaki PARLAK KRALİYET TACI'na tıkla!",
        hedefSekil: "Taç 👑",
        secenekler: [
          { id: "a", sembol: "👑", aciklama: "Işıltılı Taç", dogru: true },
          { id: "b", sembol: "🧢", aciklama: "Şapka", dogru: false },
          { id: "c", sembol: "👒", aciklama: "Hasır Şapka", dogru: false },
        ],
        dogruMesaj: "Taç parıldıyor! Vezir hem düz hem çapraz her yere gidebilir!",
      },
      {
        id: 2,
        karakter: "🦸‍♀️",
        karakterAdi: "Kahraman Vezir",
        soruMetni: "Kahraman Vezir 9 puanlık süper gücünü kullanmak için ŞİMŞEK İŞARETİ'ne basmak istiyor!",
        hedefSekil: "Şimşek ⚡",
        secenekler: [
          { id: "a", sembol: "🐢", aciklama: "Kaplumbağa", dogru: false },
          { id: "b", sembol: "⚡", aciklama: "Süper Güç Şimşeği", dogru: true },
          { id: "c", sembol: "🐌", aciklama: "Salyangoz", dogru: false },
        ],
        dogruMesaj: "Vooov! Vezir 9 piyon gücünde şimşek gibi hızlandı!",
      },
      {
        id: 3,
        karakter: "🧚‍♀️",
        karakterAdi: "Orman Perisi Vezir",
        soruMetni: "Vezir krallığı korumak için SİHİRLİ DEĞNEK sembolünü arıyor. Sihirli değneğe dokun!",
        hedefSekil: "Değnek 🪄",
        secenekler: [
          { id: "a", sembol: "🪄", aciklama: "Sihirli Değnek", dogru: true },
          { id: "b", sembol: "🥄", aciklama: "Kaşık", dogru: false },
          { id: "c", sembol: "🧹", aciklama: "Süpürge", dogru: false },
        ],
        dogruMesaj: "Tüm tahta koruma altında! Vezir tek başına ordu gibi!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 2.4.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Şah taşının hareketini uygular.",
    resmiAciklama:
      "Şahın her yöne sadece 1 adım gidebildiği ve oyunun kalbi olduğu benimsetilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🤴",
        karakterAdi: "Bilge Şah",
        soruMetni: "Bilge Şah ağırbaşlıdır ve her defasında sadece 1 ADIM atar. 1 RAKAMI kutusuna bas!",
        hedefSekil: "1 Rakamı 1️⃣",
        secenekler: [
          { id: "a", sembol: "1️⃣", aciklama: "Tek 1 Adım", dogru: true },
          { id: "b", sembol: "5️⃣", aciklama: "Beş Adım", dogru: false },
          { id: "c", sembol: "🔟", aciklama: "On Adım", dogru: false },
        ],
        dogruMesaj: "Çok doğru! Şah her yöne ama sadece bir adım ilerler!",
      },
      {
        id: 2,
        karakter: "🦉",
        karakterAdi: "Bilge Baykuş",
        soruMetni: "Şah asla tehlikeli kareye basamaz. Onu koruyan GÜVENLİ KALKAN sembolüne dokun!",
        hedefSekil: "Kalkan 🛡️",
        secenekler: [
          { id: "a", sembol: "🛡️", aciklama: "Güvenli Kalkan", dogru: true },
          { id: "b", sembol: "🔥", aciklama: "Ateş Çukuru", dogru: false },
          { id: "c", sembol: "🪤", aciklama: "Tuzak", dogru: false },
        ],
        dogruMesaj: "Kalkan hazır! Bilge Şah güvenli karesinde dinleniyor!",
      },
      {
        id: 3,
        karakter: "🦁",
        karakterAdi: "Aslan Kral Şah",
        soruMetni: "Kral Şah'ın gücü paha biçilemez ve sınırsızdır. SONSUZLUK İŞARETİNE dokun!",
        hedefSekil: "Sonsuzluk ♾️",
        secenekler: [
          { id: "a", sembol: "♾️", aciklama: "Sonsuz Puan", dogru: true },
          { id: "b", sembol: "0️⃣", aciklama: "Sıfır", dogru: false },
          { id: "c", sembol: "❌", aciklama: "Yok", dogru: false },
        ],
        dogruMesaj: "Harika! Şahın puanı ölçülemez, o yakalanırsa oyun biter!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 2.5.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "At taşının hareketini uygular.",
    resmiAciklama:
      "Atın taşların üzerinden atlayabilen tek taş olduğu ve 'L' harfi şeklinde yürüdüğü kavratılır.",
    ornekler: [
      {
        id: 1,
        karakter: "🐴",
        karakterAdi: "Sevimli Tay Pony",
        soruMetni: "Pony dans ederken 'L' harfi çiziyor! İki adım ileri, bir adım yana: L HARFİNE bas!",
        hedefSekil: "L Harfi 🇱",
        secenekler: [
          { id: "a", sembol: "🇴", aciklama: "O Harfi", dogru: false },
          { id: "b", sembol: "🇱", aciklama: "L Dansı", dogru: true },
          { id: "c", sembol: "🇿", aciklama: "Z Harfi", dogru: false },
        ],
        dogruMesaj: "Dıgıdık dıgıdık! Pony tam bir 'L' çizerek neşeyle zıpladı!",
      },
      {
        id: 2,
        karakter: "🦘",
        karakterAdi: "Kanguru Zıpzıp",
        soruMetni: "Taşların üzerinden hop diye atlayan tek dostumuz kimdir? UÇAN AT NALI sembolüne dokun!",
        hedefSekil: "At Nalı 🧲",
        secenekler: [
          { id: "a", sembol: "🧲", aciklama: "Sihirli At Nalı", dogru: true },
          { id: "b", sembol: "🐢", aciklama: "Ağır Kaplumbağa", dogru: false },
          { id: "c", sembol: "⚓", aciklama: "Ağır Çapa", dogru: false },
        ],
        dogruMesaj: "Hop! Engellerin üzerinden tek hamlede zıplayıp geçti!",
      },
      {
        id: 3,
        karakter: "🎠",
        karakterAdi: "Lunapark Atı",
        soruMetni: "At 3 puan gücündedir. Lunaparktaki SEVİMLİ HAVUÇ ödülünü ata yedirmek için havuca tıkla!",
        hedefSekil: "Taze Havuç 🥕",
        secenekler: [
          { id: "a", sembol: "🥕", aciklama: "Taze Havuç", dogru: true },
          { id: "b", sembol: "🌶️", aciklama: "Acı Biber", dogru: false },
          { id: "c", sembol: "🍋", aciklama: "Ekşi Limon", dogru: false },
        ],
        dogruMesaj: "Kütür kütür! At havucu yedi ve tahtanın merkezine zıpladı!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 2.6.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Piyon taşının hareketini uygular.",
    resmiAciklama:
      "Piyonun ileriye düz yürüdüğü, başlangıçta 2 adım atabildiği ve çapraz taş aldığı gösterilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🐜",
        karakterAdi: "Cesur Karınca Piyon",
        soruMetni: "Piyonlar asla geri adım atmaz! Cesur karıncanın İLERİ ADIM OKU'na tıkla!",
        hedefSekil: "Düz İleri ⬆️",
        secenekler: [
          { id: "a", sembol: "⬇️", aciklama: "Geriye Adım (Yasak)", dogru: false },
          { id: "b", sembol: "⬆️", aciklama: "Sadece İleriye", dogru: true },
          { id: "c", sembol: "↩️", aciklama: "Geri Dönüş", dogru: false },
        ],
        dogruMesaj: "Bravo! Piyonlar daima ileriye yürür, arkalarına hiç bakmaz!",
      },
      {
        id: 2,
        karakter: "🐣",
        karakterAdi: "Minik Civciv",
        soruMetni: "Civciv başlangıç yuvasındayken enerjisi bol! İsterse kaç adım fırlayabilir? 2 ADIM kutusuna bas!",
        hedefSekil: "2 Adım 2️⃣",
        secenekler: [
          { id: "a", sembol: "5️⃣", aciklama: "5 Adım", dogru: false },
          { id: "b", sembol: "2️⃣", aciklama: "2 Adım Zıplama", dogru: true },
          { id: "c", sembol: "8️⃣", aciklama: "8 Adım", dogru: false },
        ],
        dogruMesaj: "Harikasın! Piyon başlangıç çizgisinden 2 adım fırlayabilir!",
      },
      {
        id: 3,
        karakter: "🐱",
        karakterAdi: "Akıllı Kedi",
        soruMetni: "Piyon düz yürür ama taşları ÇAPRAZ alır! Çaprazdaki KIRMIZI ELMA'ya basıp taşı al!",
        hedefSekil: "Kırmızı Elma 🍎",
        secenekler: [
          { id: "a", sembol: "🍎", aciklama: "Çaprazdaki Elma", dogru: true },
          { id: "b", sembol: "🥥", aciklama: "Öndeki Engel", dogru: false },
          { id: "c", sembol: "📦", aciklama: "Kutu", dogru: false },
        ],
        dogruMesaj: "Ham! Piyon çaprazındaki elmayı afiyetle aldı!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 2.7.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Piyon terfisini uygular.",
    resmiAciklama:
      "En son sıraya ulaşan piyonun vezir, kale, fil veya ata dönüşmesi kuralı işlenir.",
    ornekler: [
      {
        id: 1,
        karakter: "🐛",
        karakterAdi: "Tırtıl Piyon",
        soruMetni: "Son sıraya varan piyon kelebek gibi terfi eder ve Vezir olur! VEZİR TACI'na basarak terfi et!",
        hedefSekil: "Taç 👑",
        secenekler: [
          { id: "a", sembol: "👑", aciklama: "Vezir Terfisi", dogru: true },
          { id: "b", sembol: "🪨", aciklama: "Taş Olarak Kal", dogru: false },
          { id: "c", sembol: "💤", aciklama: "Uyu", dogru: false },
        ],
        dogruMesaj: "Tebrikler! Minik piyon tahtanın en güçlü Veziri'ne dönüştü!",
      },
      {
        id: 2,
        karakter: "✨",
        karakterAdi: "Sihirli Yıldız",
        soruMetni: "Piyon son kareye ulaştığında hangisine DÖNÜŞEMEZ? ŞAH simgesine bas (Şah asla alınamaz veya terfi edilemez)!",
        hedefSekil: "Şah 🤴",
        secenekler: [
          { id: "a", sembol: "♛", aciklama: "Vezir Olabilir", dogru: false },
          { id: "b", sembol: "🤴", aciklama: "İkinci Bir Şah Olamaz", dogru: true },
          { id: "c", sembol: "♜", aciklama: "Kale Olabilir", dogru: false },
        ],
        dogruMesaj: "Çok akıllıca! Piyon vezir, kale, fil, at olabilir ama şah olamaz!",
      },
      {
        id: 3,
        karakter: "🏅",
        karakterAdi: "Şampiyon Çocuk",
        soruMetni: "8. yataydaki altın madalyaya ulaşan piyon terfi kutlaması yapıyor. ALTIN KUPA'ya tıkla!",
        hedefSekil: "Kupa 🏆",
        secenekler: [
          { id: "a", sembol: "🏆", aciklama: "Terfi Kupası", dogru: true },
          { id: "b", sembol: "🧯", aciklama: "Tüp", dogru: false },
          { id: "c", sembol: "🗑️", aciklama: "Kova", dogru: false },
        ],
        dogruMesaj: "Kupa senin! Piyonun büyük rüyası gerçek oldu!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 2.8.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Satrançtaki başlangıç konumunu dizer.",
    resmiAciklama:
      "Sağ alt köşe beyaz kuralı, vezirin rengi ve tüm taşların başlangıç karelerine dizilimi öğretilir.",
    ornekler: [
      {
        id: 1,
        karakter: "👗",
        karakterAdi: "Modacı Prenses",
        soruMetni: "'Beyaz vezir beyaz elbiseyi, siyah vezir siyah elbiseyi sever!' BEYAZ ELBİSE'ye dokun!",
        hedefSekil: "Beyaz Elbise 🤍",
        secenekler: [
          { id: "a", sembol: "🤍", aciklama: "Beyaz Vezir Beyaz Kareye", dogru: true },
          { id: "b", sembol: "🖤", aciklama: "Ters Renk", dogru: false },
          { id: "c", sembol: "🟣", aciklama: "Mor Kare", dogru: false },
        ],
        dogruMesaj: "Harika! Beyaz vezir kendi rengi olan d1 beyaz karesine oturdu!",
      },
      {
        id: 2,
        karakter: "🏰",
        karakterAdi: "Saray Bekçisi",
        soruMetni: "Tahtanın 4 en uç köşesine hangi güçlü nöbetçiler oturur? KALE KULESİ'ne tıkla!",
        hedefSekil: "Kale ♜",
        secenekler: [
          { id: "a", sembol: "♜", aciklama: "Köşelerdeki Kaleler", dogru: true },
          { id: "b", sembol: "♟️", aciklama: "Piyon", dogru: false },
          { id: "c", sembol: "♚", aciklama: "Şah", dogru: false },
        ],
        dogruMesaj: "Köşeler güvende! 4 köşede 4 sağlam Kale nöbette!",
      },
      {
        id: 3,
        karakter: "💂‍♂️",
        karakterAdi: "Muhafız Alayı",
        soruMetni: "Ön sırayı boydan boya kaplayan 8 tane cesur askere ne denir? PİYON simgesine bas!",
        hedefSekil: "Piyon Asker ♟️",
        secenekler: [
          { id: "a", sembol: "♟️", aciklama: "8 Küçük Piyon", dogru: true },
          { id: "b", sembol: "🚀", aciklama: "Roket", dogru: false },
          { id: "c", sembol: "🛸", aciklama: "Ufo", dogru: false },
        ],
        dogruMesaj: "Duvar örüldü! Piyon ordusu ikinci sıraya dizildi!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 2.9.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Taşların puan değerlerini kavrar.",
    resmiAciklama:
      "Piyon (1), At (3), Fil (3), Kale (5), Vezir (9) ve Şahın sonsuz değeri karşılaştırılır.",
    ornekler: [
      {
        id: 1,
        karakter: "⚖️",
        karakterAdi: "Adalet Terazisi",
        soruMetni: "9 Puanlık devasa gücüyle tahtanın en değerli taşı kimdir? SÜPER VEZİR'e bas!",
        hedefSekil: "Vezir ♛",
        secenekler: [
          { id: "a", sembol: "♟️", aciklama: "Piyon (1)", dogru: false },
          { id: "b", sembol: "♛", aciklama: "Vezir (9 Puan)", dogru: true },
          { id: "c", sembol: "♞", aciklama: "At (3 Puan)", dogru: false },
        ],
        dogruMesaj: "Doğru! Vezir tam 9 piyon değerindedir!",
      },
      {
        id: 2,
        karakter: "🎯",
        karakterAdi: "Puan Avcısı",
        soruMetni: "Kale kaç piyon değerindedir? 5 RAKAMI kutusuna dokun!",
        hedefSekil: "5 Rakamı 5️⃣",
        secenekler: [
          { id: "a", sembol: "1️⃣", aciklama: "1 Puan", dogru: false },
          { id: "b", sembol: "5️⃣", aciklama: "5 Puan", dogru: true },
          { id: "c", sembol: "9️⃣", aciklama: "9 Puan", dogru: false },
        ],
        dogruMesaj: "Bravo! Kale tam 5 puan gücündedir!",
      },
      {
        id: 3,
        karakter: "💎",
        karakterAdi: "Hazine Sandığı",
        soruMetni: "At ve Fil kardeşlerin puanı eşittir (3 puan). 3 ALTIN SİMGESİ'ne tıkla!",
        hedefSekil: "3 Altın 🪙",
        secenekler: [
          { id: "a", sembol: "🪙", aciklama: "3 Puanlık Hafif Taşlar", dogru: true },
          { id: "b", sembol: "🍂", aciklama: "Değersiz Yaprak", dogru: false },
          { id: "c", sembol: "🪵", aciklama: "Odun", dogru: false },
        ],
        dogruMesaj: "Harika hesap! At da Fil de 3'er puandır!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 2.10.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Satrançta taş almayı bilir.",
    resmiAciklama:
      "İyi taş alışı, kötü taş alışı ve taş değişimleri puan değerleri kıyaslanarak incelenir.",
    ornekler: [
      {
        id: 1,
        karakter: "🦊",
        karakterAdi: "Kurnaz Tilki",
        soruMetni: "1 puanlık piyonumuzla rakibin 9 puanlık Vezirini alırsak bu harika bir alış mıdır? YEŞİL TİK'e bas!",
        hedefSekil: "Yeşil Tik ✅",
        secenekler: [
          { id: "a", sembol: "✅", aciklama: "Çok Karlı İyi Alış!", dogru: true },
          { id: "b", sembol: "❌", aciklama: "Kötü Alış", dogru: false },
          { id: "c", sembol: "⚠️", aciklama: "Tehlikeli", dogru: false },
        ],
        dogruMesaj: "Muazzam kazanç! 1 puana karşılık 9 puanlık dev bir vezir kazandın!",
      },
      {
        id: 2,
        karakter: "🐻",
        karakterAdi: "Dalgın Ayı",
        soruMetni: "5 puanlık Kalemizle korunan 1 puanlık piyonu alıp kaleyi feda etmek iyi midir? KIRMIZI ÇARPI'ya bas!",
        hedefSekil: "Kırmızı Çarpı ❌",
        secenekler: [
          { id: "a", sembol: "❌", aciklama: "Zararlı Kötü Alış!", dogru: true },
          { id: "b", sembol: "✅", aciklama: "İyi Alış", dogru: false },
          { id: "c", sembol: "🎉", aciklama: "Kutlama", dogru: false },
        ],
        dogruMesaj: "Bravo! Değerli taşları ucuz taşlar için feda etmemeliyiz!",
      },
      {
        id: 3,
        karakter: "🤝",
        karakterAdi: "Dost Filo",
        soruMetni: "Filimizle rakibin Filini aldığımızda buna 'Eşit Taş Değişimi' denir. EŞİTTİR İŞARETİ'ne bas!",
        hedefSekil: "Eşittir 🟰",
        secenekler: [
          { id: "a", sembol: "🟰", aciklama: "3 Puana 3 Puan Eşit", dogru: true },
          { id: "b", sembol: "➕", aciklama: "Artı", dogru: false },
          { id: "c", sembol: "➖", aciklama: "Eksi", dogru: false },
        ],
        dogruMesaj: "Harika! İki taraf da eşit güçte taş değişmiş oldu!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 2.11.",
    uniteId: 2,
    uniteBaslik: "2. Taşlar ve Özellikleri",
    baslik: "Satrançta saldırı altındaki taşın koruması kavramını açıklar.",
    resmiAciklama:
      "Korumalı ve korumasız taş ayrımı yapılır; taşların birbirine destek olması öğretilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🛡️",
        karakterAdi: "Kalkan Kardeşliği",
        soruMetni: "Arkadaşı piyon tarafından korunan bir At güvendedir! GÜVENLİ MAVİ KALKAN'a tıkla!",
        hedefSekil: "Kalkan 🛡️",
        secenekler: [
          { id: "a", sembol: "🛡️", aciklama: "Korumalı Güvenli Taş", dogru: true },
          { id: "b", sembol: "🕳️", aciklama: "Sahipsiz Kuyu", dogru: false },
          { id: "c", sembol: "🍂", aciklama: "Korumasız Yaprak", dogru: false },
        ],
        dogruMesaj: "Koruma devrede! Rakip bu atı alırsa biz de onun taşını alırız!",
      },
      {
        id: 2,
        karakter: "👀",
        karakterAdi: "Dikkatli Gözler",
        soruMetni: "Tahtada tek başına kalmış, hiçbir taşın korumadığı taşa ne denir? SAHİPSİZ YILDIZ'a tıkla!",
        hedefSekil: "Sahipsiz Yıldız 💫",
        secenekler: [
          { id: "a", sembol: "💫", aciklama: "Korumasız (Boşta) Taş", dogru: true },
          { id: "b", sembol: "🏰", aciklama: "Sağlam Şato", dogru: false },
          { id: "c", sembol: "🧱", aciklama: "Duvar", dogru: false },
        ],
        dogruMesaj: "Gözünden kaçmadı! Korumasız taşlar kolay hedef olur!",
      },
      {
        id: 3,
        karakter: "🐾",
        karakterAdi: "Yardımsever Pati",
        soruMetni: "Boştaki piyonumuza destek olmak için arkasından Kalemizi yaklaştırdık. YARDIM ELİ simgesine bas!",
        hedefSekil: "Yardım Eli 🤝",
        secenekler: [
          { id: "a", sembol: "🤝", aciklama: "Taşı Korumaya Al", dogru: true },
          { id: "b", sembol: "💤", aciklama: "Boşver", dogru: false },
          { id: "c", sembol: "🏃", aciklama: "Kaç", dogru: false },
        ],
        dogruMesaj: "Dayanışma kazandı! Artık piyonumuz koruma altında!",
      },
    ],
  },

  // 3. ÜNİTE
  {
    kod: "ST.OÖ. 3.1.",
    uniteId: 3,
    uniteBaslik: "3. Satrançta Şah Tehdidi ve Mat",
    baslik: "Şahın, oyun için önemini açıklar.",
    resmiAciklama:
      "Satranç oyununun nihai amacının rakip şahı köşeye sıkıştırmak olduğu kavratılır.",
    ornekler: [
      {
        id: 1,
        karakter: "🎯",
        karakterAdi: "Hedef Dedektifi",
        soruMetni: "Satrançta bütün taşların asıl hedefi hangi taştır? BİLGE ŞAH'a dokun!",
        hedefSekil: "Şah ♚",
        secenekler: [
          { id: "a", sembol: "♚", aciklama: "Hedef Şahtır", dogru: true },
          { id: "b", sembol: "♟️", aciklama: "Piyon", dogru: false },
          { id: "c", sembol: "♝", aciklama: "Fil", dogru: false },
        ],
        dogruMesaj: "Tam isabet! Satranç şahı ele geçirme ve koruma oyunudur!",
      },
      {
        id: 2,
        karakter: "🛑",
        karakterAdi: "Hakem Düdüğü",
        soruMetni: "Şah kaçamayacak şekilde sıkışırsa (Mat olursa) maç biter mi? BİTİŞ BAYRAĞI'na bas!",
        hedefSekil: "Damalı Bayrak 🏁",
        secenekler: [
          { id: "a", sembol: "🏁", aciklama: "Oyun Sona Erer", dogru: true },
          { id: "b", sembol: "⏳", aciklama: "Sonsuza Dek Sürer", dogru: false },
          { id: "c", sembol: "🔁", aciklama: "Başa Döner", dogru: false },
        ],
        dogruMesaj: "Bayrak sallandı! Şah mat olunca maç tamamlanır!",
      },
      {
        id: 3,
        karakter: "👑",
        karakterAdi: "Saray Muhafızı",
        soruMetni: "Krallığın kalbi olan ŞAH'ı korumak için sevimli KALP simgesine bas!",
        hedefSekil: "Kırmızı Kalp ❤️",
        secenekler: [
          { id: "a", sembol: "❤️", aciklama: "Şahı Kalbimiz Gibi Koruruz", dogru: true },
          { id: "b", sembol: "🗑️", aciklama: "Unuturuz", dogru: false },
          { id: "c", sembol: "⚡", aciklama: "Tehlikeye Atarız", dogru: false },
        ],
        dogruMesaj: "Şah güven altına alındı, krallık huzurla doldu!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 3.2.",
    uniteId: 3,
    uniteBaslik: "3. Satrançta Şah Tehdidi ve Mat",
    baslik: "Şah çeker.",
    resmiAciklama:
      "Bir veya daha fazla taşın karşı şaha doğrudan saldırması durumu (şah çekmek) uygulatılır.",
    ornekler: [
      {
        id: 1,
        karakter: "📢",
        karakterAdi: "Haberci Kuş",
        soruMetni: "Taşımız şaha doğrudan saldırdığında ne deriz? 'ŞAH!' UYARI KORNASI'na tıkla!",
        hedefSekil: "Korna 📣",
        secenekler: [
          { id: "a", sembol: "📣", aciklama: "'ŞAH!' Uyarısı", dogru: true },
          { id: "b", sembol: "🤫", aciklama: "Sessizlik", dogru: false },
          { id: "c", sembol: "😴", aciklama: "Uyku", dogru: false },
        ],
        dogruMesaj: "ŞAH! Rakip hemen şahını kurtarmak zorundadır!",
      },
      {
        id: 2,
        karakter: "🏹",
        karakterAdi: "Okçu Fil",
        soruMetni: "Çaprazdan şaha bakan Fil şah çekiyor. Filin HEDEF OKU'na bas!",
        hedefSekil: "Ok 🏹",
        secenekler: [
          { id: "a", sembol: "🏹", aciklama: "Şaha Çapraz Tehdit", dogru: true },
          { id: "b", sembol: "🪃", aciklama: "Bumerang", dogru: false },
          { id: "c", sembol: "🪂", aciklama: "Paraşüt", dogru: false },
        ],
        dogruMesaj: "Hedef şah! Fil şah çekişini başarıyla yaptı!",
      },
      {
        id: 3,
        karakter: "⚡",
        karakterAdi: "Şimşek Kale",
        soruMetni: "Düz caddeden şaha doğru kayıp şah çeken Kalenin YILDIRIM simgesine bas!",
        hedefSekil: "Yıldırım ⚡",
        secenekler: [
          { id: "a", sembol: "⚡", aciklama: "Düz Hattan Şah Çekiş", dogru: true },
          { id: "b", sembol: "💧", aciklama: "Su Damlası", dogru: false },
          { id: "c", sembol: "🌾", aciklama: "Buğday", dogru: false },
        ],
        dogruMesaj: "Göz açıp kapayıncaya kadar şah çekildi!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 3.3.",
    uniteId: 3,
    uniteBaslik: "3. Satrançta Şah Tehdidi ve Mat",
    baslik: "Şah tehdidinden çeşitli teknikleri uygulayarak kurtulur.",
    resmiAciklama:
      "Şah tehdidinden 3 kurtulma yolu öğretilir: 1. Kaçmak, 2. Tehdit eden taşı almak, 3. Araya taş koymak (Perdeleme).",
    ornekler: [
      {
        id: 1,
        karakter: "🏃‍♂️",
        karakterAdi: "Hızlı Ayaklar",
        soruMetni: "1. Kurtuluş Yolu: Şahı güvenli ve boş bir kareye KAÇIRMAK! KAÇAN AYAKKABI'ya bas!",
        hedefSekil: "Ayakkabı 👟",
        secenekler: [
          { id: "a", sembol: "👟", aciklama: "Güvenli Kareye Kaç", dogru: true },
          { id: "b", sembol: "🛑", aciklama: "Olduğun Yerde Dur (Yasak)", dogru: false },
          { id: "c", sembol: "🛋️", aciklama: "Koltukta Otur", dogru: false },
        ],
        dogruMesaj: "Tıkır tıkır! Şah güvenli komşu kareye kaçarak kurtuldu!",
      },
      {
        id: 2,
        karakter: "⚔️",
        karakterAdi: "Cesur Şövalye",
        soruMetni: "2. Kurtuluş Yolu: Bize şah çeken rakip taşı ALMAK! KILIÇ KALKAN simgesine bas!",
        hedefSekil: "Kılıçlar ⚔️",
        secenekler: [
          { id: "a", sembol: "⚔️", aciklama: "Tehdit Eden Taşı Al", dogru: true },
          { id: "b", sembol: "🏳️", aciklama: "Teslim Ol", dogru: false },
          { id: "c", sembol: "🎈", aciklama: "Balon Uçur", dogru: false },
        ],
        dogruMesaj: "Harika savunma! Tehdit eden taş tahtadan alındı ve şah rahatladı!",
      },
      {
        id: 3,
        karakter: "🧱",
        karakterAdi: "Kalkan Duvarı",
        soruMetni: "3. Kurtuluş Yolu: Araya dost bir taş koyup perdeleme yapmak! TUĞLA DUVAR'a tıkla!",
        hedefSekil: "Duvar 🧱",
        secenekler: [
          { id: "a", sembol: "🧱", aciklama: "Araya Perde Çek", dogru: true },
          { id: "b", sembol: "🪟", aciklama: "Açık Pencere", dogru: false },
          { id: "c", sembol: "🚪", aciklama: "Açık Kapı", dogru: false },
        ],
        dogruMesaj: "Duvar örüldü! Araya giren taş şahın önüne siper oldu!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 3.4.",
    uniteId: 3,
    uniteBaslik: "3. Satrançta Şah Tehdidi ve Mat",
    baslik: "Şahın diğer taşlar gibi alınamayacağını kavrar.",
    resmiAciklama:
      "Satrançta şah asla tahtadan dışarı çıkarılamaz ve yenilemez. Şahı yemek kural dışı hamledir.",
    ornekler: [
      {
        id: 1,
        karakter: "⛔",
        karakterAdi: "Trafik Polisi",
        soruMetni: "Satrançta şah tahtadan alınıp kenara koyulabilir mi? 'DUR' İŞARETİ'ne bas!",
        hedefSekil: "Dur İşareti 🛑",
        secenekler: [
          { id: "a", sembol: "🛑", aciklama: "HAYIR! Şah Asla Alınamaz", dogru: true },
          { id: "b", sembol: "🟢", aciklama: "Evet Alınır", dogru: false },
          { id: "c", sembol: "🟡", aciklama: "Bazen", dogru: false },
        ],
        dogruMesaj: "DUR! Satrançta şah asla yenmez ve tahtadan çıkarılmaz!",
      },
      {
        id: 2,
        karakter: "⚖️",
        karakterAdi: "Baş Hakem",
        soruMetni: "Şahı yemek isteyen bir oyuncuya hakem ne der? KURAL DIŞI DÜDÜK'e dokun!",
        hedefSekil: "Düdük 🎷",
        secenekler: [
          { id: "a", sembol: "🎷", aciklama: "Kural Dışı Hamle Uyarısı!", dogru: true },
          { id: "b", sembol: "👏", aciklama: "Alkışlar", dogru: false },
          { id: "c", sembol: "🎁", aciklama: "Ödül Verir", dogru: false },
        ],
        dogruMesaj: "Düüüt! Şah alınmaz, sadece mat edilir!",
      },
      {
        id: 3,
        karakter: "🏰",
        karakterAdi: "Kutsal Saray",
        soruMetni: "Şah oyunun son saniyesine kadar tahtada kalır. KORUNAN SARAY simgesine bas!",
        hedefSekil: "Saray 🏯",
        secenekler: [
          { id: "a", sembol: "🏯", aciklama: "Şah Tahtada Yaşar", dogru: true },
          { id: "b", sembol: "🗑️", aciklama: "Kutuya Atılır", dogru: false },
          { id: "c", sembol: "📦", aciklama: "Paketlenir", dogru: false },
        ],
        dogruMesaj: "Mükemmel! Şah oyun bitene kadar tahtanın kralıdır!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 3.5.",
    uniteId: 3,
    uniteBaslik: "3. Satrançta Şah Tehdidi ve Mat",
    baslik: "Mat etmeyi açıklar.",
    resmiAciklama:
      "Şah tehdit altındayken kaçamıyor, tehdit edeni alamıyor ve perdeleme yapamıyorsa mat olur.",
    ornekler: [
      {
        id: 1,
        karakter: "🎉",
        karakterAdi: "Kutlama Perisi",
        soruMetni: "Şah tehdit altında ve hiçbir yere kaçamıyor! Oyun MAT oldu! KONFETİ simgesine tıkla!",
        hedefSekil: "Konfeti 🎊",
        secenekler: [
          { id: "a", sembol: "🎊", aciklama: "ŞAH VE MAT!", dogru: true },
          { id: "b", sembol: "💤", aciklama: "Mola", dogru: false },
          { id: "c", sembol: "🌧️", aciklama: "Yağmur", dogru: false },
        ],
        dogruMesaj: "ŞAH VE MAT! Muhteşem bir stratejiyle oyunu kazandın!",
      },
      {
        id: 2,
        karakter: "🔒",
        karakterAdi: "Kilit Ustası",
        soruMetni: "Kaçacak hiçbir güvenli kare kalmadığında kilit kapanır. ALTIN KİLİT simgesine bas!",
        hedefSekil: "Kilit 🔒",
        secenekler: [
          { id: "a", sembol: "🔒", aciklama: "Tüm Yollar Kapalı", dogru: true },
          { id: "b", sembol: "🔓", aciklama: "Açık Kapı Var", dogru: false },
          { id: "c", sembol: "🚪", aciklama: "Aralık Kapı", dogru: false },
        ],
        dogruMesaj: "Kilit kapandı! Şah hiçbir güvenli yere kaçamıyor, bu bir MAT!",
      },
      {
        id: 3,
        karakter: "🏆",
        karakterAdi: "Kupa Canavarı",
        soruMetni: "Mat eden oyuncu maçı kazanır. ŞAMPİYONLUK KUPASI'na basarak zaferini kutla!",
        hedefSekil: "Kupa 🏆",
        secenekler: [
          { id: "a", sembol: "🏆", aciklama: "Zafer Kupası", dogru: true },
          { id: "b", sembol: "🩹", aciklama: "Yara Bandı", dogru: false },
          { id: "c", sembol: "🧹", aciklama: "Fırça", dogru: false },
        ],
        dogruMesaj: "Şampiyonsun! Mat hamlesini başarıyla kavradın!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 3.6.",
    uniteId: 3,
    uniteBaslik: "3. Satrançta Şah Tehdidi ve Mat",
    baslik: "Tek hamlelik mat alıştırmalarını yapar.",
    resmiAciklama:
      "Basit konumlarda son vuruşu yapan ve tek hamlede mat eden taş hareketi bulunur.",
    ornekler: [
      {
        id: 1,
        karakter: "🎯",
        karakterAdi: "Hedefçi Vezir",
        soruMetni: "Vezirimiz şahın dibine (f7 karesine) inip mat yapacak. HEDEF TAHTASI simgesine bas!",
        hedefSekil: "Hedef 🎯",
        secenekler: [
          { id: "a", sembol: "🎯", aciklama: "f7'den Çoban Matı Vuruşu", dogru: true },
          { id: "b", sembol: "🏖️", aciklama: "Kumsala Git", dogru: false },
          { id: "c", sembol: "🎪", aciklama: "Sirke Git", dogru: false },
        ],
        dogruMesaj: "Güm! Vezir şahın dibine kondu ve arkasındaki fil korumasıyla mat etti!",
      },
      {
        id: 2,
        karakter: "🏰",
        karakterAdi: "Nöbetçi Kale",
        soruMetni: "Kale son sıraya (8. yataya) inip arka sıra matı yapıyor. İNEN ASANSÖR OKU'na bas!",
        hedefSekil: "Aşağı Ok ⬇️",
        secenekler: [
          { id: "a", sembol: "⬇️", aciklama: "Son Sıraya Kale İnişi", dogru: true },
          { id: "b", sembol: "🔄", aciklama: "Dönme Dolap", dogru: false },
          { id: "c", sembol: "⬅️", aciklama: "Yana Kay", dogru: false },
        ],
        dogruMesaj: "Koridor matı! Kale son yataya indi ve kaçacak hava deliği yok!",
      },
      {
        id: 3,
        karakter: "⚡",
        karakterAdi: "Taktik Ustası",
        soruMetni: "Tek hamlelik matı bulmak için gözlerini dört aç! IŞILDAYAN AMPUL simgesine dokun!",
        hedefSekil: "Ampul 💡",
        secenekler: [
          { id: "a", sembol: "💡", aciklama: "İşte Mat Hamlesi!", dogru: true },
          { id: "b", sembol: "🕯️", aciklama: "Sönük Mum", dogru: false },
          { id: "c", sembol: "🔦", aciklama: "Pili Biten Fener", dogru: false },
        ],
        dogruMesaj: "Fikir parıldadı! Tek hamlelik mat başarıyla bulundu!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 3.7.",
    uniteId: 3,
    uniteBaslik: "3. Satrançta Şah Tehdidi ve Mat",
    baslik: "Pat durumunu bilir.",
    resmiAciklama:
      "Şah tehdit altında değilken yapacak hiçbir yasal hamle kalmamışsa oyunun berabere (pat) bittiği öğretilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🧊",
        karakterAdi: "Buzdan Heykel",
        soruMetni: "Şaha 'ŞAH' denmedi ama kımıldayacak tek bir karesi bile yok, dondu kaldı! BUZ simgesine bas!",
        hedefSekil: "Buz Küpü 🧊",
        secenekler: [
          { id: "a", sembol: "🧊", aciklama: "Dondu Kaldı: PAT!", dogru: true },
          { id: "b", sembol: "🔥", aciklama: "Erime", dogru: false },
          { id: "c", sembol: "🌊", aciklama: "Dalga", dogru: false },
        ],
        dogruMesaj: "Dondu kaldı! Şah tehdit altında değil ama oynayamaz, oyun PAT (Berabere)!",
      },
      {
        id: 2,
        karakter: "🤝",
        karakterAdi: "Barışçıl Panda",
        soruMetni: "Pat olunca kimse kaybetmez, maç yarım puanla dostça biter. BARIŞ GÜVERCİNİ'ne tıkla!",
        hedefSekil: "Güvercin 🕊️",
        secenekler: [
          { id: "a", sembol: "🕊️", aciklama: "Dostça Beraberlik (½ - ½)", dogru: true },
          { id: "b", sembol: "🥊", aciklama: "Kavga", dogru: false },
          { id: "c", sembol: "⚡", aciklama: "Öfke", dogru: false },
        ],
        dogruMesaj: "Güvercin uçtu! Pat durumunda maç berabere tamamlanır!",
      },
      {
        id: 3,
        karakter: "⚖️",
        karakterAdi: "Adalet Terazisi",
        soruMetni: "Pat durumunda skor tabelasında ne yazar? YARIM PUAN simgesine dokun!",
        hedefSekil: "Terazi ⚖️",
        secenekler: [
          { id: "a", sembol: "⚖️", aciklama: "Eşit Puan Paylaşımı", dogru: true },
          { id: "b", sembol: "0️⃣", aciklama: "Sıfır Puan", dogru: false },
          { id: "c", sembol: "❌", aciklama: "İptal", dogru: false },
        ],
        dogruMesaj: "Hakça paylaşıldı! Yarımşar puanla el sıkışıldı!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 3.8.",
    uniteId: 3,
    uniteBaslik: "3. Satrançta Şah Tehdidi ve Mat",
    baslik: "Berabere kalmanın ne olduğunu bilir.",
    resmiAciklama:
      "Taş yetmezliği (sadece iki şah kalması), 50 hamle kuralı ve anlaşmalı beraberlik durumları aktarılır.",
    ornekler: [
      {
        id: 1,
        karakter: "🏜️",
        karakterAdi: "Issız Çöl",
        soruMetni: "Tahtada sadece İKİ ŞAH kaldı, mat yapacak başka taş yok! İKİ ŞAHIN DOSTLUĞU kalbine bas!",
        hedefSekil: "Dostluk Kalbi 💛",
        secenekler: [
          { id: "a", sembol: "💛", aciklama: "Yetersiz Güçle Beraberlik", dogru: true },
          { id: "b", sembol: "⚔️", aciklama: "Savaş Devam Eder", dogru: false },
          { id: "c", sembol: "🧨", aciklama: "Patlama", dogru: false },
        ],
        dogruMesaj: "İki şah birbirini mat edemez! Yetersiz güç nedeniyle maç berabere biter!",
      },
      {
        id: 2,
        karakter: "🤝",
        karakterAdi: "Centilmen Çocuk",
        soruMetni: "İki oyuncu da kazanmanın imkansız olduğunu görüp el sıkışır. EL SIKIŞMA simgesine tıkla!",
        hedefSekil: "El Sıkışma 🤝",
        secenekler: [
          { id: "a", sembol: "🤝", aciklama: "Anlaşmalı Beraberlik", dogru: true },
          { id: "b", sembol: "🏃", aciklama: "Masadan Kaçış", dogru: false },
          { id: "c", sembol: "😭", aciklama: "Ağlama", dogru: false },
        ],
        dogruMesaj: "Centilmence el sıkışıldı! Bu sporun en güzel anlarından biridir!",
      },
      {
        id: 3,
        karakter: "⏳",
        karakterAdi: "Zaman Kum Saati",
        soruMetni: "Uzun süre hiçbir taş alınmaz ve piyon oynanmazsa 50 hamlede beraberlik olur. KUM SAATİ'ne bas!",
        hedefSekil: "Kum Saati ⏳",
        secenekler: [
          { id: "a", sembol: "⏳", aciklama: "50 Hamle Kuralı Beraberliği", dogru: true },
          { id: "b", sembol: "⏰", aciklama: "Alarm", dogru: false },
          { id: "c", sembol: "🧭", aciklama: "Pusula", dogru: false },
        ],
        dogruMesaj: "Süre doldu! Satranç kuralları gereği oyun berabere sayıldı!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 3.9.",
    uniteId: 3,
    uniteBaslik: "3. Satrançta Şah Tehdidi ve Mat",
    baslik: "Mat ile pat konumlarını ayırt eder.",
    resmiAciklama:
      "Mat (şah tehdit altında + kaçış yok) ile Pat (şah tehdit altında değil + hamle yok) arasındaki fark pekiştirilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🔍",
        karakterAdi: "Dedektif Büyüteç",
        soruMetni: "Şaha 'ŞAH!' çekiliyor mu? Eğer şah tehdit altındaysa ve kaçış yoksa bu MAT'tır! KAZANAN TACA bas!",
        hedefSekil: "Mat Tacı 👑",
        secenekler: [
          { id: "a", sembol: "👑", aciklama: "Şah Tehdidi Var = MAT", dogru: true },
          { id: "b", sembol: "🧊", aciklama: "PAT", dogru: false },
          { id: "c", sembol: "❓", aciklama: "Bilinmiyor", dogru: false },
        ],
        dogruMesaj: "Harika ayrım! Şah tehdit altındaysa bu kesinlikle MAT'tır!",
      },
      {
        id: 2,
        karakter: "🕊️",
        karakterAdi: "Barışçıl Kuş",
        soruMetni: "Şaha KİMSE SALDIRMIYOR ama yapacak hiçbir hamlesi yok! Bu PAT'tır! BARIŞ ÇİÇEĞİ'ne bas!",
        hedefSekil: "Barış Çiçeği 🌸",
        secenekler: [
          { id: "a", sembol: "🌸", aciklama: "Tehdit Yok = PAT (Berabere)", dogru: true },
          { id: "b", sembol: "👑", aciklama: "MAT", dogru: false },
          { id: "c", sembol: "🏆", aciklama: "Galibiyet", dogru: false },
        ],
        dogruMesaj: "Muazzam! Şaha tehdit yokken kilitlenirse oyun PAT olur!",
      },
      {
        id: 3,
        karakter: "💡",
        karakterAdi: "Zeka Işığı",
        soruMetni: "Mat ve pat farkını çözen süper beynin parlayan IŞIĞINA dokun!",
        hedefSekil: "Zeka Işığı 💡",
        secenekler: [
          { id: "a", sembol: "💡", aciklama: "Farkı Öğrendim!", dogru: true },
          { id: "b", sembol: "💤", aciklama: "Kafam Karıştı", dogru: false },
          { id: "c", sembol: "❌", aciklama: "Unuttum", dogru: false },
        ],
        dogruMesaj: "Harikasın! Artık hiçbir tuzak seni yanıltamaz!",
      },
    ],
  },

  // 4. ÜNİTE
  {
    kod: "ST.OÖ. 4.1.",
    uniteId: 4,
    uniteBaslik: "4. Satrançta Tehdit ve Savunma",
    baslik: "Satrançta tehdit durumlarını fark eder.",
    resmiAciklama:
      "Rakibin bir sonraki hamlede taşımızı almak istediği durumlar önceden sezdirilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🚨",
        karakterAdi: "Kırmızı Alarm",
        soruMetni: "Rakip Fil gözünü Kalemize dikmiş! Tehlikeyi haber veren KIRMIZI ALARM lambasına bas!",
        hedefSekil: "Alarm Lambası 🚨",
        secenekler: [
          { id: "a", sembol: "🚨", aciklama: "Tehdidi Fark Ettim!", dogru: true },
          { id: "b", sembol: "😴", aciklama: "Fark Etmedim", dogru: false },
          { id: "c", sembol: "🎈", aciklama: "Balon", dogru: false },
        ],
        dogruMesaj: "Ciiiyuuuv! Alarm çaldı, hemen savunma planı yapmalıyız!",
      },
      {
        id: 2,
        karakter: "🦊",
        karakterAdi: "Uyanık Tilki",
        soruMetni: "Rakip piyon atımıza doğru yaklaşıyor. UYANIK TİLKİ GÖZÜ'ne basarak taşını koru!",
        hedefSekil: "Göz 👀",
        secenekler: [
          { id: "a", sembol: "👀", aciklama: "Gözlerim Tahtada!", dogru: true },
          { id: "b", sembol: "🙈", aciklama: "Gözümü Kapattım", dogru: false },
          { id: "c", sembol: "🕶️", aciklama: "Güneş Gözlüğü", dogru: false },
        ],
        dogruMesaj: "Harika dikkat! Rakibin hamle niyetini anında çözdün!",
      },
      {
        id: 3,
        karakter: "🛡️",
        karakterAdi: "Güvenlik Robotu",
        soruMetni: "Tehdit altındaki taşlarımızı kurtarmak için SİHİRLİ KALKAN simgesine bas!",
        hedefSekil: "Kalkan 🛡️",
        secenekler: [
          { id: "a", sembol: "🛡️", aciklama: "Savunmaya Geç", dogru: true },
          { id: "b", sembol: "💤", aciklama: "Uyuya Kal", dogru: false },
          { id: "c", sembol: "🍂", aciklama: "Taşı Bırak", dogru: false },
        ],
        dogruMesaj: "Kalkan kuruldu! Tehdit bertaraf edildi!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 4.2.",
    uniteId: 4,
    uniteBaslik: "4. Satrançta Tehdit ve Savunma",
    baslik: "Taşının önüne perdeleme yapar.",
    resmiAciklama:
      "Saldıran taş ile hedef taş arasına uygun bir taş sürerek saldırı hattının kesilmesi öğretilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🎭",
        karakterAdi: "Tiyatro Perdesi",
        soruMetni: "Vezir kalemize saldırıyor! Araya piyonumuzu sürerek perde çekelim. SAHNE PERDESİ'ne tıkla!",
        hedefSekil: "Perde 🎪",
        secenekler: [
          { id: "a", sembol: "🎪", aciklama: "Araya Perde Koy", dogru: true },
          { id: "b", sembol: "🕳️", aciklama: "Açık Bırak", dogru: false },
          { id: "c", sembol: "💨", aciklama: "Rüzgar", dogru: false },
        ],
        dogruMesaj: "Perde indi! Vezirin görüş açısı tamamen kapandı!",
      },
      {
        id: 2,
        karakter: "🧱",
        karakterAdi: "Usta Duvarcı",
        soruMetni: "Filin saldırı yoluna dost bir atımızı koyarak duvar ördük. SAĞLAM DUVAR simgesine bas!",
        hedefSekil: "Duvar 🧱",
        secenekler: [
          { id: "a", sembol: "🧱", aciklama: "Yolu Kapat", dogru: true },
          { id: "b", sembol: "🚪", aciklama: "Kapıyı Aç", dogru: false },
          { id: "c", sembol: "🪟", aciklama: "Pencere Aç", dogru: false },
        ],
        dogruMesaj: "Duvar sağlam! Filin çapraz oku taşa çarptı ve durdu!",
      },
      {
        id: 3,
        karakter: "☂️",
        karakterAdi: "Koruyucu Şemsiye",
        soruMetni: "Yağan saldırı yağmuruna karşı şemsiyeyi açtık. ŞEMSİYE simgesine tıkla!",
        hedefSekil: "Şemsiye ☂️",
        secenekler: [
          { id: "a", sembol: "☂️", aciklama: "Perdeleme Şemsiyesi", dogru: true },
          { id: "b", sembol: "🌧️", aciklama: "Yağmur", dogru: false },
          { id: "c", sembol: "⚡", aciklama: "Şimşek", dogru: false },
        ],
        dogruMesaj: "Kupkuru ve güvendeyiz! Perdeleme başarıyla tamamlandı!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 4.3.",
    uniteId: 4,
    uniteBaslik: "4. Satrançta Tehdit ve Savunma",
    baslik: "Satrançta güvenli kareleri ayırt eder.",
    resmiAciklama:
      "Rakip taşların vurmadığı güvenli liman kareler ile tehlikeli kareler ayırt ettirilir.",
    ornekler: [
      {
        id: 1,
        karakter: "🏝️",
        karakterAdi: "Güvenli Ada",
        soruMetni: "Atımız tehdit altında! Rakip taşların saldırmadığı GÜVENLİ YEŞİL ADA'ya zıpla!",
        hedefSekil: "Yeşil Ada 🏝️",
        secenekler: [
          { id: "a", sembol: "🏝️", aciklama: "Tehlikesiz Güvenli Kare", dogru: true },
          { id: "b", sembol: "🌋", aciklama: "Lav Çukuru (Tehlikeli)", dogru: false },
          { id: "c", sembol: "🦈", aciklama: "Köpekbalığı", dogru: false },
        ],
        dogruMesaj: "Oh be! Atımız güvenli yeşil adaya kondu, hiç kimse ona dokunamaz!",
      },
      {
        id: 2,
        karakter: "🚦",
        karakterAdi: "Trafik Işığı",
        soruMetni: "Güvenli kareye gitmek için hangi ışık yanar? YEŞİL IŞIK kutusuna bas!",
        hedefSekil: "Yeşil Işık 🟢",
        secenekler: [
          { id: "a", sembol: "🔴", aciklama: "Kırmızı Işık (Tehlike)", dogru: false },
          { id: "b", sembol: "🟢", aciklama: "Yeşil Işık (Güvenli Yol)", dogru: true },
          { id: "c", sembol: "⛔", aciklama: "Girilmez", dogru: false },
        ],
        dogruMesaj: "Yeşil yandı! Güvenli kareye adımını attın!",
      },
      {
        id: 3,
        karakter: "⚓",
        karakterAdi: "Kaptan Penguen",
        soruMetni: "Fırtınadan kaçıp güvenli limana demir atan Kalenin GEMİ ÇAPASI'na dokun!",
        hedefSekil: "Çapa ⚓",
        secenekler: [
          { id: "a", sembol: "⚓", aciklama: "Güvenli Liman", dogru: true },
          { id: "b", sembol: "🌪️", aciklama: "Hortum", dogru: false },
          { id: "c", sembol: "🌊", aciklama: "Büyük Dalga", dogru: false },
        ],
        dogruMesaj: "Liman sakin! Taşımız güvende!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 4.4.",
    uniteId: 4,
    uniteBaslik: "4. Satrançta Tehdit ve Savunma",
    baslik: "Taşını korur.",
    resmiAciklama:
      "Saldırıya uğrayan taşa başka bir taşla koruma sağlama veya güvenli yere çekme alıştırmaları yapılır.",
    ornekler: [
      {
        id: 1,
        karakter: "🦸‍♂️",
        karakterAdi: "Süper Koruyucu",
        soruMetni: "Piyonumuz tehdit altında, arkasından Kalemizi getirip koruyalım. SÜPER KORUMA KALKANINA bas!",
        hedefSekil: "Kalkan 🛡️",
        secenekler: [
          { id: "a", sembol: "🛡️", aciklama: "Arkadaşını Koru", dogru: true },
          { id: "b", sembol: "😴", aciklama: "Uyu", dogru: false },
          { id: "c", sembol: "🍃", aciklama: "Yalnız Bırak", dogru: false },
        ],
        dogruMesaj: "Arkadaşını korudun! Birlikten kuvvet doğar!",
      },
      {
        id: 2,
        karakter: "🏃‍♀️",
        karakterAdi: "Hızlı Ceylan",
        soruMetni: "Koruyamıyorsak ne yaparız? Hemen güvenli bir yere kaçarız! HIZLI KOŞUCU simgesine dokun!",
        hedefSekil: "Koşucu 🏃",
        secenekler: [
          { id: "a", sembol: "🏃", aciklama: "Güvenli Yere Kaç", dogru: true },
          { id: "b", sembol: "🧍", aciklama: "Bekle", dogru: false },
          { id: "c", sembol: "🪑", aciklama: "Otur", dogru: false },
        ],
        dogruMesaj: "Vınnn! Taşını güvenli kareye kaçırıp kurtardın!",
      },
      {
        id: 3,
        karakter: "🤝",
        karakterAdi: "El Ele Taşlar",
        soruMetni: "Birbirini koruyan taş zincirini simgeleyen DOSTLUK HALKASI'na tıkla!",
        hedefSekil: "Halka 💍",
        secenekler: [
          { id: "a", sembol: "💍", aciklama: "Kopmaz Savunma Zinciri", dogru: true },
          { id: "b", sembol: "✂️", aciklama: "Kopuk Makas", dogru: false },
          { id: "c", sembol: "🧷", aciklama: "İğne", dogru: false },
        ],
        dogruMesaj: "Mükemmel savunma! Rakip taşlarına dokunamaz bile!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 4.5.",
    uniteId: 4,
    uniteBaslik: "4. Satrançta Tehdit ve Savunma",
    baslik: "Satrançta taş alır.",
    resmiAciklama:
      "Kurallara uygun şekilde rakip taşın yerine geçerek taş alımı uygulatılır.",
    ornekler: [
      {
        id: 1,
        karakter: "🥊",
        karakterAdi: "Boksör Kanguru",
        soruMetni: "Rakip boşta duran bir fil bıraktı. Kuralına uygun şekilde onu al! BOKS ELDİVENİ simgesine tıkla!",
        hedefSekil: "Eldiven 🥊",
        secenekler: [
          { id: "a", sembol: "🥊", aciklama: "Boştaki Taşı Al", dogru: true },
          { id: "b", sembol: "💤", aciklama: "Görmezden Gel", dogru: false },
          { id: "c", sembol: "🙈", aciklama: "Gözünü Kapa", dogru: false },
        ],
        dogruMesaj: "Hamle yapıldı! Rakip taş tahtadan alındı ve yerini bizim taşımız aldı!",
      },
      {
        id: 2,
        karakter: "🧁",
        karakterAdi: "Tatlı Canavarı",
        soruMetni: "Taş almak lezzetli bir keki yemek gibidir! DİLİM PASTA simgesine basıp taşı al!",
        hedefSekil: "Pasta 🍰",
        secenekler: [
          { id: "a", sembol: "🍰", aciklama: "Afiyetle Al", dogru: true },
          { id: "b", sembol: "🥦", aciklama: "Bırak", dogru: false },
          { id: "c", sembol: "🥣", aciklama: "Kase", dogru: false },
        ],
        dogruMesaj: "Nefis hamle! Taşını tahtadan aldın!",
      },
      {
        id: 3,
        karakter: "⭐",
        karakterAdi: "Puan Avcısı",
        soruMetni: "Taş alırken aldığımız taşın yerine kendi taşımızı koyarız. DEĞİŞİM OKU simgesine tıkla!",
        hedefSekil: "Değişim 🔄",
        secenekler: [
          { id: "a", sembol: "🔄", aciklama: "Kendi Taşını O Kareye Koy", dogru: true },
          { id: "b", sembol: "❌", aciklama: "Yanına Koy", dogru: false },
          { id: "c", sembol: "⬆️", aciklama: "Havaya At", dogru: false },
        ],
        dogruMesaj: "Tam kuralına uygun! Rakip taş kenara, senin taşın o kareye!",
      },
    ],
  },

  // 5. ÜNİTE
  {
    kod: "ST.OÖ. 5.1.",
    uniteId: 5,
    uniteBaslik: "5. Satrancın Özel Kuralları",
    baslik: "Rok hamlesini uygular.",
    resmiAciklama:
      "Rok hamlesi; şahın güvenliği için kaleyle birlikte yaptığı özel bir hamledir. Şah veya kale oynamışsa yapılamaz.",
    ornekler: [
      {
        id: 1,
        karakter: "🏰",
        karakterAdi: "Saray Dansçısı Şah",
        soruMetni: "Rok yaparken Şah önce iki adım kaleye doğru kayar, kale üstünden atlar! ŞAH VE KALE DANSI simgesine bas!",
        hedefSekil: "Saray Dansı 💃",
        secenekler: [
          { id: "a", sembol: "💃", aciklama: "Sihirli Rok Dansı", dogru: true },
          { id: "b", sembol: "🏃", aciklama: "Tek Başına Kaçış", dogru: false },
          { id: "c", sembol: "🛑", aciklama: "Hareketsizlik", dogru: false },
        ],
        dogruMesaj: "Harika dans! Şah köşeye saklandı, kale savaşa girdi!",
      },
      {
        id: 2,
        karakter: "☝️",
        karakterAdi: "Kuralcı Hakem",
        soruMetni: "Rok atarken ilk önce hangi taşa dokunulmalıdır? BİLGE ŞAH'a dokun!",
        hedefSekil: "Şah ♚",
        secenekler: [
          { id: "a", sembol: "♜", aciklama: "Kale (Yanlış)", dogru: false },
          { id: "b", sembol: "♚", aciklama: "Önce Şaha Dokunulur!", dogru: true },
          { id: "c", sembol: "♟️", aciklama: "Piyon", dogru: false },
        ],
        dogruMesaj: "Mükemmel bilgi! Rok bir şah hamlesidir, önce şaha dokunulur!",
      },
      {
        id: 3,
        karakter: "🔒",
        karakterAdi: "Güvenlik Şefi",
        soruMetni: "Şah daha önce hareket etmişse rok yapabilir mi? KİLİTLİ KAPI simgesine dokun!",
        hedefSekil: "Kilit 🔒",
        secenekler: [
          { id: "a", sembol: "🔒", aciklama: "Hayır, Rok Hakkı Biter", dogru: true },
          { id: "b", sembol: "🔓", aciklama: "Evet Yapabilir", dogru: false },
          { id: "c", sembol: "🎉", aciklama: "İstediği Kadar Yapar", dogru: false },
        ],
        dogruMesaj: "Doğru kural! Şah veya kale bir kere oynarsa bir daha rok yapılamaz!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 5.2.",
    uniteId: 5,
    uniteBaslik: "5. Satrancın Özel Kuralları",
    baslik: "Piyonun geçerken alma hamlesini kavrar.",
    resmiAciklama:
      "İlk çıkışta iki kare fırlayan piyon, rakip piyonun tehdit ettiği kareden geçmişse sıradaki hamlede çapraz alınabilir.",
    ornekler: [
      {
        id: 1,
        karakter: "👻",
        karakterAdi: "Hayalet Avcısı",
        soruMetni: "Piyon yanımızdan iki adım fırladı ama hayaleti arkadaki karede kaldı! HAYALET SİMGESİ'ne bas ve onu al!",
        hedefSekil: "Hayalet 👻",
        secenekler: [
          { id: "a", sembol: "👻", aciklama: "Geçerken Alma (En Passant)", dogru: true },
          { id: "b", sembol: "🧱", aciklama: "Duvar", dogru: false },
          { id: "c", sembol: "🛑", aciklama: "Dur", dogru: false },
        ],
        dogruMesaj: "Vooov! Geçerken alma (En Passant) büyülü kuralını çözdün!",
      },
      {
        id: 2,
        karakter: "⚡",
        karakterAdi: "Şimşek Piyon",
        soruMetni: "Geçerken alma sadece o hamle yapıldığında HEMEN sıradaki hamlede yapılabilir. ŞİMŞEK simgesine bas!",
        hedefSekil: "Şimşek ⚡",
        secenekler: [
          { id: "a", sembol: "⚡", aciklama: "Hemen O Anda Yapılır", dogru: true },
          { id: "b", sembol: "⏳", aciklama: "10 Hamle Sonra", dogru: false },
          { id: "c", sembol: "📅", aciklama: "Yarın", dogru: false },
        ],
        dogruMesaj: "Şimşek gibi anında! Sırasını kaçırırsan geçerken alma hakkı kaybolur!",
      },
      {
        id: 3,
        karakter: "🪄",
        karakterAdi: "Sihirbaz Tavşan",
        soruMetni: "Bu özel kural sadece ve sadece hangi taşlar arasında gerçekleşir? MİNİK PİYON'a tıkla!",
        hedefSekil: "Piyon ♟️",
        secenekler: [
          { id: "a", sembol: "♟️", aciklama: "Sadece Piyonlar Arasında", dogru: true },
          { id: "b", sembol: "♜", aciklama: "Kaleler Arasında", dogru: false },
          { id: "c", sembol: "♚", aciklama: "Şahlar Arasında", dogru: false },
        ],
        dogruMesaj: "Tebrikler! Geçerken alma yalnızca piyonlara has bir sırdır!",
      },
    ],
  },

  // 6. ÜNİTE
  {
    kod: "ST.OÖ. 6.1.",
    uniteId: 6,
    uniteBaslik: "6. Satranç Oynuyorum",
    baslik: "Karşılıklı satranç oynar.",
    resmiAciklama:
      "Oyuna başlarken rakibe başarılar dileme, sırayla tek hamle yapma ve kurallı oyun bilinci kazandırılır.",
    ornekler: [
      {
        id: 1,
        karakter: "🤝",
        karakterAdi: "Centilmen Aslan",
        soruMetni: "Maç başlamadan önce rakibimizin elini sıkar ve ne deriz? 'BAŞARILAR DİLERİM' kalbine bas!",
        hedefSekil: "Dostluk Kalbi 💖",
        secenekler: [
          { id: "a", sembol: "💖", aciklama: "'İyi Oyunlar / Başarılar Dilerim'", dogru: true },
          { id: "b", sembol: "😜", aciklama: "'Seni Yeneceğim!'", dogru: false },
          { id: "c", sembol: "😠", aciklama: "Kızgın Bakış", dogru: false },
        ],
        dogruMesaj: "Harika centilmenlik! Satranç bir saygı ve dostluk oyunudur!",
      },
      {
        id: 2,
        karakter: "⚪",
        karakterAdi: "İlk Hamle Perisi",
        soruMetni: "Satrançta oyuna HER ZAMAN hangi renk başlar? BEYAZ DAİRE'ye tıkla!",
        hedefSekil: "Beyaz ⚪",
        secenekler: [
          { id: "a", sembol: "⚪", aciklama: "Daima Beyaz Başlar", dogru: true },
          { id: "b", sembol: "⚫", aciklama: "Siyah Başlar", dogru: false },
          { id: "c", sembol: "🔴", aciklama: "Kırmızı Başlar", dogru: false },
        ],
        dogruMesaj: "Çok doğru! Satranç tahtasında ilk hamleyi her zaman Beyazlar yapar!",
      },
      {
        id: 3,
        karakter: "🔄",
        karakterAdi: "Sıra Bende Çarkı",
        soruMetni: "Satrançta bir oyuncu peş peşe 2 hamle yapabilir mi? TEK HAMLE SIRASI simgesine bas!",
        hedefSekil: "Sıra Çarkı 🔁",
        secenekler: [
          { id: "a", sembol: "🔁", aciklama: "Sırayla Birer Hamle", dogru: true },
          { id: "b", sembol: "⏩", aciklama: "İki Kere Üst Üste", dogru: false },
          { id: "c", sembol: "⏸️", aciklama: "Hiç Oynamama", dogru: false },
        ],
        dogruMesaj: "Kurallara tam uyum! Sırayla bir sen, bir rakip oynar!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 6.2.",
    uniteId: 6,
    uniteBaslik: "6. Satranç Oynuyorum",
    baslik: "Oyun esnasında yardım ister.",
    resmiAciklama:
      "Kurallarla ilgili bir sorun çıktığında bağırmadan, el kaldırarak öğretmen veya hakemden yardım istenir.",
    ornekler: [
      {
        id: 1,
        karakter: "🙋‍♂️",
        karakterAdi: "Saygılı Öğrenci",
        soruMetni: "Bir kural karışıklığında hakemi nasıl çağırırız? EL KALDIRMA simgesine tıkla!",
        hedefSekil: "El Kaldırma 🙋",
        secenekler: [
          { id: "a", sembol: "🙋", aciklama: "Sessizce El Kaldırırım", dogru: true },
          { id: "b", sembol: "📢", aciklama: "Bağırırım", dogru: false },
          { id: "c", sembol: "🤾", aciklama: "Taşları Fırlatırım", dogru: false },
        ],
        dogruMesaj: "Örnek bir davranış! Hakem hemen yanına gelip sana yardımcı olur!",
      },
      {
        id: 2,
        karakter: "🤫",
        karakterAdi: "Kütüphane Kedisi",
        soruMetni: "Satranç salonunda herkes düşünürken ortam nasıl olmalıdır? SESSİZLİK simgesine dokun!",
        hedefSekil: "Sessizlik 🤫",
        secenekler: [
          { id: "a", sembol: "🤫", aciklama: "Çıt Çıkmayan Sessiz Ortam", dogru: true },
          { id: "b", sembol: "🥁", aciklama: "Davul Sesi", dogru: false },
          { id: "c", sembol: "🎉", aciklama: "Parti Şarkıları", dogru: false },
        ],
        dogruMesaj: "Şşşt! Düşünce odasında sessizlik en büyük güçtür!",
      },
      {
        id: 3,
        karakter: "🧑‍🏫",
        karakterAdi: "Sevgili Öğretmen",
        soruMetni: "Hakem veya öğretmen geldiğinde onu dinlemek için KULAK VERME simgesine bas!",
        hedefSekil: "Kulak 👂",
        secenekler: [
          { id: "a", sembol: "👂", aciklama: "Dikkatle Dinlerim", dogru: true },
          { id: "b", sembol: "🙈", aciklama: "Dinlemem", dogru: false },
          { id: "c", sembol: "🏃", aciklama: "Kaçarım", dogru: false },
        ],
        dogruMesaj: "Harika! Öğretmenin yönlendirmesiyle oyun güzellikle sürer!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 6.3.",
    uniteId: 6,
    uniteBaslik: "6. Satranç Oynuyorum",
    baslik: "Oyun bitişini açıklar.",
    resmiAciklama:
      "Oyunun nasıl bittiği (mat, pat, süre), taşların düzenli kutusuna toplanması ve salon düzeni benimsetilir.",
    ornekler: [
      {
        id: 1,
        karakter: "📦",
        karakterAdi: "Düzenli Karınca",
        soruMetni: "Maç bitince taşları tahtada bırakıp kaçar mıyız? DÜZENLİ TOPLAMA KUTUSU'na bas!",
        hedefSekil: "Kutu 📦",
        secenekler: [
          { id: "a", sembol: "📦", aciklama: "Taşları Kutusuna Toplarım", dogru: true },
          { id: "b", sembol: "🌪️", aciklama: "Yere Saçarım", dogru: false },
          { id: "c", sembol: "🏃", aciklama: "Hemen Koşarım", dogru: false },
        ],
        dogruMesaj: "Harika disiplin! Tüm taşlar düzenli kutusuna yerleştirildi!",
      },
      {
        id: 2,
        karakter: "🏁",
        karakterAdi: "Bitiş Hakemi",
        soruMetni: "Maçın bittiğini her iki oyuncu masaya çağrılan hakeme bildirir. ONAY MÜHRÜ'ne tıkla!",
        hedefSekil: "Onay Mührü 💮",
        secenekler: [
          { id: "a", sembol: "💮", aciklama: "Sonucu Bildir ve Onayla", dogru: true },
          { id: "b", sembol: "❌", aciklama: "Gizle", dogru: false },
          { id: "c", sembol: "💤", aciklama: "Uyu", dogru: false },
        ],
        dogruMesaj: "Sonuç kaydedildi! Tebrikler maç tamamlandı!",
      },
      {
        id: 3,
        karakter: "🧹",
        karakterAdi: "Tertemiz Sınıf",
        soruMetni: "Sandalyemizi düzeltip masayı bir sonraki arkadaşımıza tertemiz bırakmak için YILDIZ'a bas!",
        hedefSekil: "Yıldız ⭐",
        secenekler: [
          { id: "a", sembol: "⭐", aciklama: "Masayı Temiz Bırakırım", dogru: true },
          { id: "b", sembol: "🗑️", aciklama: "Çöp Bırakırım", dogru: false },
          { id: "c", sembol: "🪑", aciklama: "Sandalyeyi Deviririm", dogru: false },
        ],
        dogruMesaj: "Pırıl pırıl! Gerçek bir satranç sporcusu gibi davrandın!",
      },
    ],
  },
  {
    kod: "ST.OÖ. 6.4.",
    uniteId: 6,
    uniteBaslik: "6. Satranç Oynuyorum",
    baslik: "Satrancın etik kurallarının farkına varır.",
    resmiAciklama:
      "Oyun arkadaşına saygı, yense de yenilse de rakibini kutlama ve maçı devam eden arkadaşlarını rahatsız etmeme öğretilir.",
    ornekler: [
      {
        id: 1,
        karakter: "💖",
        karakterAdi: "Dost Kalpler",
        soruMetni: "Maç bittiğinde kazansak da kaybetsek de rakibimizin elini sıkarız. SEVGİ KALBİ'ne bas!",
        hedefSekil: "Sevgi Kalbi ❤️",
        secenekler: [
          { id: "a", sembol: "❤️", aciklama: "'Tebrik Ederim' Derim", dogru: true },
          { id: "b", sembol: "😭", aciklama: "Ağlayıp Küserim", dogru: false },
          { id: "c", sembol: "😝", aciklama: "Dalga Geçerim", dogru: false },
        ],
        dogruMesaj: "Gönüllerin şampiyonu! Rakibini tebrik etmek en büyük olgunluktur!",
      },
      {
        id: 2,
        karakter: "🤫",
        karakterAdi: "Sessiz Parmak Uçları",
        soruMetni: "Bizim maçımız bitti ama yan masadaki arkadaşlarımız hala oynuyor. Onların yanından nasıl geçeriz? PARMAK UCU simgesine tıkla!",
        hedefSekil: "Parmak Ucu 👣",
        secenekler: [
          { id: "a", sembol: "👣", aciklama: "Parmak Ucunda Sessizce", dogru: true },
          { id: "b", sembol: "🗣️", aciklama: "Tahtalarına Karışarak", dogru: false },
          { id: "c", sembol: "📢", aciklama: "Bağırarak Koşarak", dogru: false },
        ],
        dogruMesaj: "Harika saygı! Başkalarının maçına asla karışılmaz ve çıt çıkarılmaz!",
      },
      {
        id: 3,
        karakter: "🌟",
        karakterAdi: "Fair-Play Yıldızı",
        soruMetni: "Satrancın tüm nezaket kurallarına uyan gerçek bir sporcu oldun! PARLAK FAİR-PLAY YILDIZI'na dokun!",
        hedefSekil: "Altın Yıldız 🌟",
        secenekler: [
          { id: "a", sembol: "🌟", aciklama: "Ben Gerçek Bir Sporcuyum!", dogru: true },
          { id: "b", sembol: "🍂", aciklama: "Kuralları Bozarım", dogru: false },
          { id: "c", sembol: "❌", aciklama: "Vazgeçerim", dogru: false },
        ],
        dogruMesaj: "Tebrikler! Sen gerçek bir şampiyon ve centilmen satranç sporcususun!",
      },
    ],
  },
];

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
      {/* ÜST GEZİNME VE KAZANIM SEÇİCİ */}
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
            {aktifKazanim.uniteBaslik}
          </span>
          <h1 style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
            {aktifKazanim.kod} {aktifKazanim.baslik}
          </h1>
        </div>

        {/* Hızlı Açılır Liste (33 Kazanım) */}
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
          {KAZANIMLAR_VERISI.map((k) => (
            <option key={k.kod} value={k.kod}>
              {tamamlananKazanimlar.includes(k.kod) ? "✅ " : "⚪ "}
              {k.kod} {k.baslik}
            </option>
          ))}
        </select>
      </div>

      {/* PEDAGOJİK RESMİ KAZANIM AÇIKLAMASI */}
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
            📖 Kazanım Açıklaması:
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
            ? "Kazanım Tamamlandı ✨"
            : "Kazanımı Tamamla ⚪"}
        </button>
      </div>

      {/* 3 ADET ÇİZGİ FİLM VE TIKLAMALI ÖRNEK ALANI */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <span style={{ fontSize: "28px" }}>🎬✨🧸</span>
          <h2 style={{ fontSize: "16px", fontWeight: "900", color: "#1e293b", margin: "4px 0" }}>
            Kahramanlarla 3 İnteraktif Örnek & Tıklamalı Oyun
          </h2>
          <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
            Soruyu oku, doğru şekle veya kalbe basarak görevi tamamla!
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                }}
              >
                {/* Karakter Başlığı */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "32px" }}>{ornek.karakter}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "900", color: "#c2410c" }}>
                      {idx + 1}. Örnek Görev: {ornek.karakterAdi}
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: "bold", color: "#1e293b" }}>
                      {ornek.soruMetni}
                    </div>
                  </div>
                </div>

                {/* Tıklanacak Şekiller / Kalpler / Nesneler */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: "10px",
                    marginTop: "12px",
                  }}
                >
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
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "6px",
                          padding: "12px 8px",
                          backgroundColor: bgColor,
                          border: `2px solid ${borderColor}`,
                          borderRadius: "14px",
                          cursor: "pointer",
                          transform: secili ? "scale(1.03)" : "none",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <span style={{ fontSize: "30px" }}>{s.sembol}</span>
                        <span style={{ fontSize: "11px", fontWeight: "bold", color: "#334155" }}>
                          {s.aciklama}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Başarı Mesajı */}
                {secilenSecenekId && (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      backgroundColor: dogruMu ? "#f0fdf4" : "#fef2f2",
                      border: dogruMu ? "1px solid #86efac" : "1px solid #fca5a5",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: dogruMu ? "#15803d" : "#b91c1c",
                      textAlign: "center",
                    }}
                  >
                    {dogruMu
                      ? `🎉 ${ornek.dogruMesaj}`
                      : "❌ Yanlış şekil! Soruyu tekrar oku ve doğru sembole tıkla."}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ALT SAYFA GEÇİŞLERİ (Önceki Kazanım - Sonraki Kazanım) */}
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
            ⬅️ Önceki: {oncekiKazanim.kod}
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
            Sonraki: {sonrakiKazanim.kod} ➡️
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
