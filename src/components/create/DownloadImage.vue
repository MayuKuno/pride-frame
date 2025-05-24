<template>
  <div class="relative mx-auto mb-4 mt-12" :style="getFrameStyle">
    <canvas
      ref="previewCanvas"
      :width="canvasSize.width"
      :height="canvasSize.height"
      class="border d-block mx-auto"
    />
  </div>
  <div class="d-flex justify-center">
    <v-menu offset-y>
      <template #activator="{ props }">
        <v-btn color="primary" variant="tonal" class="ml-2 mt-8" v-bind="props">
          Download
        </v-btn>
      </template>
      <v-list>
        <template v-for="option in downloadOptions" :key="option.label">
          <div v-if="isIncompatible(option)">
            <v-tooltip location="top">
              <template #activator="{ props: tooltipProps }">
                <div v-bind="tooltipProps">
                  <v-list-item :disabled="true">
                    <v-list-item-title>
                      {{ option.label }}
                    </v-list-item-title>
                  </v-list-item>
                </div>
              </template>
              <span>{{ getTooltipMessage(option) }}</span>
            </v-tooltip>
          </div>

          <v-list-item
            v-else
            @click="downloadImage(option)"
          >
            <v-list-item-title>{{ option.label }}</v-list-item-title>
          </v-list-item>
        </template>

      </v-list>
    </v-menu>
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

const downloadOptions = [
  { label: 'Instagram, Facebook, Threads, TikTok (320x320)', width: 320, height: 320 },
  { label: 'LinkedIn (400x400)', width: 400, height: 400 },
  { label: 'Bluesky (480x480)', width: 480, height: 480 },
  { label: 'Slack (512x512)', width: 512, height: 512 },
  { label: 'LINE (640x640)', width: 640, height: 640 },
]

function isIncompatible(option: { label: string }): boolean {
  const isSlack = option.label.toLowerCase().includes('slack')
  const shape = props.canvasSize.shape
  return (isSlack && shape === 'round') || (!isSlack && shape === 'square')
}

function getTooltipMessage(option: { label: string }): string {
  const isSlack = option.label.toLowerCase().includes('slack')
  const shape = props.canvasSize.shape

  if (isSlack && shape === 'round') {
    return '⚠ Slack icons are square. Please switch to Square shape in Step 1.'
  }
  if (!isSlack && shape === 'square') {
    return '⚠ This platform displays round icons. Please switch to Round shape in Step 1.'
  }
  return ''
}

function downloadImage(option: { label: string; width: number; height: number }) {
  const originalCanvas = previewCanvas.value
  if (!originalCanvas || !props.croppedImageWithFrame) return

  const downloadCanvas = document.createElement('canvas')
  downloadCanvas.width = option.width
  downloadCanvas.height = option.height
  const ctx = downloadCanvas.getContext('2d')
  if (!ctx) return

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const srcAspect = img.width / img.height
    const destAspect = option.width / option.height

    let sx = 0, sy = 0, sw = img.width, sh = img.height

    if (srcAspect > destAspect) {
      sw = img.height * destAspect
      sx = (img.width - sw) / 2
    } else {
      sh = img.width / destAspect
      sy = (img.height - sh) / 2
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, option.width, option.height)

    downloadCanvas.toBlob((blob) => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob!)
      link.download = `prideframe-${option.width}x${option.height}.png`
      link.click()
    }, 'image/png')

    event('download', {
      event_category: 'interaction',
      event_label: option.label,
    })
  }
  img.src = props.croppedImageWithFrame
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