<template>
  <div class="p-8">
    <h2 class="text-xl font-bold mb-4">🌈 フレームを選択</h2>
    <FrameSelector :selected="selectedFrame" @select="onSelectFrame" />

    <h2 class="text-xl font-bold mt-6">📤 画像をアップロード</h2>
    <input type="file" accept="image/*" @change="onFileChange" />

    <div v-if="uploadedImage && selectedFrame" class="mt-6">
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded"
        @click="drawCanvas"
      >
        合成する
      </button>
      <button
        class="ml-2 px-4 py-2 bg-green-600 text-white rounded"
        @click="downloadImage"
      >
        ダウンロード
      </button>
    </div>

    <canvas ref="canvas" width="300" height="300" class="mt-6 border" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FrameSelector from '@/components/FrameSelector.vue'

const canvas = ref<HTMLCanvasElement | null>(null)
const uploadedImage = ref<string | null>(null)
const selectedFrame = ref<string | null>(null)

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    uploadedImage.value = URL.createObjectURL(file)
  }
}

function onSelectFrame(url: string) {
  selectedFrame.value = url
}

function drawCanvas() {
  if (!canvas.value || !uploadedImage.value || !selectedFrame.value) return

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.src = src
    })
  }

  Promise.all([
    loadImage(uploadedImage.value),
    loadImage(selectedFrame.value)
  ]).then(([photo, frame]) => {
    ctx.drawImage(photo, 0, 0, 300, 300)
    ctx.drawImage(frame, 0, 0, 300, 300)
  })
}

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
</script>
