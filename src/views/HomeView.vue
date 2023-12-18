<template>
  <div style="height: 1080px; width: 1920px; overflow: hidden;">
    <div className="container">
      <h1> Carte des circuits de la TAN </h1>
      <div className="button-container">
        <p className="filtreTitle">Filtres :</p>
        <div>
          <button @click="toggleTram" :class="{ active: tramOn }">Tram</button>
          <button @click="toggleBus" :class="{ active: busOn }">Bus</button>
        </div>
      </div>
      <div className="map-container">
        <LMap :zoom="zoom" :center="(center as PointExpression)" ref="map" @update:zoom="zoomUpdate">
          <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
            name="OpenStreetMap"></l-tile-layer>
          <l-marker :lat-lng="(center as [number, number])">
            <l-tooltip>EPSI</l-tooltip>
          </l-marker>
          <l-geo-json v-for="(circuit, index) in circuitsDisplayed" :key="index" :geojson="circuit.shape" :options-style="() => {
            return { color: '#' + circuit.color, weight: 3, opacity: 1 };
          }
            ">
          </l-geo-json>
          <l-marker v-for="(arret, index) in arretsDisplayed" :key="index"
            :lat-lng="([arret.stop_coordinates.lat, arret.stop_coordinates.lon] as [number, number])">
            <l-icon :icon-size="icon.iconSize"
              icon-url="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png" />
            <l-tooltip>{{ arret.stop_name }}</l-tooltip>
          </l-marker>
        </LMap>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  LMap,
  LTileLayer,
  LMarker,
  LTooltip,
  LGeoJson,
  LIcon,
} from "@vue-leaflet/vue-leaflet";
import { PointExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

export default defineComponent({
  name: "HomeView",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LGeoJson,
    LIcon,
  },

  data() {
    return {
      tramOn: false,
      busOn: false,
      zoom: 13,
      center: [47.20624365988347, -1.5393715932931804],
      circuits: <any[]>[],
      circuitsDisplayed: <any[]>[],
      circuitsTram: <any[]>[],
      circuitsBus: <any[]>[],
      nombreArrets: 0,
      arrets: <any[]>[],
      icon: {
        iconUrl: "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
        iconSize: [10, 10] as [number, number],
      },
      arretsDisplayed: <any[]>[],
      icons: {
        iconUrl: "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
        iconSize: [10, 10] as [number, number],
      }
    };

  },
  methods: {
    toggleTram() {
      this.tramOn = !this.tramOn;
      this.updateMapDisplay();
    },
    toggleBus() {
      this.busOn = !this.busOn;
      this.updateMapDisplay();
    },
    updateMapDisplay() {
      // Use this.tramOn and this.busOn to determine how to display tram/bus stops on the map
      if (this.tramOn && this.busOn) {
        // Display both tram and bus stops
        this.circuitsDisplayed = this.circuits;
      } else if (this.tramOn) {
        // Display only tram stops
        this.circuitsDisplayed = this.circuitsTram;
      } else if (this.busOn) {
        // Display only bus stops
        this.circuitsDisplayed = this.circuitsBus;
      } else {
        // Display no circuits
        this.circuitsDisplayed = [];
      }
    },
    zoomUpdate(zoom: number) {
      const baseIconSize = 1; // Taille de l'icône à un zoom de 0


      const adjustedIconSize = baseIconSize + zoom; // Ajuster la taille en fonction du zoom


      this.icon = {
        iconUrl: "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
        iconSize: [adjustedIconSize, adjustedIconSize] as [number, number],
      }
    },
    async getCircuits() {
      axios
        .get(
          "https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_tan-circuits/records?limit=-1"
        )
        .then((reponse: any) => {
          this.circuits = reponse.data.results.map((e: any) => {
            return {
              shape: e.shape,
              color: e.route_color,
              route_type: e.route_type
            };
          });
        });
    },
    async getArrets() {
      await axios
        .get(
          "https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_tan-arrets/records"
        )
        .then((result: any) => {
          this.nombreArrets = result.data.total_count;
        });
      for (let i = 0; i <= this.nombreArrets; i += 100) {
        await axios
          .get(
            `https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_tan-arrets/records?offset=${i}&limit=100`
          )
          .then((reponse: any) => {
            let tab: any[] = reponse.data.results;
            tab.forEach(e => this.arrets.push(e));
          });
      }

    }
  },
  async mounted() {
    await this.getCircuits();
    await this.getArrets();
    this.updateMapDisplay();
    this.circuitsDisplayed = this.circuits;
    this.arretsDisplayed = this.arrets;
    console.log(this.circuits)
    this.circuitsBus = this.circuits.filter((e: any) => e.route_type === "Bus");
    this.circuitsTram = this.circuits.filter((e: any) => e.route_type === "Tram");
  }
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}

.button-container {
  padding: 10px;
  background-color: rgb(206, 209, 213);
  width: 30vh;
  margin-bottom: 2vh;
}

button {
  padding: 10px;
  margin: 0.75vh;
  width: 10vh;
  cursor: pointer;
  border: none;
  outline: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

button.active {
  background-color: #000000;
  color: #fff;
}

.map-container {
  width: 75vw;
  /* 75% of the viewport width */
  height: 75vw;
  /* Set the height equal to the width for a square */
  max-width: 75vh;
  /* Set a maximum width if needed */
  max-height: 60vh;
  /* Set a maximum height if needed */
  margin-top: 2vh;
  /* Add margin at the top */
  border: 1px solid #000000;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.filtreTitle {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 5px;
}
</style>