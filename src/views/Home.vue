<template>
  <div class="p-8 text-center bg-gif">
  </div>
  <div class="button">
    <a href="/create">Create Your Frame</a>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.button{
  margin-top: 64px;
}
.button a {
    background: #eb6100;
    border-radius: 9999px;
    position: relative;
    align-items: center;
    margin: 0 auto;
    padding: 14px 62px;
    color: #fff;
    text-decoration: none;
    transition: 0.3s ease-in-out;
    font-size: 28px;
}
.button a:hover {
    opacity: 0.7;
}
.button a:after {
    content: '';
    width: 8px;
    height: 8px;
    border-top: 3px solid #fff;
    border-right: 3px solid #fff;
    transform: rotate(45deg) translateY(-50%);
    position: absolute;
    top: 50%;
    right: 25px;
    border-radius: 1px;
    transition: 0.3s ease-in-out;
}
.button a:hover:after {
    border-color: #FFF;
    right: 20px;
}
.bg-gif {
  background-image: url('/header.gif');
  background-position: top;
  background-repeat: no-repeat;
  height: 480px;
}
</style>