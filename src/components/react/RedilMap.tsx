import { Map, MapControls } from "@/components/ui/map";

export default function RedilMap() {
  return (
    <div className="h-[450px] w-full rounded-lg overflow-hidden">
      <Map center={[-75.60223, 6.24296]} zoom={15}>
        <MapControls />
      </Map>
    </div>
  )
}