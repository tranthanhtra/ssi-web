<template>
  <router-view/>
</template>

<script>
// import {LOCAL_STORAGE_TOKEN_NAME} from "./utils/constants";

export default {
  mounted() {
    // if (this.$route.path === "/") {
    //   if (!localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)) {
    //     this.$router.push("/login");
    //   } else {
    //     this.$router.push("/home");
    //   }
    // }
  },
};
</script>

<style>
@import url("./styles/main.css");
</style>
