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
  canvasSize: { width: number; height: number, shape: string }
  shape: 'round' | 'square'
}>()

const emits = defineEmits<{
  (e: 'crop', croppedDataUrl: string): void
}>()

const image = ref<HTMLImageElement | null>(null)
let cropper: Cropper | null = null

// const wrapperStyle = computed(() => ({
//   width: `${props.canvasSize.width}px`,
//   height: `${props.canvasSize.height}px`,
//   borderRadius: props.shape === 'round' ? '50%' : '0',
//   overflow: 'hidden',
//   backgroundColor: '#e0e0e0',
// }))

const wrapperStyle = computed(() => ({
  width: '100%',
  maxWidth: '360px',
  aspectRatio: '1 / 1',
  borderRadius: props.shape === 'round' ? '50%' : '0',
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
    guides: true,
    highlight: true,
    cropBoxMovable: false,
    cropBoxResizable: false,
    ready: handleReady,
    crop: handleCrop,
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
  handleCrop()
}

function handleCrop() {
  if (!cropper) return

  const croppedCanvas = cropper.getCroppedCanvas({
    width: props.canvasSize.width,
    height: props.canvasSize.height,
    imageSmoothingQuality: 'high',
    fillColor: 'transparent',
  })
  if (croppedCanvas.width === 0 || croppedCanvas.height === 0) {
    console.warn('Cropped canvas has zero size, skipping emit')
    return
  }
  const finalCanvas = props.shape === 'round' ? createRoundCanvas(croppedCanvas) : croppedCanvas

  emits('crop', finalCanvas.toDataURL('image/png'))
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
    viewBox.classList.toggle('round-view-box', props.shape === 'round')
  }
}

onMounted(initializeCropper)

onBeforeUnmount(() => {
  cropper?.destroy()
  cropper = null
})

watch(() => props.src, (newSrc, oldSrc) => {
  if (newSrc && newSrc !== oldSrc) {
    initializeCropper()
  }
})

watch(() => props.shape, () => {
  applyCropShape()
  handleCrop()
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
