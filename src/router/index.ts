import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import CreateStart from '@/views/CreateStart.vue'
import CreateDefault from '@/views/CreateDefault.vue'
import CreateCustom from '@/views/CreateCustom.vue'
import UploadCustom from '@/views/UploadCustom.vue'
import Gallery from '@/views/Gallery.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/create', component: CreateStart },
  { path: '/create/default', component: CreateDefault },
  { path: '/create/custom', component: CreateCustom },
  { path: '/create/custom/upload', component: UploadCustom },
  { path: '/gallery', component: Gallery },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
