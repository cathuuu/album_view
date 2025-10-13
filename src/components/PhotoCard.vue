<template>
  <div class="photo-card" @click="onClick">
    <img :src="src" :alt="alt" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const onClick = () => emit('click')
</script>

<style scoped>
.photo-card {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}
.photo-card:hover {
  transform: scale(1.02);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.photo-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}
</style>
