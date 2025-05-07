<template>
  <div class="text-h5 font-weight-bold mt-8">
    Share Your Creation
  </div>

  <p class="mb-4">
    Wanna share your frame with the world? Add it to the gallery and spread the pride! 🌟
  </p>

  <v-container class="py-10">
    <!-- uploadedFrame を直接表示 -->
    <div v-if="props.uploadedFrame" class="mb-4 text-center">
      <img
        :src="props.uploadedFrame"
        alt="Uploaded Frame Preview"
        style="max-width: 100%; height: auto;"
      />
    </div>
    <div class="mt-4 d-flex align-center justify-center">

      <v-text-field
        v-model="title"
        style="max-width: 620px;"
        variant="underlined"
        label="Title of your work"
        placeholder="e.g. Love is Love"
        required
      />
    </div>

    <v-btn
      :disabled="!canSubmit"
      color="primary"
      class="mt-6"
      @click="submit"
    >
      Share to Gallery
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  uploadedFrame: string | null
}>()

const finalImage = defineModel<string>('finalImage')

const title = ref('')
const nickname = ref('')
const errorMessage = ref('')

const canSubmit = computed(() =>
  title.value.trim() !== ''
)

const submit = async () => {
  if (!canSubmit.value) return

  try {
    await uploadToGallery({
      image: finalImage.value,
      title: title.value.trim(),
      nickname: nickname.value.trim() || 'Anonymous',
    })

    window.location.href = '/gallery'
  } catch (error) {
    errorMessage.value = 'Failed to upload. Please try again later.'
  }
}

async function uploadToGallery(data: {
  image: string
  title: string
  nickname: string
}) {
}
</script>

<style scoped>
.v-card-title {
  justify-content: center;
}
</style>
