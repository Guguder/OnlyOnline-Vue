<template>
  <a-space direction="vertical" :style="containerStyle">
    <a-layout style="width: 100%; min-height: 100vh">
      <HeaderNavbar v-if="!hideNavigation" />

      <a-layout-content :style="contentStyle">
        <div class="content-container" :class="{ 'p-0': hideNavigation }">
          <router-view />
        </div>
      </a-layout-content>

      <a-layout-footer v-if="!hideNavigation">
        <Footer />
      </a-layout-footer>
    </a-layout>
    <login-modal />
  </a-space>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Footer from "../components/Footer.vue";
import LoginModal from "../components/auth/LoginModal.vue";
import HeaderNavbar from "../components/layout/HeaderNavbar.vue";

const route = useRoute();
const hideNavigation = computed(() => route.meta.hideNavAndFooter);

const containerStyle = {
  width: "100%",
  display: "block",
  margin: 0,
  padding: 0,
};

const contentStyle = {
  backgroundColor: "#F5F5F7",
};
</script>
