<template>
  <div v-if="visible" class="lightbox" @click.self="close">
    <img :src="src" alt="preview" />
    <Button icon="pi pi-times" class="close-btn" @click="close" />
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

defineProps<{
  visible: boolean
  src: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const close = () => emit('close')
</script>

<style scoped>
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.lightbox img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
}
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
