<template>
  <v-container>
    <v-row justify="start" class="mt-4">
      <v-btn to="/gallery" variant="plain">
        <v-icon start icon="mdi-arrow-left-circle" /> Back to Gallery
      </v-btn>
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
          color="primary"
          text-color="white"
        >
          #{{ tag }}
        </v-chip>
      </v-row>
      <div class="text-center mt-4 mb-8">
        <v-icon color="pink" class="mr-1">mdi-heart</v-icon>
        <span class="text-subtitle-2">{{ frame.likes }} likes</span>
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
import BackToHome from '@/components/common/BackToHome.vue'

const route = useRoute()
const frame = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    console.log(route.params.id)
    const res = await fetch(`https://c51j80zys3.execute-api.ap-northeast-1.amazonaws.com/get-gallery-item/${route.params.id}`)
    if (res.ok) {
      console.log(res)

      frame.value = await res.json()
    }
  } catch (err) {
    console.error('Failed to fetch item', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
h2 {
  font-weight: 600;
}
</style>
