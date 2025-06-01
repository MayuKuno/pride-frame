<template>
  <v-container>
    <div class="text-h5 font-weight-bold mt-12">
      Share Your Creation
    </div>
    <p class="mt-4">
      Wanna share your frame with the world? Add it to the gallery and spread the pride! 🌟
    </p>
    <div class="py-8">
      <div v-if="uploadedFrameUrl" class="mb-4 text-center" style="display:flex; justify-content: center;">
        <div class="frame-preview-wrapper">
          <img
            :src="uploadedFrameUrl"
            alt="Uploaded Frame Preview"
            style="max-width: 100%; height: auto;"
          />
        </div>
      </div>
      <div v-else class="relative mx-auto mb-4 mt-6" :style="getFrameStyle">
        <canvas ref="previewCanvas" :width="320" :height="320" class="border d-block mx-auto" />
      </div>
      <div class="mt-4 d-flex align-center justify-center">
        <v-file-input
          v-model="file"
          style="max-width: 320px;"
          clearable
          prepend-icon=""
          prepend-inner-icon="mdi-camera"
          accept="image/png"
          label="Upload Transparent PNG Frame"
          variant="underlined"
          @click:clear="onFileClear"
        />
      </div>
      <div v-if="!isUploading">
        <div class="mt-4 d-flex align-center justify-center">
          <v-text-field
            v-model="title"
            style="max-width: 620px;"
            variant="underlined"
            label="Title of your pride frame"
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
            variant="underlined"
            style="max-width: 620px;"
            :items="suggestedTags"
          />
        </div>
        <div class="mt-4 d-flex align-center justify-center">
          <v-textarea v-model="message" label="Message to the LGBTQ+ community! (Optional)" variant="outlined" style="max-width: 620px;"></v-textarea>
        </div>
        <v-alert
          v-if="file"
          type="warning"
          border="start"
          variant="outlined"
          class="mt-6 mx-auto"
          style="max-width: 620px;"
          icon="mdi-alert-circle-outline"
        >
          This image will be published in the public galler.<br />
          Please make sure this is a frame only and not a personal photo.
        </v-alert>
        <v-btn
          :disabled="!canSubmit"
          color="primary"
          class="mt-6"
          @click="confirmDialog = true"
        >
          Share to Gallery
        </v-btn>
      </div>
      <div v-else class="text-center py-10">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="mt-4">Uploading your frame…</p>
      </div>
    </div>

    <v-dialog v-model="confirmDialog" max-width="580">
      <v-card elevation="12" class="rounded-x pa-3">
        <v-card-title class="text-h6 font-weight-bold justify-center">
          <v-icon class="mr-2" color="warning">mdi-alert-circle-outline</v-icon>
          Confirm Submission
        </v-card-title>
        <v-card-text class="text-body-1 mt-4 text-center">
          <p>
            This image will be published in the <strong>public gallery</strong>.<br />
            Please make sure this is a <strong class="text-error">frame only</strong> and not a personal photo.
          </p>
        </v-card-text>
        <v-card-actions class="justify-end mt-2">
          <v-btn
            variant="outlined"
            color="grey-darken-1"
            @click="confirmDialog = false"
            class="rounded-lg"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            class="rounded-lg ml-2"
            @click="handleConfirmedSubmit"
          >
            Yes, Share
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



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
    <BackToHome />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, CSSProperties, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import BackToHome from '@/components/common/BackToHome.vue'

const title = ref('')
const message = ref('')
const confirmDialog = ref(false)
const errorMessage = ref('')
const showDialog = ref(false)
const tags = ref<string[]>([])
const isUploading = ref(false)
const file = ref<File | null>(null)
const uploadedFrameUrl = ref<string | null>(null)

const suggestedTags = [
  'pride',
  'LGBTQ+',
  'trans',
  'lesbian',
  'gay',
  'ally',
  'nonbinary',
  'asexual',
  'queer',
  'bisexual',
  'lovewins'
]

const onFileClear = () => {
  file.value = null
  uploadedFrameUrl.value = null
}

const canSubmit = computed(() =>
  file.value !== null &&
  title.value.trim() !== '' &&
  tags.value.length <= 5
)
const submit = async () => {
  if (!canSubmit.value || !uploadedFrameUrl.value) return

  isUploading.value = true
  try {
    const signRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/generate-upload-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: `${uuidv4()}.png`,
        contentType: 'image/png',
      }),
    })

    const { uploadUrl, objectUrl } = await signRes.json()
    const blob = await (await fetch(uploadedFrameUrl.value)).blob()

    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'image/png' },
      body: blob,
    })
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/add-gallery-item`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.value.trim(),
        imageUrl: objectUrl,
        tags: tags.value,
        message: message.value,
      }),
    })

    showDialog.value = true

  } catch (error) {
    console.error(error)
    errorMessage.value = 'Failed to upload. Please try again later.'
  } finally {
    isUploading.value = false
  }
}

watch(file, async (newFile) => {
  if (newFile) {
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedFrameUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(newFile)
  }
})
const getFrameStyle = computed(() => ({
  width: `320px`,
  height: `320px`,
  backgroundColor: '#efece8ff',
  borderRadius: '9999px',
  overflow: 'hidden',
  position: 'relative',
} as CSSProperties))

const handleConfirmedSubmit = async () => {
  confirmDialog.value = false
  await submit()
}

const goToGallery = () => {
  window.location.href = '/gallery'
}
</script>

<style scoped>
.v-card-title {
  justify-content: center;
}
.frame-preview-wrapper {
  background-color: #eaeaea;
}
</style>
