import { Map, MapControls, MapMarker, MapPopup, MarkerContent, MarkerTooltip } from "@/components/ui/map";
import { MapPinIcon } from "lucide-react";
import { useState } from "react";

const locations = [
  {
    id: 1,
    name: "Redil Laureles",
    lng: -75.5961691028774,
    lat: 6.240277472394894
  },
  {
    id: 2,
    name: "Farmatodo",
    lng: -75.5965579075528,
    lat: 6.23967415351913
  },
  { id: 3, name: "Super Mu La 33", lng: -75.5963384985285, lat: 6.239184559336569 },
];

export default function RedilMap() {
  const [popUp, setPopUp] = useState(false);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
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
            {location.name === 'Redil Laureles' ? (
              <>
                <MarkerContent>
                  <MapPinIcon fill="#ff2424" className="text-red-800" />
                </MarkerContent>
                <MapPopup longitude={location.lng} latitude={location.lat}>
                  <p>{location.name}</p>
                </MapPopup>
              </>
            ) : (
              <>
                <MarkerContent>
                  <div className="size-4 rounded-full bg-black border-2 border-white shadow-lg" />
                </MarkerContent>
                <MarkerTooltip>{location.name}</MarkerTooltip>
              </>
            )}
          </MapMarker>
        ))}
      </Map>
    </div>
  )
}