<template>
  <v-stepper v-model="step" :items="stepItems" show-actions class="pa-6">
    <!-- Step 1: Choose Size -->
    <template v-slot:item.1>
      <v-radio-group v-model="selectedSize" class="mt-4">
        <v-label class="mb-2">Select a platform size</v-label>
        <v-radio value="instagram" label="Instagram (1080x1080)" class="text-black" />
        <v-radio value="twitter" label="Twitter (400x400)" class="text-black" />
        <v-radio value="linkedin" label="LinkedIn (400x400)" class="text-black" />
        <v-radio value="custom" label="Custom (600x600)" class="text-black" />
      </v-radio-group>
    </template>

    <!-- Step 2: Upload & Adjust Photo -->
    <template v-slot:item.2>
      <div class="relative mx-auto overflow-hidden" :style="previewStyle">
        <Cropper
          v-if="uploadedImage"
          :src="uploadedImage"
          :canvasSize="canvasSize"
          @ready="onCropperReady"
          @crop="refreshPreviewAfterCrop"
        />
        <img
          v-if="selectedFrame && showFrame"
          :src="selectedFrame"
          class="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
          alt="frame overlay"
        />
      </div>

      <input type="file" accept="image/*" @change="onFileChange" class="mt-4" />
      <div class="mt-4 d-flex align-center">
        <v-icon start icon="mdi-shield-check" class="me-2 text-primary" />
        Don’t worry — your photo never leaves your device. Nothing is uploaded to any server.
      </div>
    </template>

    <!-- Step 3: Select Frame -->
    <template v-slot:item.3>
      <div class="relative mx-auto mb-4" :style="previewStyle">
        <canvas ref="previewCanvas" :width="canvasSize.width" :height="canvasSize.height" class="border d-block mx-auto" />
      </div>
      <FrameSelector :selected="selectedFrame" @select="onSelectFrame" />
    </template>

    <!-- Step 4: Preview & Download -->
    <template v-slot:item.4>
      <canvas ref="canvas" :width="canvasSize.width" :height="canvasSize.height" class="border mb-4 d-block mx-auto" />
      <div class="d-flex justify-center">
        <v-btn color="primary" class="ml-2" @click="downloadImage">Download</v-btn>
      </div>
    </template>
  </v-stepper>

  <div class="text-center mt-4">
    <v-btn color="grey" @click="goHome">
      <v-icon start icon="mdi-arrow-left" /> Back to Home
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import FrameSelector from '@/components/common/FrameSelector.vue'
import { useRouter } from 'vue-router'
import Cropper from '@/components/common/Cropper.vue'
import 'cropperjs/dist/cropper.css'

const router = useRouter()
const step = ref(1)
const stepItems = ['Choose Size', 'Upload & Adjust Photo', 'Select Frame', 'Download']
const selectedSize = ref<'instagram' | 'twitter' | 'linkedin' | 'custom'>('instagram')
const uploadedImage = ref<string | null>(null)
const selectedFrame = ref<string | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const previewCanvas = ref<HTMLCanvasElement | null>(null)
const cropper = ref<any>(null)
const showFrame = ref(true)
const croppedImageDataUrl = ref<string | null>(null)

const canvasSize = computed(() => {
  switch (selectedSize.value) {
    case 'instagram': return { width: 1080, height: 1080 }
    case 'twitter':
    case 'linkedin': return { width: 400, height: 400 }
    case 'custom': return { width: 600, height: 600 }
  }
})

const previewStyle = computed(() => ({
  width: canvasSize.value.width + 'px',
  height: canvasSize.value.height + 'px',
  position: 'relative',
  overflow: 'hidden'
}))

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    uploadedImage.value = URL.createObjectURL(file)
  }
}

function onSelectFrame(url: string) {
  selectedFrame.value = url
  if (step.value === 3) {
    updatePreviewCanvasFromSavedImage()
  }
}

function onCropperReady(cropperInstance: any) {
  cropper.value = cropperInstance
  saveCroppedImage()  // 初期表示時にも1回保存
}


function updatePreviewCanvasFromSavedImage() {
  if (!previewCanvas.value || !croppedImageDataUrl.value) return
  const ctx = previewCanvas.value.getContext('2d')
  if (!ctx) return
  const image = new Image()
  image.onload = () => {
    ctx.clearRect(0, 0, canvasSize.value.width, canvasSize.value.height)
    ctx.drawImage(image, 0, 0, canvasSize.value.width, canvasSize.value.height)
    if (selectedFrame.value) {
      const frame = new Image()
      frame.onload = () => {
        ctx.drawImage(frame, 0, 0, canvasSize.value.width, canvasSize.value.height)
      }
      frame.src = selectedFrame.value
    }
  }
  image.src = croppedImageDataUrl.value
}

function refreshPreviewAfterCrop() {
  saveCroppedImage().then(() => {
    nextTick(() => updatePreviewCanvasFromSavedImage())
  })
}

function drawCanvas() {
  if (!canvas.value || !cropper.value) return
  const croppedCanvas = cropper.value.getCroppedCanvas({
    width: canvasSize.value.width,
    height: canvasSize.value.height,
    imageSmoothingQuality: 'high'
  })
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return
  const image = new Image()
  image.onload = () => {
    ctx.clearRect(0, 0, canvasSize.value.width, canvasSize.value.height)
    ctx.drawImage(image, 0, 0, canvasSize.value.width, canvasSize.value.height)
    if (selectedFrame.value) {
      const frame = new Image()
      frame.onload = () => {
        ctx.drawImage(frame, 0, 0, canvasSize.value.width, canvasSize.value.height)
      }
      frame.src = selectedFrame.value
    }
  }
  image.src = croppedCanvas.toDataURL()
}

async function saveCroppedImage(): Promise<string | null> {
  if (!cropper.value) return null
  const croppedCanvas = cropper.value.getCroppedCanvas({
    width: canvasSize.value.width,
    height: canvasSize.value.height,
    imageSmoothingQuality: 'high'
  })
  const dataUrl = croppedCanvas.toDataURL()
  croppedImageDataUrl.value = dataUrl
  return dataUrl
}

watch(step, async (newVal) => {
  if (newVal === 3) {
    if (cropper.value) {
      await saveCroppedImage()  // ←ここで最新の状態を保存
    }
    await nextTick()
    updatePreviewCanvasFromSavedImage()
  } else if (newVal === 4) {
    await nextTick()
    drawCanvas()
  }
})


watch(uploadedImage, () => {
  nextTick(() => {
    if (step.value === 2 && cropper.value) {
      saveCroppedImage()
    }
  })
})

function downloadImage() {
  if (!canvas.value) return
  canvas.value.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pride-frame.png'
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.previewCanvas {
  width: 100%;
}
</style>
