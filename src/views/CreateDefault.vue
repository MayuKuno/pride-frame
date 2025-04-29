<template>
  <v-stepper v-model="step" :items="stepItems" show-actions class="pa-6 min-h-screen flex flex-col stepper">
    <template v-slot:item.1>
      <ChooseSize
        v-model:selectedSize="selectedSize"
        v-model:customWidth="customWidth"
        v-model:customHeight="customHeight"
        v-model:customShape="customShape"
        :sizeOptions="sizeOptions"
      />
    </template>

    <template v-slot:item.2>
      <UploadPhoto
        v-model:uploadedImage="uploadedImage"
        v-model:selectedFile="selectedFile"
        :canvasSize="canvasSize"
        :shapeClass="shapeClass"
        :frameStyle="frameStyle"
        @crop="refreshPreviewAfterCrop"
        @cropperReady="onCropperReady"
      />
    </template>

    <template v-slot:item.3>
      <div class="relative mx-auto mb-4" :style="frameStyle">
        <canvas ref="previewCanvas" :width="canvasSize.width" :height="canvasSize.height" class="border d-block mx-auto" />
      </div>
      <FrameSelector :selected="selectedFrame" @select="onSelectFrame" />
    </template>

    <template v-slot:item.4>
      <canvas ref="canvas" :style="frameStyle" class="border mb-4 d-block mx-auto" />
      <div class="d-flex justify-center">
        <v-btn color="primary" class="ml-2" @click="downloadImage">Download</v-btn>
      </div>
    </template>

    <template v-slot:actions>
      <div class="actions">
        <v-btn variant="text" class="back" @click="step--" v-if="step > 1">Back</v-btn>
        <div class="backToHome text-center mt-4">
          <v-btn variant="text" @click="goHome">
            <v-icon start icon="mdi-home" /> Back to Home
          </v-btn>
        </div>
        <v-btn variant="text" color="primary" class="next" @click="step++" v-if="step < stepItems.length">Next</v-btn>
      </div>
    </template>
  </v-stepper>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import ChooseSize from '@/components/common/ChooseSize.vue'
import UploadPhoto from '@/components/common/UploadPhoto.vue'
import FrameSelector from '@/components/common/FrameSelector.vue'
import 'cropperjs/dist/cropper.css'

const router = useRouter()
const step = ref(1)
const stepItems = ['Choose Size', 'Upload & Adjust Photo', 'Select Frame', 'Download']

const selectedSize = ref<'instagram' | 'linkedin' | 'line' | 'slack' | 'custom'>('instagram')
const customWidth = ref(600)
const customHeight = ref(600)
const customShape = ref<'round' | 'square'>('round')

const selectedFile = ref<File | null>(null)
const uploadedImage = ref<string | null>(null)
const croppedImage = ref<string | null>(null)
const selectedFrame = ref<string | null>(null)

const previewCanvas = ref<HTMLCanvasElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const cropper = ref<any>(null)
const croppedCanvas = ref<HTMLCanvasElement | null>(null)

const sizeOptions = [
  { value: 'instagram', label: 'Instagram', size: '(320x320)', color: '#d62976', icon: '/icons/instagram.png' },
  { value: 'linkedin', label: 'LinkedIn', size: '(400x400)', color: '#0077B5', icon: '/icons/linkedin.png' },
  { value: 'line', label: 'LINE', size: '(640x640)', color: '#00C300', icon: '/icons/line.png' },
  { value: 'slack', label: 'Slack', size: '(512x512)', color: '#611f69', icon: '/icons/slack.png' },
]

const canvasSize = computed(() => {
  if (selectedSize.value === 'custom') {
    return { width: customWidth.value, height: customHeight.value, shape: customShape.value }
  }
  const presets: Record<string, { width: number; height: number; shape: 'round' | 'square' }> = {
    instagram: { width: 320, height: 320, shape: 'round' },
    linkedin: { width: 400, height: 400, shape: 'round' },
    line: { width: 640, height: 640, shape: 'round' },
    slack: { width: 512, height: 512, shape: 'square' },
  }
  return presets[selectedSize.value]
})

