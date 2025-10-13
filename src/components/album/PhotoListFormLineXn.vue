<template>
    <div class="photo-list-compo" :class="{ 'drop-zone': dragFileStatus }" @dragenter.prevent="onDragEnter"
        @dragleave.prevent="onDragLeave" @dragover.prevent @drop.prevent="handleDrop">
        <div v-if="!album || album?.photos?.length === 0" class="no-data">
            No data
        </div>
        <div v-else class="grids">
            <div v-for="(item, i) in album?.photos" :key="i" class="photo-card">
                <!-- <img :src="photo" alt="photo" /> -->
                <PhotoItem :photo="item" :id_album="'1'" />
            </div>
            <!-- ////// sự kiện kéo thả upload -->

            <!-- /// -->
            <!-- <div :class="{ 'drop-zone': dragFileStatus }" @dragenter.prevent="onDragEnter" @dragleave.prevent="onDragLeave"
                @dragover.prevent @drop.prevent="handleDrop">
                <p>Kéo và thả ảnh vào đây</p>
            </div> -->


        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import PhotoItem from './PhotoItem.vue';

defineProps({
    album: {
        type: Object,
        default: () => ({})
    },

});

const dragFileStatus = ref(false)

const onDragEnter = () => {
    dragFileStatus.value = true
}
const onDragLeave = () => {
    dragFileStatus.value = false
}

// tham số cần có: (file, id_album, user_id)
const handleDrop = (event) => {

    // console.log("Ảnh đã thả:");
    dragFileStatus.value = false
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
        alert('chưa có cloud upload trong back end tạp thười tưởng tượng đây là hàm upload ! ')
        // xử lý upload ảnh ở đây
    } else {
        alert("Vui lòng chọn đúng định dạng ảnh!");
    }
}

// console.log("album check : ", album)
</script>

<style scoped>
.photo-list-compo {
    /* margin-top: 1rem;
    min-height: 150px;
    display: flex;
    justify-content: center;
    align-items: center; */
    width: 100%;

    position: relative;
}

.no-data {
    color: #888;
    font-size: 1.1rem;
    text-align: center;
}

.grids {
    /* display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
    width: 100%; */
    display: flex;
    flex-wrap: wrap;
    width: fit-content;
}

.photo-card {
    /* width: 20%; */
    border-radius: 6px;
    object-fit: cover;
    width: 14vw;
    padding: 5px;
}

.upload-box {
    width: 300px;
    height: 200px;
    border: 2px dashed #aaa;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.drop-zone {
    /* width: 300px;
    height: 200px; */
    /* border: 2px dashed #000000; */
    /* display: flex;
    align-items: center;
    justify-content: center; */
    /* opacity: 0.5; */
}

.drop-zone::before {
    content: "Thả file ảnh vô đây";
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px dashed #11d7ff;
    background-color: rgba(0, 153, 255, 0.34);
    z-index: 10;
    border-radius: 15px;
}
</style>
