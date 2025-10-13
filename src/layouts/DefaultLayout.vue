<template>
  <div class="layout">
    <Navbar />
    <div class="content">
      <Sidebar />
      <main class="main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from "../layouts/Navbar.vue";
import Sidebar from "../layouts/Sidebar.vue";
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.content {
  display: flex;
  flex: 1;
}
.main {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #fff;
}
</style>
