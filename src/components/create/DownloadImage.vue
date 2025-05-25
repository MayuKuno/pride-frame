<template>
  <div class="relative mx-auto mb-4 mt-12" :style="getFrameStyle">
    <canvas
      ref="previewCanvas"
      :width="canvasSize.width"
      :height="canvasSize.height"
      class="preview-canvas border d-block mx-auto"
    />
  </div>

  <div class="d-flex justify-center">
    <v-btn color="primary" variant="tonal" class="ml-2 mt-8" @click="downloadImage">
      Download
    </v-btn>
  </div>
  <v-snackbar v-model="showSnackbar" timeout="4000">
    Image saved! You can find it in your Downloads or Files app.
  </v-snackbar>

</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, CSSProperties } from 'vue'
import { useGtag } from 'vue-gtag-next'

const { event } = useGtag()
const showSnackbar = ref(false)

const props = defineProps<{
  canvasSize: { width: number; height: number; shape: string }
  croppedImageWithFrame: string | null
}>()

const previewCanvas = ref<HTMLCanvasElement | null>(null)

function downloadImage() {
  const originalCanvas = previewCanvas.value
  if (!originalCanvas || !props.croppedImageWithFrame) return

  const size = 640
  const scale = 3
  const canvas = document.createElement('canvas')
  canvas.width = size * scale
  canvas.height = size * scale
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const srcAspect = img.width / img.height
    const destAspect = 1

    let sx = 0, sy = 0, sw = img.width, sh = img.height
    if (srcAspect > destAspect) {
      sw = img.height
      sx = (img.width - sw) / 2
    } else {
      sh = img.width
      sy = (img.height - sh) / 2
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob!)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      link.download = `prideframe-${timestamp}.png`
      link.click()
      showSnackbar.value = true
    }, 'image/png')

    event('download', {
      event_category: 'interaction',
      event_label: 'fixed-640x640',
    })
  }
  img.src = props.croppedImageWithFrame!
}

const getFrameStyle = computed(() => ({
  width: '100%',
  maxWidth: '360px',
  aspectRatio: '1 / 1',
  backgroundColor: '#efece8ff',
  borderRadius: props.canvasSize.shape === 'round' ? '9999px' : '0px',
  overflow: 'hidden',
  position: 'relative',
} as CSSProperties))

function updateCanvas() {
  const canvas = previewCanvas.value
  if (!canvas || !props.croppedImageWithFrame) return
  const baseImg = new Image()
  baseImg.crossOrigin = 'anonymous'

  baseImg.onload = () => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = props.canvasSize.width
    canvas.height = props.canvasSize.height
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height)

  }

  baseImg.src = props.croppedImageWithFrame
}

watch(
  () => props.croppedImageWithFrame,
  () => {
    updateCanvas()
  },
  { immediate: true }
)

onMounted(() => {
  updateCanvas()
})
</script>

<style scoped>
.preview-canvas {
  width: 100%;
  height: auto;
  display: block;
}
</style>
