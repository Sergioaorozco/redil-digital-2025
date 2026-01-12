import { Map, MapControls } from "@/components/ui/map";

export default function RedilMap() {
  return (
    <Map center={[-74.006, 40.7128]} zoom={11}>
      <MapControls />
    </Map>
  )
}