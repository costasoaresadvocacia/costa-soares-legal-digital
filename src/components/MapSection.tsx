import mapImg from "@/assets/map-blurred.jpg";
import pinImg from "@/assets/map-pin.png";

const ADDRESS = "Rua Enrico Lippi, 20, Vila Sorocabana, Mairinque, SP - CEP 18121-024";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

const MapSection = () => (
  <section className="relative">
    <a
      href={MAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir localização no aplicativo de mapas"
      className="block relative h-[500px] overflow-hidden group"
    >
      <img
        src={mapImg}
        alt="Mapa da localização do escritório"
        loading="lazy"
        width={1920}
        height={800}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-smooth"
      />
      <div className="absolute inset-0 bg-background/30" />
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <img
          src={pinImg}
          alt="Marcador de localização"
          width={120}
          height={120}
          loading="lazy"
          className="h-32 w-32 drop-shadow-2xl animate-pulse"
        />
        <div className="mt-6 bg-background/90 backdrop-blur px-8 py-4 border border-primary">
          <div className="text-xs uppercase tracking-widest text-primary mb-1">Nossa Localização</div>
          <div className="font-serif text-xl">Clique para abrir no mapa</div>
        </div>
      </div>
    </a>
  </section>
);

export default MapSection;
