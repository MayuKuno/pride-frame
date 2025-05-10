<template>
  <div class="text-h5 font-weight-bold mt-8">
    Share Your Creation
  </div>

  <p class="mb-4">
    Wanna share your frame with the world? Add it to the gallery and spread the pride! 🌟
  </p>

  <v-container class="py-10">
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
    <div class="mt-4 d-flex align-center justify-center">
      <v-combobox
        v-model="tags"
        multiple
        chips
        clearable
        :counter="5"
        :rules="[v => tags.length <= 5 || 'Maximum 5 tags allowed']"
        label="Tags (max 5)"
        placeholder="e.g. pride, rainbow"
        style="max-width: 620px;"
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

  <v-dialog v-model="showDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Upload Successful 🎉</v-card-title>
      <v-card-text>Do you want to go to the gallery page?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="showDialog = false">Stay</v-btn>
        <v-btn color="primary" text @click="goToGallery">Go</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps<{
  uploadedFrame: string | null
}>()

const title = ref('')
const errorMessage = ref('')
const showDialog = ref(false)
const tags = ref<string[]>([])

const canSubmit = computed(() =>
  title.value.trim() !== '' && tags.value.length <= 5
)

const submit = async () => {
  if (!canSubmit.value || !props.uploadedFrame) return

  try {
    const signRes = await fetch('https://c51j80zys3.execute-api.ap-northeast-1.amazonaws.com/generate-upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: `${uuidv4()}.png`,
        contentType: 'image/png',
      }),
    })
    const { uploadUrl, objectUrl } = await signRes.json()

    const blob = await (await fetch(props.uploadedFrame)).blob()

    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'image/png' },
      body: blob,
    })

    await fetch('https://c51j80zys3.execute-api.ap-northeast-1.amazonaws.com/add-gallery-item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.value.trim(),
        imageUrl: objectUrl,
        tags: tags.value,
      }),
    })

    showDialog.value = true

  } catch (error) {
    console.error(error)
    errorMessage.value = 'Failed to upload. Please try again later.'
  }
}

const goToGallery = () => {
  window.location.href = '/gallery'
}
</script>

<style scoped>
.v-card-title {
  justify-content: center;
}
</style>
