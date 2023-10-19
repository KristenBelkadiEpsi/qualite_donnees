<template>
  <div style="height: 600px; width: 800px">
    <LMap :zoom="zoom" :center="(center as PointExpression)" ref="map">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <l-marker :lat-lng="(center as [number, number])">
        <l-tooltip>EPSI</l-tooltip></l-marker
      >
      <l-geo-json
        v-for="(circuit, index) in circuits"
        :geojson="circuit"
        :key="index"
      >
      </l-geo-json>
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
  },

  data() {
    return {
      zoom: 13,
      center: [47.20624365988347, -1.5393715932931804],
      circuits: [],
    };
  },
  methods: {
    async getCircuits() {
      axios
        .get(
          "https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_tan-circuits/records?limit=-1"
        )
        .then((reponse: any) => {
          this.circuits = reponse.data.results.map((e: any) => e.shape);
        });
    },
  },
  async mounted() {
    await this.getCircuits();
  },
});
</script>
