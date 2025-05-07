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
      <UploadFrame 
        :canvasSize="canvasSize"
        :image="croppedImage"
        @uploadedFrame="handleUploadedFrameUpdate"
        @croppedImageWithFrame="handleCroppedImageWithFrameUpdate"
      />
    </template>

    <template v-slot:item.4>
      <DownloadImage
        :canvasSize="canvasSize"
        :croppedImageWithFrame="croppedImageWithFrame"
      />
    </template>

    <template v-slot:item.5>
      <ShareToGallery
        :uploadedFrame="uploadedFrame" 
      />
    </template>

    <template v-slot:actions>
      <StepperActions
        :step="step"
        :stepItemsLength="stepItems.length"
        :canProceed="(step !== 2 || !!croppedImage) && (step !== 3 || !!uploadedFrame)"
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
import UploadFrame from '@/components/custom/UploadFrame.vue'
import UploadPhoto from '@/components/common/UploadPhoto.vue'
import DownloadImage from '@/components/common/DownloadImage.vue'
import ShareToGallery from '@/components/custom/ShareToGallery.vue'


const step = ref(1)
const stepItems = ['Choose Size','Upload & Adjust Photo', 'Upload Frame' ,'Download', '(Optional) Share to Gallery']
const canvasSize = ref({ width: 600, height: 600, shape: 'round' })
const handleCanvasSizeUpdate = (newSize: { width: number; height: number; shape: string }) => {
  canvasSize.value = newSize
}
const croppedImage = ref<string | null>(null)
const uploadPhotoRef = ref()

const croppedImageWithFrame = ref<string | null>(null)
const uploadedFrame = ref<string | null>(null)

const handleCroppedImageUpdate = (croppedDataUrl: string ) => {
  croppedImage.value = croppedDataUrl
}

const handleCroppedImageWithFrameUpdate = (croppedDataUrl: string ) => {
  croppedImageWithFrame.value = croppedDataUrl
}

const handleUploadedFrameUpdate = (croppedDataUrl: string ) => {
  uploadedFrame.value = croppedDataUrl
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
  box-shadow:none !important;
}

:deep(.v-window-item) {
  margin: 60px 0px;
}

:deep(.v-stepper-header) {
  box-shadow: none;
}
</style>
