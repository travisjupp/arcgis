import { loadModules } from "esri-loader";
import { useEffect, useRef } from "react";

export function MapComponent() {
  const mapDiv = useRef<HTMLDivElement>(null);
  // Import some data for an overlay layer
  const geoJsonUrl = "/data/OSE_Points_of_Diversion.json";

  useEffect(() => {
    let view: __esri.MapView | undefined;
    type MapModules = [
      typeof __esri.Map,
      typeof __esri.MapView,
      typeof __esri.GeoJSONLayer,
    ];

    const modulesPromise = loadModules(
      ["esri/Map", "esri/views/MapView", "esri/layers/GeoJSONLayer"],
      { css: true },
    ) as Promise<MapModules>; // Explicitly assert the Promise return type

    modulesPromise
      .then(([Map, MapView, GeoJSONLayer]) => {
        // Define renderer for dots
        const simpleRenderer = {
          type: "simple",
          symbol: {
            type: "simple-marker",
            size: 6,
            color: [0, 0, 255, 0.8],
            outline: {
              width: 0.5,
              color: [255, 255, 255, 0.5],
            },
          } as any,
        } as any;

        // GeoJSONLayer instance
        const geoJsonLayer = new GeoJSONLayer({
          url: geoJsonUrl,
          renderer: simpleRenderer,
          title: "Data overlay with markers",
        });

        const map = new Map({
          basemap: "streets-navigation-vector",
          layers: [geoJsonLayer],
        });

        if (mapDiv.current) {
          view = new MapView({
            container: mapDiv.current,
            map: map,
            center: [-108.6024804680467, 32.968224554628776], // Cliff, NM
            zoom: 13,
          });
        }
      })
      .catch((err) => console.error(err));

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return <div ref={mapDiv} style={{ height: "100vh", width: "100vw" }}></div>;
}
