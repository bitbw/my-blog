<template>
  <div>
    father
    <Child />
  </div>
</template>

<script>
import Child from "./child.vue";
export default {
  components: {
    Child,
  },
  created() {
    console.log("father=============created");
  },
  destroyed(){
     console.log("father=============destroyed");
  },
    mounted() {
     console.log("father=============mounted");
  },
};
</script>

<style></style>
