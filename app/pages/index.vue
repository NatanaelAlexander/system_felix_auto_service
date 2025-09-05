<template>
  <NuxtLayout name="ejemplo" v-if="authResponse && authResponse.status === 200 && authResponse.data?.message === true">
    <MainContent />
  </NuxtLayout>
  <MainLogin v-else />
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue'
import type { AxiosResponse } from 'axios'

const authResponse = ref<AxiosResponse<any> | null>(null)

const verifyLogged = async () => {
  try {
    const config = useRuntimeConfig()
    const url = config.public.apiBase

    const userCookie = useCookie<{ id: number }>('user')
    const tokenCookie = useCookie<string>('token')

    if (!tokenCookie.value || !userCookie.value || !userCookie.value.id) {
      authResponse.value = null
      return
    }

    authResponse.value = await axios.post(
      `${url}/api/auth/isLogged`,
      {
        token: tokenCookie.value,
        user_id: userCookie.value.id
      },
      {
        validateStatus: () => true
      }
    )

  } catch (_error) {
    authResponse.value = null
  }
}

onMounted(() => {
  verifyLogged()
})
</script>