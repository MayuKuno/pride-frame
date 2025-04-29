<template>
  <div class="mt-4 d-flex align-center justify-center">
    <div class="relative flex justify-center items-center w-full max-w-[620px] min-h-[400px]">
      <div class="relative overflow-hidden" :class="shapeClass" :style="frameStyle">
        <Cropper
          v-if="uploadedImage"
          :src="uploadedImage"
          :canvasSize="canvasSize"
          :cropShape="canvasSize.shape"
          @ready="cropper => emit('cropperReady', cropper)"
          @crop="emitCrop"
        />
        <div v-else class="flex justify-center items-center w-full h-full">
          <img src="/icons/user.png" alt="user" class="user-icon" />
        </div>
      </div>
    </div>
  </div>

  <div class="mt-4 d-flex align-center justify-center">
    <v-file-input
      :model-value="selectedFile"
      @update:model-value="onFileInputChange"
      class="file-input"
      clearable
      prepend-icon=""
      prepend-inner-icon="mdi-camera"
      accept="image/*"
      messages="Don’t worry — your photo never leaves your device. Nothing is uploaded to any server."
      label="Upload your photo"
      variant="underlined"
      @click:clear="onFileClear"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import Cropper from '@/components/common/Cropper.vue'

const props = defineProps<{
  uploadedImage: string | null
  canvasSize: { width: number; height: number; shape: 'round' | 'square' }
  shapeClass: string
  frameStyle: Record<string, string>
  selectedFile: File | null
}>()

const emit = defineEmits<{
  (e: 'update:selectedFile', value: File | null): void
  (e: 'cropperReady', cropper: any): void
  (e: 'refreshPreview'): void
  (e: 'fileChange', file: File): void
  (e: 'fileClear'): void
  (e: 'crop', croppedDataUrl: string): void
}>()

function onFileInputChange(file: File | null) {
  if (file) {
    emit('update:selectedFile', file)
    emit('fileChange', file)
  }
}

function onFileClear() {
  emit('update:selectedFile', null)
  emit('fileClear')
}

function emitCrop(croppedDataUrl: string) {
  emit('crop', croppedDataUrl)
}
</script>

<style scoped>
.user-icon {
  width: calc(100% - 120px);
  height: calc(100% - 120px);
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
}

.file-input {
  max-width: 620px;
  width: 100%;
}
</style>
