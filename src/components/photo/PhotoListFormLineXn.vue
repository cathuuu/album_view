<template>
    <div class="photo-list-compo">
        <div v-if="!photos || photos?.length === 0" class="no-data">
            No data
        </div>
        <div v-else class="grids">
            <div v-for="(item, i) in photos" :key="i" class="photo-card">
                <PhotoItem :photo="item" v-if="type_component.type == 'favorites' ? item.liked : true" />
            </div>
        </div>

    </div>
</template>

<script setup>
import PhotoItem from './PhotoItem.vue';

defineProps({
    photos: {
        type: Array,
        default: () => []
    },
    type_component: {
        type: Object,
        default: () => ({ type: "photos" })
    }
});

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
</style>
