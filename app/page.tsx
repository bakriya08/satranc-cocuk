import SatrancTahtasi from "@/components/SatrancTahtasi";

export default function Home() {
  return (
    <main className="min-h-screen bg-sky-200 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-black text-sky-900 drop-shadow-sm">
          🏰 Çocuk Satranç Kulübü
        </h1>
        <p className="text-sky-700 font-bold mt-2">
          Taşları sürükle ve hamleni yap!
        </p>
      </div>

      <SatrancTahtasi />
    </main>
  );
}
