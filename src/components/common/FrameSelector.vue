<template>
  <v-row class="px-4" dense>
    <v-col
      v-for="frame in frames"
      :key="frame.name"
      cols="12"
      sm="6"
      md="4"
      class="d-flex justify-center"
    >
      <div
        class="cursor-pointer rounded border overflow-hidden"
        :class="frame.url === selected ? 'elevation-12 border-pink' : 'elevation-2'"
        @click="$emit('select', frame.url)"
      >
        <v-img :src="frame.url" height="128" width="128" cover></v-img>
        <div class="text-center text-caption py-1">{{ frame.name }}</div>
      </div>
    </v-col>
  </v-row>
</template>



<script setup lang="ts">
defineProps<{
  selected: string | null
}>()

const frames = [
  { name: 'Rainbow', url: '/frames/rainbow.png' },
  { name: 'Trans', url: '/frames/trans.png' },
  { name: 'Bi', url: '/frames/nonbinary.png' },
]
</script>
