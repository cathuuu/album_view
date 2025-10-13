<template>
    <div class="image-card">
        <div class="iconImage">
            <i v-if="photo?.liked" @click="() => LikeHandle(photo)" class="pi pi-heart-fill icon"
                style="font-size: 17px;color:#f871d9;background-color: white;"></i>
            <i v-else @click="() => LikeHandle(photo)" class="pi pi-heart icon" style="font-size: 17px; "></i>
            <i @click="visible = true" class="pi pi-ellipsis-v icon" style="font-size: 17px"></i>
        </div>
        <img @click="visiblPhoto = true" :src="photo?.url" class="image" />

        <!-- <div class="info">
            {{ "name here" }}
            <h3 class="title">{{ image.title }}</h3>
            <p class="desc">{{ image.description }}</p>
        </div> -->

        <!-- photo full screen -->
        <Dialog v-model:visible="visiblPhoto" maximizable modal :header="photo.filename" :style="{ width: '50rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <p>{{ photo?.filename }}</p>
                <i @click="visible = true" class="pi pi-share-alt" style="font-size: 2rem"></i>
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
                <h4>Chọn người dùng để chia sẻ album</h4>
                <hr style="border-bottom: solid 2px black;
                 width: 100%;" />
                <ul class="folder-list">
                    <li v-for="(item, i) in users" :key="i" @click="shareToUser(photo, item)" class="album-item">
                        <i class="pi pi-user"></i> {{ item.name }}
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
        <!-- /// dialog confirm -->
        <Dialog v-model:visible="visibleConfirm" modal header="Phân quyền chia sẻ" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Chọn quyền người dùng</span>
            <br></br>
            <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a City"
                class="w-full md:w-14rem" />
            <div class="flex justify-end gap-2">
                <Button type="button" label="Thoát" severity="secondary" @click="visibleConfirm = false"></Button>
                <Button type="button" label="Xác nhận" @click="handleShareAlbum()"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { ref } from 'vue';
import { userList } from '../../graphql/FakeData.js'
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';

const props = defineProps({
    photo: {
        type: Object,
        required: true,
        default: () => ({
            // name: "ss",
            // cover: "No Title",
            // description: "No Description",
            id: null,
            url: "https://t3.ftcdn.net/jpg/03/08/79/70/360_F_308797039_9fsJmkRwEcLJT73bk0EbGIqKpQiibfVa.jpg",
            filename: "img1",
            liked: true,
            createdAt: "2025-09-28T11:42:40.806042Z",
            isDeleted: false
        })
    },
    id_album: {
        type: String,
        // required: true,
        default: () => (null)
    }

});

const visible = ref(false)
const visibleConfirm = ref(false)
const visiblPhoto = ref(false)
const users = ref(userList.data.getUsers)
const selectedCity = ref();
const cities = ref([
    { name: 'Chỉ được xem', code: 'VIEW' },
    { name: 'Được xem và sửa đổi', code: 'EDIT' },
    { name: 'Công khai với mọi người', code: 'PUBLIC' },

]);

const LikeHandle = (item) => {
    alert("sử lý sự liện ảnh yêu thích ở đây")
}
const selectedShareData = ref({
    idAlbum: "",
    user: {}
})
const shareToUser = (photoParam, userParam) => { // tham số đầu vào : (photo,user)
    visibleConfirm.value = true
    selectedShareData.value.user = userParam
    selectedShareData.value.album = props.id_album


}
const handleShareAlbum = (item) => { // tham số đầu vào : (photo,user)| cần : id_album,owner_id,id_user_share,permision
    visibleConfirm.va = false
    // gọi api thực hiện chia sẻ album tại đây
    alert("sử lý gọi api tạo chia sẻ tại đây !")
}


</script>

<style scoped>
.image-card {
    border: 1px solid #eee;
    border-radius: 6px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    cursor: pointer;
    width: 100%;
    /* height: max-content; */
    position: relative;
    height: 96%;
}


.iconImage {
    position: absolute;
    top: 0;
    right: 0;
    /* Đẩy sang bên phải */
    display: flex;
    flex-direction: column;
    /* Xếp dọc */
    align-items: flex-end;
    /* Icon dính sát lề phải */
    padding: 5px;
    gap: 10px;
    /* Khoảng cách giữa các icon */
    color: white;
    height: 100%;
    justify-content: space-between;
}


.icon {
    background: #ffffff85;
    /* nền mờ cho icon nổi bật */
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

/* .image-card:hover .image {
    border: solid 1px black;
    opacity: 0.9;
} */

.info {
    padding: 0.5rem 1rem;
}

.title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
}

.desc {
    margin: 0.25rem 0 0;
    color: #666;
    font-size: 0.9rem;
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

.album-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
}

.album-item:hover {
    background: #f0f0f0;
}
</style>
