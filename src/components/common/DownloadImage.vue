<template>
  <div class="relative mx-auto mb-4 mt-12" :style="getFrameStyle">
    <canvas ref="previewCanvas" :width="canvasSize.width" :height="canvasSize.height" class="border d-block mx-auto" />
  </div>
  <div class="d-flex justify-center">
    <v-btn color="primary" variant="tonal" class="ml-2 mt-8" @click="downloadImage">Download</v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, CSSProperties } from 'vue'
import { useGtag } from 'vue-gtag-next'
const { event } = useGtag()

const props = defineProps<{
  canvasSize: { width: number; height: number; shape: string }
  croppedImageWithFrame: string | null
}>()
const previewCanvas = ref<HTMLCanvasElement | null>(null)

function downloadImage() {
  const canvas = previewCanvas.value
  if (!canvas) return

  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = 'prideframed.png'
  link.click()

  event('download', {
    event_category: 'interaction',
    event_label: 'prideframed.png',
  })
}

const getFrameStyle = computed(() => ({
  width: `${props.canvasSize.width}px`,
  height: `${props.canvasSize.height}px`,
  backgroundColor: '#efece8ff',
  borderRadius: props.canvasSize.shape === 'round' ? '9999px' : '0px',
  overflow: 'hidden',
  position: 'relative',
} as CSSProperties))

function updateCanvas() {
  const canvas = previewCanvas.value
  if (!canvas || !props.croppedImageWithFrame) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = props.canvasSize.width
  canvas.height = props.canvasSize.height

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const baseImg = new Image()
  baseImg.crossOrigin = 'anonymous'
  baseImg.onload = () => {
    ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height)
  }
  baseImg.src = props.croppedImageWithFrame
}

watch(() => props.croppedImageWithFrame, updateCanvas)
onMounted(updateCanvas)

</script>

<style scoped>

</style>
