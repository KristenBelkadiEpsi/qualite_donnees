<template>
  <div style="height: 1080px; width: 1920px">
    <LMap :zoom="zoom" :center="(center as PointExpression)" ref="map" @update:zoom="zoomUpdate"	>
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <l-marker :lat-lng="(center as [number, number])">
        <l-tooltip>EPSI</l-tooltip>
      </l-marker
      >
      <l-geo-json
        v-for="(circuit, index) in circuits"
        :key="index"
        :geojson="circuit.shape"
        :options-style="
          () => {
            return { color: '#' + circuit.color, weight: 3, opacity: 1 };
          }
        "
      >
      </l-geo-json>
      <l-marker
        v-for="(arret, index) in arrets"
        :key="index"
        :lat-lng="([arret.stop_coordinates.lat, arret.stop_coordinates.lon] as [number,number])"
      >
      <l-icon
          :icon-size="icon.iconSize"
          icon-url="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png"
        />
        <l-tooltip>{{ arret.stop_name }}</l-tooltip>
      </l-marker>
    </LMap>
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
      zoom: 13,
      center: [47.20624365988347, -1.5393715932931804],
      circuits: <any[]>[],
      nombreArrets: 0,
      arrets: <any[]>[],
      icon: {
        iconUrl: "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
        iconSize: [10, 10] as [number, number],
      },
    };

  },
  methods: {
    zoomUpdate(zoom: number)  {
      const baseIconSize = 4; // Taille de l'icône à un zoom de 0


      const adjustedIconSize = baseIconSize + (zoom * 2); // Ajuster la taille en fonction du zoom


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
              color: e.route_color
            };
          });
        });
    },
    async getArrets() {
      await axios
        .get(
          "https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_tan-arrets/records"
        )
        .then((result) => {
          this.nombreArrets = result.data.total_count;
        });
        for (let i = 0; i <= this.nombreArrets; i += 100) { 
        await axios
          .get(
            `https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_tan-arrets/records?offset=${i}&limit=100`
          )
          .then((reponse) => {
            let tab: any[] = reponse.data.results;
            tab.forEach(e => this.arrets.push(e));
          });
      }

    }
  },
  async mounted() {
    await this.getCircuits();
    await this.getArrets();
  }
});
</script>
