<template>
  <div :style="{ width: canvasSize.width + 'px', height: canvasSize.height + 'px' }" class="relative overflow-hidden">
    <img
      ref="image"
      :src="src"
      :style="{ width: canvasSize.width + 'px', height: canvasSize.height + 'px' }"
      alt="croppable"
    />
  </div>
</template>

<script setup lang="ts">
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { onMounted, onBeforeUnmount, ref } from 'vue'

const props = defineProps<{
  src: string
  canvasSize: { width: number; height: number }
}>()

const emits = defineEmits(['ready'])
const image = ref<HTMLImageElement | null>(null)
let cropper: Cropper | null = null

onMounted(() => {
  if (image.value) {
    cropper = new Cropper(image.value, {
      aspectRatio: props.canvasSize.width / props.canvasSize.height,
      viewMode: 1,
      autoCrop: true, // ← 変更ポイント！
      dragMode: 'move',
      movable: true,
      zoomable: true,
      background: false,
      guides: false,
      highlight: false,
      cropBoxMovable: false,
      cropBoxResizable: false,
      ready() {
        emits('ready', cropper!)
      }
    })



  }
})

onBeforeUnmount(() => {
  cropper?.destroy()
})
</script>
