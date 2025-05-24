<template>
  <v-container>
    <v-row class="mt-4" justify="space-between" align="center">
      <v-col cols="auto">
        <v-btn to="/gallery" variant="plain">
          <v-icon start icon="mdi-arrow-left-circle" /> Back to Gallery
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          variant="outlined"
          color="red"
          size="x-small"
          :href="`https://forms.gle/PduwRtu1udHDCFTZ6`"
          target="_blank"
        >
          Request Deletion
        </v-btn>
      </v-col>
    </v-row>

    <div v-if="loading" class="text-center py-16">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <div v-else-if="frame">
      <v-container class="d-flex justify-center mt-8">
        <v-img
          :src="frame.imageUrl"
          aspect-ratio="1"
          max-width="400"
        />
      </v-container>
      <h2 class="mb-8 text-center">{{ frame.title }}</h2>
      <v-row class="justify-center mb-2">
        <v-chip
          v-for="tag in frame.tags"
          :key="tag"
          class="ma-1"
          text-color="white"
        >
          #{{ tag }}
        </v-chip>
      </v-row>

      <div
        v-if="frame.message?.trim()"
        class="pride-message-box"
      >
        <div class="message-header d-flex align-center mb-3">
          <span class="rainbow-text text-subtitle-1 font-weight-bold">
            Message from the Creator
          </span>
        </div>
        <p class="text-body-1 text-gray-800" style="white-space: pre-wrap;">
          {{ frame.message }}
        </p>
      </div>

      <div class="text-center mt-4 mb-8">
        <v-btn
          class="mt-2 mb-2"
          size="small"
          color="#ed9b18"
          variant="tonal"
          @click="useThisFrame(frame)"
        >
          Use This Frame
        </v-btn>
      </div>
    </div>

    <div v-else>
      <p class="text-center">Item not found.</p>
    </div>
    <BackToHome />
  </v-container>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import BackToHome from '@/components/common/BackToHome.vue'

const router = useRouter()
const route = useRoute()
const frame = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/get-gallery-item/${route.params.id}`)

    if (res.ok) {
      frame.value = await res.json()
    }
  } catch (err) {
    console.error('Failed to fetch item', err)
  } finally {
    loading.value = false
  }
})

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
h2 {
  font-weight: 600;
}

.pride-message-box {
  max-width: 640px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 12px;
  border: 1px solid;
  border-image: linear-gradient(90deg, #d8151c, #ed9b18, #d7c700, #52a8dd, #995292) 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.rainbow-text {
  background: linear-gradient(90deg, #d8151c, #ed9b18, #d7c700, #52a8dd, #995292);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

</style>
