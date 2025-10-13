<template>
  <header class="navbar">
    <div class="left">
      <i class="pi pi-images logo "></i>
      <span class="title">Photo Zamura</span>
    </div>

    <div class="center">
      <span class="p-input-icon-left w-full">
        <i class="pi pi-search"></i>
        <!-- <InputText v-model="search" placeholder="Search your photos" class="search" /> -->
        <input class="boderSearch" type="text" />
      </span>
    </div>

    <div class="right">
      <Button icon="pi pi-bell" text rounded></Button>
      <Button icon="pi pi-user" text rounded></Button>
    </div>
  </header>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { ref } from 'vue'

const search = ref('')
</script>

<style scoped>
.navbar {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding: 0 1rem;
  background: #fff;
}

.boderSearch {
  border: solid black;
  border-width: 1px;
  border-radius: 19px;
  width: 20vw;
  height: 25px;
  /* border-block-color: aqua; */
  border-color: darkgray;
  margin: 0px 0px 10px 10px;

}

.boderSearch:hover {
  border: solid black;
  border-width: 1px;
  border-radius: 19px;
  width: 20vw;
  height: 25px;
  /* border-block-color: aqua; */
  border-color: rgb(94, 69, 220);

  margin: 0px 0px 10px 10px;
}

.pi:hover {
  /* margin-top: 5px; */
  color: rgb(31, 31, 204)
}

.left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  margin-right: 0.5rem;
  color: #1976d2;
}

.title {
  font-weight: 600;
  font-size: 1.2rem;
}

.center {
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
}

.search {
  width: 100%;
}

.right {
  display: flex;
  gap: 0.5rem;
}
</style>
