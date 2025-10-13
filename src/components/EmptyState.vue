<template>
  <div class="empty-state">
    <i class="pi pi-image" />
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: gray;
  padding: 2rem;
}
.empty-state i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
</style>
