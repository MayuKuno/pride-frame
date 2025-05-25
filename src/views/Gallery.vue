<template>
  <v-container fluid class="py-16">
    <v-container class="text-center">
      <h1 class="mb-4">
        <span class="rainbow">Pride Frame</span> Gallery
      </h1>
      <p class="text-subtitle-1 text-grey-darken-1 mb-8">
        Explore amazing Pride frame creations shared by the community.
      </p>
      <v-container v-if="loading" class="text-center py-16">
        <v-progress-circular color="blue-lighten-3" indeterminate size="128" :width="8"></v-progress-circular>
      </v-container>
      <v-container v-else>
        <!-- Tag Filter Area -->
        <v-row justify="center" class="mb-6">
          <v-chip
            class="ma-1"
            :color="selectedTag === '' ? 'primary' : 'grey lighten-2'"
            text-color="white"
            small
            @click="clearTagFilter"
          >
            Show All
          </v-chip>
          <v-chip
            v-for="tag in allTags"
            :key="tag"
            class="ma-1"
            :color="selectedTag === tag ? 'primary' : 'grey lighten-2'"
            text-color="white"
            small
            @click="selectTag(tag)"
          >
            #{{ tag }}
          </v-chip>
        </v-row>

        <!-- Gallery Grid -->
        <v-row dense>
          <v-col
            v-for="(frame, index) in filteredFrames"
            :key="index"
            cols="6"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card elevation="4">
              <v-img
                :src="frame.imageUrl"
                aspect-ratio="1"
                alt="Pride frame"
                class="clickable-image"
                 @click="goToDetail(frame.id)"
              ></v-img>

              <v-card-title class="mt-2 justify-center text-subtitle-1 font-weight-medium">
                {{ frame.title }}
              </v-card-title>

              <v-card-actions class="justify-center flex-wrap">
                <v-chip
                  v-for="tag in frame.tags"
                  :key="tag"
                  size="x-small"
                  class="ma-1"
                  text-color="white"
                >
                  #{{ tag }}
                </v-chip>
              </v-card-actions>

              <v-card-actions class="justify-center">
                <v-btn
                  class="mt-2 mb-2"
                  size="small"
                  variant="tonal"
                  color="#ed9b18"
                  @click="useThisFrame(frame)"
                >
                  Use This Frame
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
    <BackToHome />
  </v-container>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BackToHome from '@/components/common/BackToHome.vue'

const router = useRouter()
const frames = reactive<any[]>([])
const selectedTag = ref('')
const allTags = ref<string[]>([])

const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/list-gallery-items`)
    const data = await res.json()
    frames.splice(0, frames.length, ...data)
    allTags.value = [...new Set(
      data.flatMap((f: any) => f.tags as string[])
    )] as string[]
  } catch (err) {
    console.error('Failed to fetch gallery items', err)
  } finally {
    loading.value = false
  }
})


function selectTag(tag: string) {
  selectedTag.value = tag
}

function clearTagFilter() {
  selectedTag.value = ''
}

const filteredFrames = computed(() =>
  frames.filter(f =>
    selectedTag.value === '' || f.tags.includes(selectedTag.value)
  )
)

function goToDetail(id: string) {
  router.push(`/gallery/${id}`)
}

function useThisFrame(frame: any) {
  router.push({
    path: '/create',
    query: {
      frameId: frame.id,
    }
  })
}
</script>

<style scoped>
.rainbow {
  background: linear-gradient(90deg, #d8151c, #ed9b18, #d7c700, #52a8dd, #995292);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
:deep(.v-card-actions) {
  gap:0;
  padding:0;
  min-height: 0px;
}
.clickable-image {
  cursor: pointer;
}
</style>
