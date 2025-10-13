<template>
    <div class="image-card">
        <div class="iconImage">
            <i v-if="photo?.liked" @click="() => LikeHandle(photo)" class="pi pi-heart-fill icon"
                style="font-size: 17px; color:#f871d9; background-color: white;"></i>

            <i v-else @click="() => LikeHandle(photo)" class="pi pi-heart icon" style="font-size: 17px;"></i>

            <i @click="visible = true" class="pi pi-ellipsis-v icon" style="font-size: 17px"></i>
        </div>

        <img @click="visiblPhoto = true" :src="photo?.url" class="image" />

        <!-- photo full screen -->
        <Dialog v-model:visible="visiblPhoto" maximizable modal :header="photo.filename" :style="{ width: '50rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <p>{{ photo?.filename }}</p>
                <i @click="visible = true" class="pi pi-images" style="font-size: 2rem"></i>
                <!-- Or use a custom SVG -->
                <!-- <svg ...>...</svg> -->
            </template>
            <img :src="photo?.url" class="image" />

        </Dialog>
        <!-- Dialog thêm vào folder -->
        <Dialog v-model:visible="visible" modal :style="{ width: '30rem' }" class="custom-dialog">
            <template #header>
                <div class="dialog-header">
                    <img :src="photo?.url" class="thumb" />
                    <div class="info">
                        <h3>{{ photo?.filename }}</h3>
                        <p>{{ new Date(photo?.createdAt).toLocaleDateString() }}</p>
                    </div>

                </div>
            </template>

            <div class="dialog-body">
                <h4>Chọn album để thêm ảnh</h4>
                <hr style="border-bottom: solid 2px black;
                 width: 100%;" />
                <ul class="folder-list">
                    <li v-for="(item, i) in albums" :key="i" @click="addToAlbum(photo, item)" class="folder-item">
                        <i class="pi pi-folder"></i> {{ item.name }}
                    </li>
                </ul>
            </div>
            <div class="dialog-body">
                <!-- <span class="p-input-icon-left w-full">
                    <i class="pi pi-search"></i>
                    <input type="text" placeholder="Add people or groups" class="p-inputtext p-component w-full" />
                </span> -->

                <div class="share-options">
                    <Button icon="pi pi-link" @click="() => handleCoppy(photo?.url)" label="Create link" text></Button>
                    <Button icon="pi pi-facebook" label="Facebook" text></Button>
                    <Button icon="pi pi-envelope" label="Email" text></Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref } from "vue"
import Dialog from "primevue/dialog"
import Button from "primevue/button"
import copyToClipboard from "../../graphql/CookieFuntion.js"
import { DataAlbumUser } from "../../graphql/FakeData.js"
// import { DataAlbumUser } from "../graphql/FakeData.js"

defineProps({
    photo: {
        type: Object,
        required: true,
        default: () => ({
            id: null,
            url: "https://t3.ftcdn.net/jpg/03/08/79/70/360_F_308797039_9fsJmkRwEcLJT73bk0EbGIqKpQiibfVa.jpg",
            filename: "img1",
            liked: true,
            createdAt: "2025-09-28T11:42:40.806042Z",
            isDeleted: false
        })
    }
})

const visible = ref(false)
const visiblPhoto = ref(false)
const albums = ref([])
albums.value = DataAlbumUser.data.getUserAlbums
// console.log(albums.value)
const folders = ref([
    { id: 1, name: "Gia đình" },
    { id: 2, name: "Du lịch" },
    { id: 3, name: "Công việc" },
    { id: 4, name: "Khác" }
])

function addToAlbum(photoParam, albumParam) {
    alert(`Đã thêm ảnh "${photoParam.filename}" vào album "${albumParam.name}"`)
    // visible.value = false
}

const handleCoppy = (text) => {
    copyToClipboard(text)
}

const LikeHandle = (item) => {
    alert("sử lý sự liện ảnh yêu thích ở đây")
}

</script>

<style scoped>
.image-card {
    border: 1px solid #eee;
    border-radius: 6px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    width: 100%;
    position: relative;
    height: 96%;
}

.iconImage {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 5px;
    gap: 10px;
    color: white;
    height: 100%;
    justify-content: space-between;
}

.icon {
    background: #ffffff85;
    border-radius: 50%;
    padding: 6px;
    cursor: pointer;
    transition: background 1s;
    display: none;
}

.image-card:hover .icon {
    display: block;
}

.icon:hover {
    background: rgba(0, 0, 0, 0.6);
}

.image {
    width: 100%;
    aspect-ratio: 7 / 5;
    object-fit: cover;
    transition: opacity 0.6s;
}

/* Dialog style */
.custom-dialog .dialog-header {
    display: flex;
    align-items: center;
    gap: 12px;
}

.custom-dialog .thumb {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
}

.custom-dialog .info h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
}

.custom-dialog .info p {
    margin: 0;
    font-size: 0.8rem;
    color: #666;
}

.dialog-body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 10px;
}

/* Folder list */
.folder-list {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 200px;
    overflow: scroll;
}

.folder-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
}

.folder-item:hover {
    background: #f0f0f0;
}
</style>
