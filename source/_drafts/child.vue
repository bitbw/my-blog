<template>
  <div>child</div>
</template>

<script>
export default {
  created() {
    console.log("child=============created");
  },
  destroyed() {
    console.log("child=============destroyed");
  },
  mounted() {
    console.log("child=============mounted");
  },
};
</script>

<style></style>
