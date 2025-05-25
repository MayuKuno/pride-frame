<template>
  <v-stepper v-model="step" :items="stepItems" show-actions class="pa-2 min-h-screen flex flex-col stepper">
    <template v-slot:item.1>
      <UploadPhoto
        v-if="step === 1"
        ref="uploadPhotoRef"
        v-model:canvasSize="canvasSize"
        @croppedImage="handleCroppedImageUpdate"
      />
    </template>

    <template v-slot:item.2>
      <FrameSelector
        :canvasSize="canvasSize"
        :image="croppedImage"
        :frameId="frameId"
        @croppedImageWithFrame="handleCroppedImageWithFrameUpdate"
      />
    </template>

    <template v-slot:item.3>
      <DownloadImage
        :canvasSize="canvasSize"
        :croppedImageWithFrame="croppedImageWithFrame"
      />
    </template>

    <template v-slot:actions>
      <StepperActions
        :step="step"
        :stepItemsLength="stepItems.length"
        :canProceed="step !== 1 || !!croppedImage"
        @back="step--"
        @next="step++"
      />
    </template>
    <BackToHome />
  </v-stepper>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BackToHome from '@/components/common/BackToHome.vue'
import StepperActions from '@/components/create/StepperActions.vue'
import UploadPhoto from '@/components/create/UploadPhoto.vue'
import FrameSelector from '@/components/create/FrameSelector.vue'
import DownloadImage from '@/components/create/DownloadImage.vue'

const route = useRoute()
const step = ref(1)
const stepItems = ['Upload & Adjust Photo', 'Select Frame', 'Download']
const canvasSize = ref({
  width: 640,
  height: 640,
  shape: 'round'
})
const frameId = route.query.frameId

const croppedImage = ref<string | null>(null)
const croppedImageWithFrame = ref<string | null>(null)
const uploadPhotoRef = ref()

const handleCroppedImageUpdate = (croppedDataUrl: string ) => {
  croppedImage.value = croppedDataUrl
}
const handleCroppedImageWithFrameUpdate = (croppedDataUrl: string ) => {
  croppedImageWithFrame.value = croppedDataUrl
}
</script>

<style scoped>
.stepper {
  min-height: 100vh;
}

:deep(.v-stepper-header) {
  box-shadow: none;
}

:deep(.v-stepper-window) {
   margin: 20px 0px;
}

@media (max-width: 1000px) {
  :deep(.v-stepper-header) {
    box-shadow: none;
    flex-wrap: wrap;
    overflow-x: auto;
  }
  :deep(.v-stepper-item) {
    padding: 12px;
    width: 100%;
  }
}
</style>
