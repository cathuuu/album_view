import { createRouter, createWebHistory } from 'vue-router'

// 1. Imports các Views đã được refactor
import MyUpload from '../pages/MyUpload.vue' 
import Faver from '../pages/Faver.vue'      
import Trash from '../pages/Trash.vue'     

// Imports các Sub-views của Album
import PublicAlbum from '../pages/Album/PublicAlbum.vue'
import PrivateAlbum from '../pages/Album/PrivateAlbum.vue'

// (Giả định MainLayout là component cha)
// import MainLayout from '../layouts/MainLayout.vue' 

const routes = [
  {
    path: '/',
    // component: MainLayout, // Component Layout chính của bạn
    children: [
      // 1. Chuyển hướng trang chủ: '/' => '/my-upload'
      { path: '', redirect: '/my-upload' }, 
      
      // 2. Tải Lên Của Tôi (MyUpload - Trang Chủ Mới)
      { path: 'my-upload', name: 'MyUpload', component: MyUpload }, 
      
      { path: 'public', name: 'PublicAlbum', component: PublicAlbum },

      { path: 'private', name: 'PrivateAlbum', component: PrivateAlbum },
      // 3. Yêu Thích (Faver)
      { path: 'favorites', name: 'Faver', component: Faver },
      
      // 4. Thùng Rác (Trash)
      { path: 'trash', name: 'Trash', component: Trash },

      // 5. Quản lý Album (Được chia nhỏ)
  
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router