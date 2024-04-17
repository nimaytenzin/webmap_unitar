require([
  "esri/Map",
  "esri/views/MapView",
  "esri/config",
  "esri/widgets/Legend",
  "esri/widgets/BasemapLayerList",
  "esri/widgets/ScaleBar",
  "esri/widgets/LayerList",
  "esri/layers/GeoJSONLayer",
  "esri/layers/TileLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/GroupLayer",
  "esri/layers/WebTileLayer",
], function (
  Map,
  MapView,
  esriConfig,
  Legend,
  BasemapLayerList,
  ScaleBar,
  LayerList,
  GeoJSONLayer,
  TileLayer,
  FeatureLayer,
  GroupLayer,
  WebTileLayer
) {
  const map = new Map({
    // basemap: {
    //   baseLayers: [
    //     new TileLayer({
    //       url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
    //       effect: "blur(px) brightness(1) grayscale(0.9)",
    //     }),
    //   ],
    // },
  });

  const mapBaseLayer = new WebTileLayer({
    urlTemplate: "http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}",
    effect:
      "blur(0px) brightness(1) grayscale(0.4) sepia(50%) saturate(100%) contrast(100%)",
    subDomains: [1, 2, 3, 4],
    copyright: "Google Map Tiles",
    title: "New XYZ Tile Layer",
    id: "google-satellite",
  });

  map.add(mapBaseLayer);

  const geojsonUrl =
    "https://zhichar.bt/dev/sub-administrative-zone/buildings/geom/448";

  const plotsUrl =
    "https://zhichar.bt/dev/sub-administrative-zone/plots/geom/448";

  let geojsonLayer = new GeoJSONLayer({
    url: geojsonUrl,
    copyright: "zhichar",
    title: "Buildings",
    ppopupEnabled: true, // Enable popups on click
    popupTemplate: {
      title: "Building Information",
      content:
        "<p>Building Roof Area: <b>{areaSqFt} Sqft</b></p>" +
        "<ul><li>Location Tag: {location}</li>" +
        "<li>BuildingID: {buildingid}</li>" +
        "<li>Confidence: {confidence}</li></ul>",
    },
    renderer: {
      // Add this to style the buildings with a red fill
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: "red",
        outline: {
          color: "red",
          width: 1,
        },
      },
    },
  });
  let plotsLayer = new GeoJSONLayer({
    url: plotsUrl,
    copyright: "zhichar",
    title: "Plots",
    ppopupEnabled: true, // Enable popups on click
    popupTemplate: {
      title: "Plots Information",
      content: "<p>Plot ID: <b>{plotid} Sqft</b></p>",
    },
    renderer: {
      // Add this to style the buildings with a red fill
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: "transparent",
        outline: {
          color: "white",
          width: 1,
        },
      },
    },
  });

  const view = new MapView({
    map: map,
    container: "viewDiv",
    zoom: 15,
    center: [89.6345785, 27.466907],
  });

  map.add(plotsLayer);
  map.add(geojsonLayer);

  geojsonLayer.when(function () {
    view.extent = geojsonLayer.fullExtent;
  });

  const townselector = document.querySelector("calcite-dropdown");
  townselector.addEventListener("calciteDropdownSelect", (event) => {
    let selectionValues = []; // Create an array
    townselector.selectedItems.forEach((item) =>
      selectionValues.push(item.label)
    );
    const newUrl =
      "https://zhichar.bt/dev/sub-administrative-zone/buildings/geom/" +
      selectionValues[0];
    console.log(newUrl);
    console.log("DROP DOWN TRIGGERED");

    map.remove(geojsonLayer);
    map.remove(plotsLayer);
    geojsonLayer = new GeoJSONLayer({
      url: newUrl,
      copyright: "Drujeygang Buildings",
      title: "Buildings",
      ppopupEnabled: true, // Enable popups on click
      popupTemplate: {
        title: "Building Information",
        content:
          "<p>Building Roof Area: <b>{areaSqFt} Sqft</b></p>" +
          "<ul><li>Location Tag: {location}</li>" +
          "<li>BuildingID: {buildingid}</li>" +
          "<li>Confidence: {confidence}</li></ul>",
      },
    });

    const newPlotsUrl =
      "https://zhichar.bt/dev/sub-administrative-zone/plots/geom/" +
      selectionValues[0];
    plotsLayer = new GeoJSONLayer({
      url: newPlotsUrl,
      copyright: "zhichar",
      title: "Plots",
      ppopupEnabled: true, // Enable popups on click
      popupTemplate: {
        title: "Plots Information",
        content: "<p>Plot ID: <b>{plotid} Sqft</b></p>",
      },
      renderer: {
        // Add this to style the buildings with a red fill
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: "transparent",
          outline: {
            color: "white",
            width: 1,
          },
        },
      },
    });
    map.add(plotsLayer);
    map.add(geojsonLayer);
    geojsonLayer.when(function () {
      view.extent = geojsonLayer.fullExtent;
    });
  });

  const legend = new Legend({
    view: view,
    container: "legend-container",
  });

  let layerList = new LayerList({
    view: view,
    container: "layer-container",
  });

  let scaleBar = new ScaleBar({
    view: view,
    unit: "metric",
  });

  // Add widgets to the view's UI
  view.ui.add(legend, "top-right");
  view.ui.add(scaleBar, "bottom-right");
  view.ui.add(layerList, "top-right");

  const appDetailModalBtn = document.getElementById("app-details-action");
  const appDetailModalEl = document.getElementById("app-details-modal");
  appDetailModalBtn.addEventListener("click", () => {
    appDetailModalEl.open = !appDetailModalEl.open;
  });
});
