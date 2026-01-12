import { Map, MapControls } from "@/components/ui/map";

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
      </Map>
    </div>
  )
}