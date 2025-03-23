<template>
  <div class="p-8 text-center">
    <h1 class="text-2xl font-bold mb-4">🌈 フレームを作成</h1>
    <p class="mb-6">どちらの方法で作成しますか？</p>

    <div class="flex flex-col gap-4 items-center">
      <router-link to="/create/default" class="bg-blue-500 text-white px-6 py-3 rounded">
        既存のフレームを使う
      </router-link>
      <router-link to="/create/custom" class="bg-green-500 text-white px-6 py-3 rounded">
        カスタムフレームを作る
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