const frameStyle = computed(() => ({
  width: `${canvasSize.value.width}px`,
  height: `${canvasSize.value.height}px`,
  backgroundColor: '#efece8ff',
  borderRadius: canvasSize.value.shape === 'round' ? '9999px' : '0px',
  overflow: 'hidden',
  position: 'relative',
}))

const shapeClass = computed(() => ({
  'rounded-full': canvasSize.value.shape === 'round',
  'rounded-none': canvasSize.value.shape === 'square',
}))

function clearFile() {
  uploadedImage.value = null
  selectedFile.value = null
}

function updateCanvas(targetCanvas: HTMLCanvasElement | null) {
  if (!targetCanvas || !croppedCanvas.value) return
  const ctx = targetCanvas.getContext('2d')
  if (!ctx) return

  targetCanvas.width = croppedCanvas.value.width
  targetCanvas.height = croppedCanvas.value.height

  ctx.clearRect(0, 0, croppedCanvas.value.width, croppedCanvas.value.height)
  ctx.drawImage(croppedCanvas.value, 0, 0)

  if (selectedFrame.value) {
    const frame = new Image()
    frame.onload = () => ctx.drawImage(frame, 0, 0, croppedCanvas.value!.width, croppedCanvas.value!.height)
    frame.src = selectedFrame.value
  }
}

async function saveCroppedImage() {
  if (!cropper.value) return

  const cropped = cropper.value.getCroppedCanvas({ imageSmoothingQuality: 'high' })
  const resizedCanvas = document.createElement('canvas')
  resizedCanvas.width = canvasSize.value.width
  resizedCanvas.height = canvasSize.value.height

  const ctx = resizedCanvas.getContext('2d')
  if (!ctx) return

  ctx.drawImage(cropped, 0, 0, resizedCanvas.width, resizedCanvas.height)

  if (canvasSize.value.shape === 'round') {
    const size = Math.min(resizedCanvas.width, resizedCanvas.height)
    const circleCanvas = document.createElement('canvas')
    circleCanvas.width = size
    circleCanvas.height = size

    const circleCtx = circleCanvas.getContext('2d')
    if (!circleCtx) return

    circleCtx.beginPath()
    circleCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    circleCtx.closePath()
    circleCtx.clip()
    circleCtx.drawImage(resizedCanvas, 0, 0, size, size)

    croppedCanvas.value = circleCanvas
  } else {
    croppedCanvas.value = resizedCanvas
  }
}

function refreshPreviewAfterCrop() {
  saveCroppedImage().then(() => nextTick(() => updateCanvas(previewCanvas.value)))
}

function onCropperReady(cropperInstance: any) {
  cropper.value = cropperInstance
  saveCroppedImage()
}

function onSelectFrame(url: string) {
  selectedFrame.value = url
  if (step.value === 3) {
    updateCanvas(previewCanvas.value)
  }
}

function downloadImage() {
  if (!canvas.value || !croppedCanvas.value) return
  canvas.value.toBlob(blob => {
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

watch(step, async (newVal, oldVal) => {
  if (oldVal === 2 && newVal === 1) clearFile()
  if (oldVal === 2 && newVal === 3) await nextTick(() => updateCanvas(previewCanvas.value))
  if (newVal === 4) await nextTick(() => updateCanvas(canvas.value))
})

watch(uploadedImage, async () => {
  if (step.value === 2 && cropper.value) {
    await saveCroppedImage()
  }
})

watch(selectedFile, file => {
  uploadedImage.value = file ? URL.createObjectURL(file) : null
})
</script>

<style scoped>
.stepper {
  height: 100vh;
  background-color: #f5f5f5;
}

:deep(.v-window-item) {
  min-height: 540px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

:deep(.v-stepper-header) {
  box-shadow: none;
}

.actions {
  display: flex;
  position: relative;
}

.backToHome {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.back {
  position: absolute;
  left: 0;
}

.next {
  position: absolute;
  right: 0;
}
</style>
