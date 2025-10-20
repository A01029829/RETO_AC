import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

export type LatLng = { lat: number; lng: number };

type Props = {
  center: LatLng;
  zoom?: number;
  height?: number | string;
  width?: number | string;
  showMarker?: boolean;
};

export default function Map({
  center,
  zoom = 18,
  height = 420,
  width = "100%",
  showMarker = true,
}: Props) {
  const h = typeof height === "number" ? `${height}px` : height;
  const w = typeof width === "number" ? `${width}px` : width;

  return (
    <div style={{ width: w, height: h }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {showMarker && (
          <Marker position={[center.lat, center.lng]} icon={defaultIcon}>
            <Popup>{`${center.lat}, ${center.lng}`}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
