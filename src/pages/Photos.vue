<template>
  <div class="favorites-page">
    <h2 class="page-title">Your photos</h2>

    <div class="photo-grid">

      <PhotoListFormLineXn :photos="favorites" :type_component="{ type: 'photos' }" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { photoData } from '../graphql/FakeData.js'
import PhotoListFormLineXn from '../components/photo/PhotoListFormLineXn.vue'

const imgNull = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9HCTh-hWpcMY7Ka0ieXhioeEf5SSpIPQ6NA&s'
const favorites = ref()

favorites.value = photoData.data.getUserPhotos
console.log('test favorites : ', favorites.value)
</script>

<style scoped>
.page-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.photo-grid {
  width: 100%;
}

.photo-card img {
  width: 100%;
  aspect-ratio: 2/2;
  border-radius: 8px;
}
</style>
