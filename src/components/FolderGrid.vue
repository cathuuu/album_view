<template>
  <div class="folder-grid">
    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-10 text-gray-400">
      <i class="pi pi-spin pi-spinner text-3xl mb-2"></i>
      <p>Đang tải dữ liệu...</p>
    </div>

    <!-- Empty -->
    <div v-else-if="!items.length" class="text-center py-20 text-gray-400">
      <i class="pi pi-folder-open text-5xl mb-3"></i>
      <p>Không có thư mục nào</p>
    </div>

    <!-- Items -->
    <div v-else class="data grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="item bg-[#1f2023] hover:bg-[#2a2b2f] p-3 rounded-xl shadow cursor-pointer transition"
        @click="$emit('item-click', item)"
      >
        <div class="flex flex-col items-center">
          <i
            :class="item.type === 'folder' ? 'pi pi-folder text-yellow-400' : 'pi pi-file text-blue-400'"
            class="text-4xl mb-3"
          ></i>
          <span class="truncate w-full text-center font-medium text-gray-200">
            {{ item.name }}
          </span>
          <small class="text-gray-400">
            {{ item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '' }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  items: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
});
defineEmits(['item-click']);
</script>

<style scoped>
.folder-grid {
  padding: 30px;
  background-color: #ebebeb;
  min-height: 80vh;
}
.data {
  display: flex;
  flex-wrap:wrap;
}
.item {
  width: 20%;
  box-sizing: border-box;
}
</style>
