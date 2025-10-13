<script setup>

/// mới bỏ <script setup lang="ts"> để nó tránh kiểm tra cú pháp ts nếu cần thì đặt lại bình thường 
import { ref } from 'vue';
import Navbar from '../src/layouts/Navbar.vue'
import Sidebar from '../src/layouts/Sidebar.vue'
import { getCookie } from './graphql/CookieFuntion.js'
import Login from './pages/Login.vue';
// import { ui } from './graphql/ass.vue';

var cookie = ref()
const getcok = () => {
  var cokie = getCookie("userDetail")
  console.log("cookie check : ", cookie)
  cookie.value = cokie

}
getcok()
</script>

<template>

  <div>
    <div v-if="cookie == null">
      <Login />
    </div>
    <div v-if="cookie != null" class="layout">
      <!-- Navbar trên cùng -->
      <Navbar />

      <div class="main-container">
        <!-- Sidebar bên trái -->
        <Sidebar />

        <!-- Nội dung chính -->
        <main class="content">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>


<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.content {
  flex: 1;
  padding: 1.5em;
  overflow-y: auto;
  background-color: #f5f5f5;
}
</style>
