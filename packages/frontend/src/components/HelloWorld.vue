<script setup lang="ts">
const baseUrl = 'http://localhost:3000'
import { ref } from 'vue'
import { StarterDto } from '@nest-vue-starter/shared'

defineProps<{ msg: string }>()
async function getVersion(): Promise<StarterDto> {
  const response = await fetch(`${baseUrl}/api/version`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  return await response.json()
}

const count = ref(0)
const version = await getVersion()
</script>

<template>
  <h1>{{ msg }}</h1>
  <p>Program {{ version.name }} version {{ version.version }}</p>
  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the
    official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
