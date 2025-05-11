<template>
  <div class="mt-4">
    <div class="relative mx-auto mb-4 mt-12" :style="getFrameStyle">
      <canvas ref="previewCanvas" :width="canvasSize.width" :height="canvasSize.height" class="border d-block mx-auto" />
    </div>
    <div class="mt-4 d-flex align-center justify-center">
      <v-file-input
        :model-value="selectedFile"
        @update:model-value="onFileInputChange"
        style="max-width: 620px;"
        clearable
        prepend-icon=""
        prepend-inner-icon="mdi-camera"
        accept="image/*"
        label="Upload Your Custom Frame"
        variant="underlined"
        @click:clear="onFileClear"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, CSSProperties } from 'vue'

const props = defineProps<{
  canvasSize: { width: number; height: number; shape: string }
  image: string | null
}>()

const emit = defineEmits<{
  (e: 'croppedImageWithFrame', dataUrl: string): void
  (e: 'uploadedFrame', dataUrl: string): void
}>()

const selectedFile = ref<File | null>(null)
const uploadedImage = ref<string | null>(null)
const previewCanvas = ref<HTMLCanvasElement | null>(null)

function onFileClear() {
  selectedFile.value = null
  uploadedImage.value = null
}

async function onFileInputChange(file: File | null) {
  selectedFile.value = file

  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      const imageUrl = e.target?.result as string

      const img = new Image()
      img.onload = () => {
        const width = img.width
        const height = img.height

        if (width !== props.canvasSize.width || height !== props.canvasSize.height) {
          alert(`The image you uploaded is ${width}x${height}, but the required size is ${props.canvasSize.width}x${props.canvasSize.height}. Please upload an image matching the selected size.`)
          selectedFile.value = null
          uploadedImage.value = null
          updateCanvas()
          return
        }

        uploadedImage.value = imageUrl
        updateCanvas()
      }
      img.src = imageUrl
    }
    reader.readAsDataURL(file)
  } else {
    uploadedImage.value = null
    updateCanvas()
  }
}

function updateCanvas() {
  const canvas = previewCanvas.value
  if (!canvas || !props.image) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = props.canvasSize.width
  canvas.height = props.canvasSize.height

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const baseImg = new Image()
  baseImg.crossOrigin = 'anonymous'
  baseImg.onload = () => {
    ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height)

    if (uploadedImage.value) {
      const frameImg = new Image()
      frameImg.onload = () => {
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height)

        const combinedDataUrl = canvas.toDataURL('image/png')
        emit('croppedImageWithFrame', combinedDataUrl)

        const frameOnlyCanvas = document.createElement('canvas')
        frameOnlyCanvas.width = canvas.width
        frameOnlyCanvas.height = canvas.height
        const frameOnlyCtx = frameOnlyCanvas.getContext('2d')
        if (frameOnlyCtx) {
          frameOnlyCtx.drawImage(frameImg, 0, 0, canvas.width, canvas.height)
          const frameOnlyDataUrl = frameOnlyCanvas.toDataURL('image/png')
          emit('uploadedFrame', frameOnlyDataUrl)
        }
      }
      frameImg.src = uploadedImage.value
    } else {
      const combinedDataUrl = canvas.toDataURL('image/png')
      emit('croppedImageWithFrame', combinedDataUrl)
    }
  }
  baseImg.src = props.image
}

function preloadBaseImage() {
  if (props.image) {
    updateCanvas()
  }
}

watch(() => props.image, preloadBaseImage)
onMounted(preloadBaseImage)

const getFrameStyle = computed(() => ({
  width: `${props.canvasSize.width}px`,
  height: `${props.canvasSize.height}px`,
  backgroundColor: '#efece8ff',
  borderRadius: props.canvasSize.shape === 'round' ? '9999px' : '0px',
  overflow: 'hidden',
  position: 'relative',
} as CSSProperties))

</script>

<style scoped>

</style>
