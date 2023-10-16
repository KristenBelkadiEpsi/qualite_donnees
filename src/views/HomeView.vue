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
    </LMap>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { LMap, LTileLayer, LMarker, LTooltip } from "@vue-leaflet/vue-leaflet";
import { PointExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
export default defineComponent({
  name: "HomeView",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
  },
  data() {
    return {
      zoom: 13,
      center: [47.20624365988347, -1.5393715932931804],
    };
  },
  mounted() {
    console.log("chargé");
  },
});
</script>
