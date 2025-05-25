import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import CreatePrideFrame from '@/views/CreatePrideFrame.vue'
import SharePrideFrame from '@/views/SharePrideFrame.vue'
import Gallery from '@/views/Gallery.vue'
import GalleryDetail from '@/views/GalleryDetail.vue'
import NotFound from '@/views/NotFound.vue'
import Privacy from '@/views/Privacy.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/create', component: CreatePrideFrame },
  { path: '/share', component: SharePrideFrame },
  { path: '/gallery', component: Gallery },
  { path: '/gallery/:id', component: GalleryDetail },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  { path: '/privacy', name: 'Privacy', component: Privacy },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
