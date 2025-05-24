<template>
  <div>
    <v-btn variant="text" class="back" @click="$emit('back')" v-if="step > 1">
      Back
    </v-btn>
    <v-btn
      variant="text"
      color="primary"
      class="next"
      @click="$emit('next')"
      v-if="step < stepItemsLength"
      :disabled="!canProceed"
    >
      Next
    </v-btn>
  </div>
</template>

<script setup>
defineProps({
  step: Number,
  stepItemsLength: Number,
  canProceed: Boolean
});

defineEmits(['back', 'next']);
</script>

<style scoped>
.back {
  position: absolute;
  left: 24px;
}

.next {
  position: absolute;
  right: 24px;
}
</style>
