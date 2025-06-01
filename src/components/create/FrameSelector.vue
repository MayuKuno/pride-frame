<template>
  <div class="relative mx-auto mb-4 mt-12" :style="getFrameStyle">
    <canvas ref="previewCanvas" :width="canvasSize.width" :height="canvasSize.height" class="preview-canvas border d-block mx-auto" />
  </div>

  <v-row class="px-4" dense>
    <template v-if="!isLoading && matchingFrames.length > 0">
      <v-col
        v-for="frame in matchingFrames"
        :key="frame.name"
        cols="4"
        sm="6"
        md="4"
        class="d-flex justify-center"
      >
        <div
          class="frame-card"
          :class="{
            'opacity-50': !isSelected(frame.imageUrl)
          }"
        :elevation="isSelected(frame.imageUrl) ? 8 : 2"
          @click="selectFrame(frame.imageUrl)"
        >
          <v-img :src="frame.imageUrl" aspect-ratio="1" cover class="rounded-t-xl" />
        </div>
      </v-col>
    </template>

    <template v-else-if="!isLoading">
      <v-col cols="12" class="text-center py-10">
        <div class="no-frame-message">
          Oops! No ready-made frame for this size and shape...<br>
          But hey — why not make your own?<br>
          <v-btn to="/create/custom" append-icon="mdi-play" variant="tonal" class="mt-8">
            Start from scratch from here
          </v-btn>
        </div>
      </v-col>
    </template>

    <template v-else>
      <v-col cols="12" class="text-center py-10">
        <v-progress-circular indeterminate color="primary" size="40" />
      </v-col>
    </template>
  </v-row>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, CSSProperties } from 'vue'

const isLoading = ref(true)


const props = defineProps<{
  canvasSize: { width: number; height: number; shape: string }
  image: string | null
  frameId: any
}>()

const selectedFrame = ref<string | null>(null)
const isSelected = (value: string) => selectedFrame.value === value
const previewCanvas = ref<HTMLCanvasElement | null>(null)

const emit = defineEmits<{
  (e: 'croppedImageWithFrame', dataUrl: string): void
}>()


const frames = ref<Array<{ id: string; name: string; imageUrl: string; width: number; height: number; shape: string }>>([])

onMounted(async () => {
  try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/list-gallery-items`)
    if (!res.ok) throw new Error('Failed to fetch frames')
    const data = await res.json()

    const useProxy = import.meta.env.DEV
    const mapped = data.map((item: any) => {
      const originalUrl: string = item.imageUrl
      const id: string = item.id

      const imageUrl = useProxy
        ? `/s3proxy${new URL(originalUrl).pathname}`
        : `https://d3nbprzg1gro17.cloudfront.net${new URL(originalUrl).pathname}`

      return {
        name: item.title || 'Untitled',
        imageUrl,
        id
      }
    })

    frames.value = mapped

    const matched = mapped.find(f => f.id === props.frameId)
    selectedFrame.value = matched?.imageUrl || mapped[0]?.imageUrl || null

    updateCanvas()
  } catch (error) {
    console.error('Error loading frames:', error)
  } finally {
    isLoading.value = false
  }
})

const matchingFrames = computed(() => {
  if (frames.value.length > 0 && !selectedFrame.value) {
    selectedFrame.value = frames.value[0].imageUrl
  }
  return frames.value
})

function selectFrame(imageUrl: string) {
  selectedFrame.value = imageUrl
  updateCanvas()
  emit('croppedImageWithFrame', imageUrl)
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

    if (selectedFrame.value) {
      const frameImg = new Image()
      frameImg.crossOrigin = 'anonymous'
      frameImg.onload = () => {
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height)

        const combinedDataUrl = canvas.toDataURL('image/png')
        emit('croppedImageWithFrame', combinedDataUrl)
      }
      frameImg.src = selectedFrame.value
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
  width: '100%',
  maxWidth: '360px',
  aspectRatio: '1 / 1',
  backgroundColor: '#efece8ff',
  borderRadius: props.canvasSize.shape === 'round' ? '9999px' : '0px',
  overflow: 'hidden',
  position: 'relative',
} as CSSProperties))
</script>

<style scoped>
.frame-card {
  width: 360px;
  background-color: #eeeeee;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;
  cursor: pointer;
}

@media (min-width: 960px) {
  .frame-card {
    max-width: 360px;
  }
}

.selected {
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.2);
}

.no-frame-message {
  font-size: 1.2rem;
  color: #6b7280;
  font-weight: 500;
}
.preview-canvas {
  width: 100%;
  height: auto;
  display: block;
}
</style>
