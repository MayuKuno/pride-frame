import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Create from '@/views/Create.vue'
import CreateDefault from '@/views/CreateDefault.vue'
import CreateCustom from '@/views/CreateCustom.vue'
import Gallery from '@/views/Gallery.vue'
import GalleryDetail from '@/views/GalleryDetail.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/create', component: Create },
  { path: '/create/default', component: CreateDefault },
  { path: '/create/custom', component: CreateCustom },
  { path: '/gallery', component: Gallery },
  { path: '/gallery/:id', component: GalleryDetail },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
