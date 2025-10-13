<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FolderView from '../../components/FolderView.vue';
import type { StorageItem } from '../../types/StorageItem';
import { fileData } from '../../graphql/FakeData.js';
import { useRouter } from 'vue-router';

const isLoading = ref<boolean>(false);
const publicItems = ref<StorageItem[]>([]);
const router = useRouter();

const fetchPublicItems = async () => {
    isLoading.value = true;
    try {
        publicItems.value = fileData.data.getUserItems.filter((item: any) => item.isPublic && !item.isDeleted);
    } finally {
        isLoading.value = false;
    }
};

const handleItemClick = (item: StorageItem) => {
    if (item.isAlbum) {
        router.push({ name: 'AlbumDetail', params: { id: item.id } });
    }
};

onMounted(fetchPublicItems);
</script>

<template>
    <FolderView
        title="Album Công Khai"
        :items="publicItems"
        :isLoading="isLoading"
        :rows="16"
        :showBreadcrumb="false"
        emptyMessage="Không có mục công khai."
        @item-click="handleItemClick"
    />
</template>