import { defineStore } from 'pinia'

export interface Photo {
  id: string
  url: string
  title?: string
  favorite?: boolean
  albumId?: string
  createdAt: string
  filename:string
}

export const usePhotoStore = defineStore('photoStore', {
  state: () => ({
    photos: [] as Photo[],
    albums: [] as { id: string; name: string }[]
  }),
  getters: {
    favorites: (state) => state.photos.filter((p) => p.favorite),
    getByAlbum: (state) => {
      return (albumId: string) => state.photos.filter((p) => p.albumId === albumId)
    }
  },
  actions: {
    addPhoto(photo: Photo) {
      this.photos.push(photo)
    },
    removePhoto(photoId: string) {
      this.photos = this.photos.filter((p) => p.id !== photoId)
    },
    toggleFavorite(photoId: string) {
      const photo = this.photos.find((p) => p.id === photoId)
      if (photo) {
        photo.favorite = !photo.favorite
      }
    },
    createAlbum(name: string) {
      const id = Date.now().toString()
      this.albums.push({ id, name })
    },
    addPhotoToAlbum(photoId: string, albumId: string) {
      const photo = this.photos.find((p) => p.id === photoId)
      if (photo) {
        photo.albumId = albumId
      }
    }
  }
})
