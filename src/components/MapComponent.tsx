import { loadModules } from "esri-loader";
import { useEffect, useRef } from "react";

export function MapComponent() {
  const mapDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let view: __esri.MapView | undefined;

    // 1. Define the expected array type alias
    type MapModules = [typeof __esri.Map, typeof __esri.MapView];

    // 2. Cast the entire loadModules call result using a generic assertion
    const modulesPromise = loadModules(
      ['esri/Map', 'esri/views/MapView'], 
      { css: true }
    ) as Promise<MapModules>; // Explicitly assert the Promise return type

    modulesPromise.then(([Map, MapView]) => {
      // TypeScript now understands Map and MapView exist and are correct types here

      const map = new Map({
        basemap: 'streets-navigation-vector'
      });

      if (mapDiv.current) {
        view = new MapView({
          container: mapDiv.current,
          map: map,
          center: [-108.6024804680467, 32.968224554628776], // Cliff, NM
          zoom: 13
        });
      }
    })
    .catch(err => console.error(err));

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return (
    <div ref={mapDiv} style={{ height: '100vh', width: '100vw' }}></div>
  );
}

