<template>
  <v-stepper v-model="step" :items="stepItems" show-actions class="pa-6 min-h-screen flex flex-col stepper">
    <template v-slot:item.1>
      <ChooseSize
         @canvasSize="handleCanvasSizeUpdate"
      />
    </template>

    <template v-slot:item.2>
      <UploadPhoto
        ref="uploadPhotoRef"
        :canvasSize="canvasSize"
        @croppedImage="handleCroppedImageUpdate"
      />
    </template>

    <template v-slot:item.3>
      <FrameSelector
        :canvasSize="canvasSize"
        :image="croppedImage"
        @croppedImageWithFrame="handleCroppedImageWithFrameUpdate"
      />
    </template>

    <template v-slot:item.4>
      <DownloadImage
        :canvasSize="canvasSize"
        :croppedImageWithFrame="croppedImageWithFrame"
      />
    </template>

    <template v-slot:actions>
      <StepperActions
        :step="step"
        :stepItemsLength="stepItems.length"
        :canProceed="step !== 2 || !!croppedImage"
        @back="handleBack"
        @next="step++"
      />
    </template>
    <BackToHome />
  </v-stepper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BackToHome from '@/components/common/BackToHome.vue'
import StepperActions from '@/components/common/StepperActions.vue'
import ChooseSize from '@/components/common/ChooseSize.vue'
import UploadPhoto from '@/components/common/UploadPhoto.vue'
import FrameSelector from '@/components/default/FrameSelector.vue'
import DownloadImage from '@/components/common/DownloadImage.vue'

const step = ref(1)
const stepItems = ['Choose Size', 'Upload & Adjust Photo', 'Select Frame', 'Download']
const canvasSize = ref({ width: 600, height: 600, shape: 'round' })


const croppedImage = ref<string | null>(null)
const croppedImageWithFrame = ref<string | null>(null)
const uploadPhotoRef = ref()

const handleCanvasSizeUpdate = (newSize: { width: number; height: number; shape: string }) => {
  canvasSize.value = newSize
}
const handleCroppedImageUpdate = (croppedDataUrl: string ) => {
  croppedImage.value = croppedDataUrl
}
const handleCroppedImageWithFrameUpdate = (croppedDataUrl: string ) => {
  croppedImageWithFrame.value = croppedDataUrl
}

function handleBack() {
  if (step.value === 2) {
    uploadPhotoRef.value?.clear()
    croppedImage.value = null
  }
  step.value--
}

</script>

<style scoped>
.stepper {
  min-height: 100vh;
}

:deep(.v-window-item) {
  margin: 60px 0px;
}

:deep(.v-stepper-header) {
  box-shadow: none;
}
</style>
