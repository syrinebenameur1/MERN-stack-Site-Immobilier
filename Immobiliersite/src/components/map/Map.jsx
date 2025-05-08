import { MapContainer, TileLayer } from 'react-leaflet'
import L from "leaflet";
import iconRetinaUrl  from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl        from 'leaflet/dist/images/marker-icon.png';
import shadowUrl      from 'leaflet/dist/images/marker-shadow.png';
import './map.scss'
import "leaflet/dist/leaflet.css";
import Pin from '../pin/Pin';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

function Map({items}){
  return (
    <MapContainer center={items.length === 1
      ? [items[0].latitude, items[0].longitude]
      :[36.8028, 10.1797]} zoom={7} scrollWheelZoom={false} className='map'>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {items.map(item=>(
      <Pin item={item} key={item.id}/>
    ))}
  </MapContainer>
  )
}

export default Map
