<template>
  <aside class="sidebar">
    
    <router-link :to="{ name: 'MyUpload' }" custom v-slot="{ href, navigate, isActive }">
        <Button 
          label="My Uploads" 
          icon="pi pi-cloud-upload" 
          :class="['menu-btn', { 'active-route': isActive }]" 
          :href="href"
          @click="navigate" 
        />
    </router-link>
    
    <router-link :to="{ name: 'PrivateAlbum' }" custom v-slot="{ href, navigate, isActive }">
        <Button 
          label="Albums Private" 
          icon="pi pi-folder-open" 
          :class="['menu-btn', { 'active-route': isActive }]" 
          :href="href"
          @click="navigate" 
        />
    </router-link>
    
    <router-link :to="{ name: 'PublicAlbum' }" custom v-slot="{ href, navigate, isActive }">
        <Button 
          label="Albums Community" 
          icon="pi pi-folder-open" 
          :class="['menu-btn', { 'active-route': isActive }]" 
          :href="href"
          @click="navigate" 
        />
    </router-link>

    <router-link :to="{ name: 'Faver' }" custom v-slot="{ href, navigate, isActive }">
        <Button 
          label="Yêu Thích" 
          icon="pi pi-heart-fill" 
          :class="['menu-btn', { 'active-route': isActive }]" 
          :href="href"
          @click="navigate" 
        />
    </router-link>
    
    <router-link :to="{ name: 'Trash' }" custom v-slot="{ href, navigate, isActive }">
        <Button 
          label="Thùng Rác" 
          icon="pi pi-trash" 
          :class="['menu-btn', { 'active-route': isActive }]" 
          :href="href"
          @click="navigate" 
        />
    </router-link>

    </aside>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { RouterLink } from 'vue-router' // Import RouterLink để đảm bảo hoạt động
</script>

<style scoped>
.sidebar {
  width: 240px;
  border-right: 1px solid #ddd;
  padding: 0.5rem;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-btn {
  /* CSS cơ bản */
  width: 100%;
  justify-content: flex-start;
  font-weight: 600; 
  
  border-radius: 28px;
  background-color: transparent; 
  color: #333;
  border: none;
  padding: 0.75rem 1rem;
}

.menu-btn:hover {
  background-color: #e0e0e0;
  color: #333;
}

/* --- ACTIVE STATE (CSS đã sửa) --- */

/* Sử dụng class 'active-route' được thêm động từ router-link */
.active-route {
    background-color: #d9e8ff !important; /* Màu nền Active */
    color: #1a73e8 !important; /* Màu chữ Active */
    /* !important giúp ghi đè các style mặc định của PrimeVue */
}

/* Tối ưu hóa cho nút trong PrimeVue */
:deep(.p-button-label) {
    margin-left: 0.75rem; 
}

/* Đảm bảo icon cũng có màu active */
:deep(.active-route .p-button-icon) {
    color: #1a73e8 !important; 
}
</style>