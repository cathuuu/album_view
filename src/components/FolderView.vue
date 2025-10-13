<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import DataView from 'primevue/dataview';
import DataViewLayoutOptionsComp from 'primevue/dataviewlayoutoptions';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Breadcrumb from 'primevue/breadcrumb';
import FileItemDisplay from './FileItemDisplay.vue';
import type { StorageItem } from '../types/StorageItem';

interface BreadcrumbItem { label: string; id?: string }

type LayoutType = 'grid' | 'list';

type SortKey = 'nameAsc' | 'nameDesc' | 'dateDesc' | 'dateAsc' | 'sizeDesc' | 'sizeAsc';

type FilterKey = 'all' | 'album' | 'file' | 'image' | 'document' | 'video';

const props = withDefaults(defineProps<{
  title?: string
  items: StorageItem[]
  isLoading?: boolean
  defaultLayout?: LayoutType
  rows?: number
  showBreadcrumb?: boolean
  breadcrumbItems?: BreadcrumbItem[]
  emptyMessage?: string
  enableSearch?: boolean
  enableSort?: boolean
  enableFilter?: boolean
  showCreateButton?: boolean
  createButtonLabel?: string
}>(), {
  title: 'Thư mục',
  isLoading: false,
  defaultLayout: 'grid',
  rows: 16,
  showBreadcrumb: false,
  breadcrumbItems: () => [],
  emptyMessage: 'Không có mục nào để hiển thị.',
  enableSearch: true,
  enableSort: true,
  enableFilter: true,
  showCreateButton: false,
  createButtonLabel: 'Tạo Thư Mục'
});

const emit = defineEmits<{
  (e: 'layout-change', layout: LayoutType): void
  (e: 'item-click', item: StorageItem): void
  (e: 'favorite-toggle', itemId: string, isFavorite: boolean): void
  (e: 'delete-item', itemId: string): void
  (e: 'create-folder-click'): void
  (e: 'breadcrumb-click', item: BreadcrumbItem, index: number): void
  (e: 'search-change', value: string): void
  (e: 'sort-change', value: SortKey): void
  (e: 'filter-change', value: FilterKey): void
}>()

const layout = ref<LayoutType>(props.defaultLayout);
watch(layout, (val) => emit('layout-change', val));

const searchQuery = ref<string>('');
watch(searchQuery, (val) => emit('search-change', val));

const sortKey = ref<SortKey>('nameAsc');
watch(sortKey, (val) => emit('sort-change', val));

const filterKey = ref<FilterKey>('all');
watch(filterKey, (val) => emit('filter-change', val));

const totalCount = computed(() => props.items.length);

const processedItems = computed<StorageItem[]>(() => {
  let data = props.items.slice();

  // Filter by search
  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    data = data.filter((it) => it.name.toLowerCase().includes(q));
  }

  // Filter by type
  switch (filterKey.value) {
    case 'album':
      data = data.filter((it) => it.isAlbum);
      break;
    case 'file':
      data = data.filter((it) => !it.isAlbum);
      break;
    case 'image':
      data = data.filter((it) => !it.isAlbum && it.type === 'image');
      break;
    case 'document':
      data = data.filter((it) => !it.isAlbum && it.type === 'document');
      break;
    case 'video':
      data = data.filter((it) => !it.isAlbum && it.type === 'video');
      break;
    default:
      break;
  }

  // Sort
  const parseDate = (s: string) => new Date(s).getTime() || 0;
  data.sort((a, b) => {
    switch (sortKey.value) {
      case 'nameAsc':
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      case 'dateAsc':
        return parseDate(a.uploadedDate) - parseDate(b.uploadedDate);
      case 'dateDesc':
        return parseDate(b.uploadedDate) - parseDate(a.uploadedDate);
      case 'sizeAsc':
        return a.size - b.size;
      case 'sizeDesc':
        return b.size - a.size;
      default:
        return 0;
    }
  });

  return data;
});

