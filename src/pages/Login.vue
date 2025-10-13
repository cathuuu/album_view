<template>
    <div class="login-page">
        <form class="login-card" @submit.prevent="onSubmit">
            <h2 class="title">Login</h2>
            <small>cái này chỉ là test vì album cần dùng user id và name nên tạo tạm biến ảo bằng cái này </small>
            <div class="field">
                <label for="id">id user</label>
                <input id="id" v-model="form.id" type="number" required placeholder="nhập id người dùng" />
            </div>

            <div class="field">
                <label for="useName">name user</label>
                <input id="useName" v-model="form.usename" type="text" required placeholder="Tên người dùng" />
            </div>

            <div class="row between">

                <button type="submit" class="btn" :disabled="loading">
                    <span v-if="!loading">Login</span>
                    <span v-else>Loading...</span>
                </button>
            </div>

            <!-- <p v-if="serverError" class="server-error">{{ serverError }}</p> -->

        </form>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { taocock } from '../graphql/CookieFuntion.js'

const form = reactive({
    email: '',
    password: '',
    remember: false,
    id: '',
    usename: ''
})

const errors = reactive({ email: '', password: '' })
const serverError = ref('')
const loading = ref(false)

function validate() {
    // errors.email = ''
    // errors.password = ''
    // serverError.value = ''

    let ok = true
    // if (!form.email) {
    //     errors.email = 'Email is required.'
    //     ok = false
    // } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    //     errors.email = 'Please enter a valid email.'
    //     ok = false
    // }

    // if (!form.password) {
    //     errors.password = 'Password is required.'
    //     ok = false
    // } else if (form.password.length < 6) {
    //     errors.password = 'Password must be at least 6 characters.'
    //     ok = false
    // }

    return ok
}

function onSubmit() {
    // if (!validate()) return
    console.log('ok')
    loading.value = true
    // serverError.value = ''
    // taocock("userDetail", {
    //     id_user: form.id,
    //     usename: form.usename
    // })
    // taocock("userDetail", "ssssssss")
    try {
        // TODO: replace with real API call
        taocock("userDetail", {
            id_user: form.id,
            usename: form.usename
        })
        // emit event or redirect
        // e.g. router.push('/dashboard') or emit('loginSuccess')
        console.log('Login success', { ...form })
        window.location.reload()

    } catch (err) {
        serverError.value = err?.message || 'Login failed. Please try again.'
    } finally {
        loading.value = false
    }
}


</script>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fb;
    padding: 24px;
}

.login-card {
    width: 360px;
    background: #ffffff;
    border-radius: 10px;
    padding: 24px;
    box-shadow: 0 6px 18px rgba(17, 24, 39, 0.08);
    display: flex;
    flex-direction: column;
}

.title {
    margin: 0 0 16px 0;
    font-size: 1.25rem;
    text-align: center;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
}

.field input[type="email"],
.field input[type="password"] {
    padding: 10px 12px;
    border: 1px solid #e6e9ef;
    border-radius: 8px;
    outline: none;
    transition: box-shadow 0.15s, border-color 0.15s;
}

.field input:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08);
    border-color: rgba(59, 130, 246, 0.6);
}

.row.between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
    margin-bottom: 12px;
}

.checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
}

.btn {
    background: #2563eb;
    color: white;
    padding: 8px 14px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 600;
}

.btn[disabled] {
    opacity: 0.6;
    cursor: default;
}

.error {
    color: #dc2626;
    font-size: 0.85rem;
    margin: 0;
}

.server-error {
    color: #b91c1c;
    margin-top: 8px;
    text-align: center;
}

.small {
    text-align: center;
    color: #6b7280;
    font-size: 0.9rem;
    margin-top: 14px;
}

a {
    color: #2563eb;
    text-decoration: none;
}
</style>