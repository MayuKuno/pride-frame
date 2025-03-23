<template>
  <div class="flex gap-4 flex-wrap">
    <div
      v-for="frame in frames"
      :key="frame.name"
      class="cursor-pointer border rounded overflow-hidden transition hover:shadow-lg"
      :class="frame.url === selected ? 'ring-4 ring-pink-500 shadow-xl' : 'ring-1 ring-gray-300'"
      @click="$emit('select', frame.url)"
    >
      <img :src="frame.url" alt="" class="w-32 h-32 object-cover" />
      <p class="text-center text-sm py-1">{{ frame.name }}</p>
    </div>
  </div>
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