const sortOptions: { label: string; value: SortKey }[] = [
  { label: 'Tên (A→Z)', value: 'nameAsc' },
  { label: 'Tên (Z→A)', value: 'nameDesc' },
  { label: 'Ngày (mới nhất)', value: 'dateDesc' },
  { label: 'Ngày (cũ nhất)', value: 'dateAsc' },
  { label: 'Kích thước (lớn→nhỏ)', value: 'sizeDesc' },
  { label: 'Kích thước (nhỏ→lớn)', value: 'sizeAsc' }
];

const filterOptions: { label: string; value: FilterKey }[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chỉ thư mục', value: 'album' },
  { label: 'Chỉ tệp', value: 'file' },
  { label: 'Hình ảnh', value: 'image' },
  { label: 'Tài liệu', value: 'document' },
  { label: 'Video', value: 'video' }
];

const onBreadcrumbItemClick = (item: BreadcrumbItem, index: number) => {
  emit('breadcrumb-click', item, index);
};
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-2">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800">{{ title }}</h1>
      <div class="flex items-center gap-2">
        <slot name="right-actions" />
        <DataViewLayoutOptionsComp v-model:layout="layout" />
      </div>
    </div>

    <div v-if="showBreadcrumb && breadcrumbItems && breadcrumbItems.length" class="mb-3">
      <Breadcrumb :model="breadcrumbItems.map(b => ({ label: b.label }))">
        <template #item="slotProps">
          <a href="#" class="text-sm" @click.prevent="onBreadcrumbItemClick(breadcrumbItems[slotProps.index], slotProps.index)">
            {{ slotProps.item.label }}
          </a>
        </template>
      </Breadcrumb>
    </div>

    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 p-3 border-b border-gray-200 rounded">
      <div class="flex items-center gap-2">
        <slot name="left-actions" />
        <Button v-if="showCreateButton" :label="createButtonLabel" icon="pi pi-folder-open" @click="$emit('create-folder-click')" />
      </div>
      <div class="flex items-center gap-2">
        <div v-if="enableSearch" class="relative">
          <i class="pi pi-search absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <InputText v-model="searchQuery" placeholder="Tìm kiếm..." class="pl-8" />
        </div>
        <Dropdown v-if="enableFilter" v-model="filterKey" :options="filterOptions" optionLabel="label" optionValue="value" placeholder="Bộ lọc" class="w-40" />
        <Dropdown v-if="enableSort" v-model="sortKey" :options="sortOptions" optionLabel="label" optionValue="value" placeholder="Sắp xếp" class="w-48" />
      </div>
    </div>

    <div v-if="isLoading" class="text-center p-10 text-xl text-blue-500">
      <i class="pi pi-spin pi-spinner text-3xl mr-2"></i> Đang tải dữ liệu...
    </div>

    <template v-else>
      <div class="mb-3 text-sm text-gray-600">Tổng cộng: <strong>{{ processedItems.length }}</strong> / {{ totalCount }} mục</div>

      <DataView :value="processedItems" :layout="layout" :paginator="true" :rows="rows" dataKey="id">
        <template #header>
          <template v-if="layout === 'list'">
            <slot name="list-header" />
          </template>
        </template>

        <template #list="slotProps">
          <FileItemDisplay 
            :item="slotProps.data" 
            layout="list"
            @item-click="(it) => $emit('item-click', it)"
            @favorite-toggle="(id, fav) => $emit('favorite-toggle', id, fav)"
            @delete-item="(id) => $emit('delete-item', id)"
          />
        </template>

        <template #grid="slotProps">
          <FileItemDisplay 
            :item="slotProps.data" 
            layout="grid"
            @item-click="(it) => $emit('item-click', it)"
            @favorite-toggle="(id, fav) => $emit('favorite-toggle', id, fav)"
            @delete-item="(id) => $emit('delete-item', id)"
          />
        </template>

        <template #empty>
          <div class="text-center p-5 text-gray-500">{{ emptyMessage }}</div>
        </template>
      </DataView>
    </template>
  </div>
</template>
