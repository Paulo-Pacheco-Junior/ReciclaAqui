"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Correção dos ícones do Leaflet executada apenas no cliente
// @ts-expect-error - Ignorando tipagem interna do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Cooperativa {
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  telefone?: string;
  lat: number;
  lng: number;
}

interface MapaProps {
  cooperativas: Cooperativa[];
}

export default function Mapa({ cooperativas }: MapaProps) {
  const centroPadrao: [number, number] = [-30.0346, -51.2177];

  return (
    <div className="mb-12 overflow-hidden rounded-2xl border border-neutral-200 shadow-md h-[400px] w-full z-0 relative">
      <MapContainer
        center={centroPadrao}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cooperativas.map((item, index) => (
          <Marker key={index} position={[item.lat, item.lng]}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-sm text-neutral-900">{item.nome}</h3>
                <p className="text-xs text-neutral-600 mt-1">{item.endereco}</p>
                <p className="text-xs font-semibold text-emerald-700 mt-1">
                  {item.cidade} - {item.estado}
                </p>
                {item.telefone && (
                  <p className="text-xs text-neutral-500 mt-1">Tel: {item.telefone}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}