<template>
  <div :style="wrapperStyle" class="relative overflow-hidden">
    <img
      ref="image"
      :src="src"
      :style="{ width: canvasSize.width + 'px', height: canvasSize.height + 'px' }"
      alt="croppable"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, watch, nextTick } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const props = defineProps<{
  src: string
  canvasSize: { width: number; height: number }
  cropShape?: 'round' | 'square'
}>()

const emits = defineEmits<{
  (e: 'ready', cropper: Cropper): void
  (e: 'crop', croppedDataUrl: string): void
}>()

const image = ref<HTMLImageElement | null>(null)
let cropper: Cropper | null = null

const wrapperStyle = computed(() => ({
  width: `${props.canvasSize.width}px`,
  height: `${props.canvasSize.height}px`,
  borderRadius: props.cropShape === 'round' ? '50%' : '0',
  overflow: 'hidden',
  backgroundColor: '#e0e0e0',
}))

const createCropper = () => {
  if (!image.value) return

  cropper = new Cropper(image.value, {
    aspectRatio: props.canvasSize.width / props.canvasSize.height,
    viewMode: 1,
    autoCrop: false,
    dragMode: 'move',
    movable: true,
    zoomable: true,
    scalable: false,
    rotatable: false,
    background: false,
    guides: false,
    highlight: false,
    cropBoxMovable: false,
    cropBoxResizable: false,
    ready: handleReady,
    crop: handleCrop,
    zoom: handleZoom,
  })
}

function initializeCropper() {
  cropper?.destroy()
  cropper = null
  nextTick(() => createCropper())
}

function handleReady() {
  if (!cropper) return

  applyCropShape()

  const containerData = cropper.getContainerData()
  const imageData = cropper.getImageData()
  const scale = Math.max(
    props.canvasSize.width / imageData.naturalWidth,
    props.canvasSize.height / imageData.naturalHeight
  )

  cropper.zoomTo(scale)
  cropper.crop()

  cropper.setCropBoxData({
    width: props.canvasSize.width,
    height: props.canvasSize.height,
    left: (containerData.width - props.canvasSize.width) / 2,
    top: (containerData.height - props.canvasSize.height) / 2,
  })

  const cropBoxData = cropper.getCropBoxData()
  cropper.setCanvasData({
    ...cropper.getCanvasData(),
    width: cropBoxData.width,
    height: cropBoxData.height,
    left: cropBoxData.left,
    top: cropBoxData.top,
  })

  emits('ready', cropper)
}

function handleCrop() {
  if (!cropper) return

  const croppedCanvas = cropper.getCroppedCanvas({
    width: props.canvasSize.width,
    height: props.canvasSize.height,
    imageSmoothingQuality: 'high',
    fillColor: 'transparent',
  })

  const finalCanvas = props.cropShape === 'round' ? createRoundCanvas(croppedCanvas) : croppedCanvas
  emits('crop', finalCanvas.toDataURL('image/png'))
}

function handleZoom() {
  // 本番ではログなし！必要ならemitイベント飛ばす
  // console.log('zoomed')
}

function createRoundCanvas(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const size = Math.min(sourceCanvas.width, sourceCanvas.height)
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = size
  tempCanvas.height = size

  const ctx = tempCanvas.getContext('2d')
  if (!ctx) throw new Error('Failed to get 2D context for round cropping')

  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()

  ctx.drawImage(sourceCanvas, 0, 0, size, size)

  return tempCanvas
}

function applyCropShape() {
  const viewBox = image.value?.parentElement?.querySelector('.cropper-view-box') as HTMLElement | null
  if (viewBox) {
    viewBox.classList.toggle('round-view-box', props.cropShape === 'round')
  }
}

onMounted(initializeCropper)

watch(() => props.src, (newSrc, oldSrc) => {
  if (newSrc && newSrc !== oldSrc) {
    initializeCropper()
  }
})

watch(() => props.cropShape, applyCropShape)

onBeforeUnmount(() => {
  cropper?.destroy()
  cropper = null
})
</script>

<style scoped>
::v-deep(.cropper-view-box) {
  border-radius: 0;
  transition: border-radius 0.3s;
}

::v-deep(.cropper-view-box.round-view-box) {
  border-radius: 50% !important;
}
</style>
