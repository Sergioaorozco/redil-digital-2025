import { Map, MapControls, MapMarker, MapPopup } from "@/components/ui/map";

const locations = [
  {
    id: 1,
    name: "Bomba los Almendros",
    lng: 6.2387899130411215,
    lat: -75.59638152299985
  },
  {
    id: 2,
    name: "Farmatodo",
    lng: 6.23967415351913,
    lat: -75.5965579075528
  },
  { id: 3, name: "Super Mu La 33", lng: 6.239321588733043, lat: -75.59630186546296 },
];

export default function RedilMap() {
  return (
    <div className="h-[450px] w-full rounded-lg overflow-hidden">
      <Map center={[6.240277472394894, -75.5961691028774]} zoom={17}>
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