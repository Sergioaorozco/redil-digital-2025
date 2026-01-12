import { Map, MapControls, MapMarker, MapPopup } from "@/components/ui/map";

const locations = [
  {
    id: 1,
    name: "Bomba los Almendros",
    lng: -75.59638152299985,
    lat: 6.2387899130411215
  },
  {
    id: 2,
    name: "Farmatodo",
    lng: -75.5965579075528,
    lat: 6.23967415351913
  },
  { id: 3, name: "Super Mu La 33", lng: -75.59630186546296, lat: 6.239321588733043 },
];

export default function RedilMap() {
  return (
    <div className="h-[450px] w-full rounded-lg overflow-hidden">
      <Map center={[-75.5961691028774, 6.240277472394894]} zoom={17}>
        <MapControls
          position="bottom-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />
        {locations.map((location) => (
          <MapMarker
            key={location.id}
            longitude={location.lng}
            latitude={location.lat}
          >
            <MapPopup longitude={location.lng} latitude={location.lat}>
              <p>{location.name}</p>
            </MapPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  )
}