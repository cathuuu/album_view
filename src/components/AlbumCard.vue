<template>
  <div class="album-card" @click="onClick">
    <img :src="cover" :alt="title" />
    <div class="info">
      <h4>{{ title }}</h4>
      <p>{{ count }} items</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  cover: string
  title: string
  count: number
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const onClick = () => emit('click')
</script>

<style scoped>
.album-card {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.album-card:hover {
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
}
.album-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}
.info {
  padding: 0.5rem;
}
.info h4 {
  margin: 0;
  font-size: 14px;
}
.info p {
  margin: 0;
  font-size: 12px;
  color: gray;
}
</style>
