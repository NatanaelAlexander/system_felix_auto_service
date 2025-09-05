<template>
    <div v-if="isAuthenticated" class="layout-container">
        <Aside />
        <main class="w-full pt-20 lg:pt-0 lg:ml-[288px]">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue'
import type { AxiosResponse } from 'axios'

const isAuthenticated = ref(false)
const isLoading = ref(true)

const verifyLogged = async () => {
  try {
    const config = useRuntimeConfig()
    const url = config.public.apiBase

    const userCookie = useCookie<{ id: number }>('user')
    const tokenCookie = useCookie<string>('token')

    if (!tokenCookie.value || !userCookie.value || !userCookie.value.id) {
      isAuthenticated.value = false
      isLoading.value = false
      // Redirigir al login si no hay cookies
      await navigateTo('/')
      return
    }

    const response = await axios.post(
      `${url}/api/auth/isLogged`,
      {
        token: tokenCookie.value,
        user_id: userCookie.value.id
      },
      {
        validateStatus: () => true
      }
    )

    if (response.status === 200 && response.data?.message === true) {
      isAuthenticated.value = true
    } else {
      isAuthenticated.value = false
      // Redirigir al login si no está autenticado
      await navigateTo('/')
    }

  } catch (_error) {
    isAuthenticated.value = false
    // Redirigir al login si hay error
    await navigateTo('/')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  verifyLogged()
})
</script>

<style scoped>
.layout-container {
    display: flex;
    min-height: 100vh;
    background: linear-gradient(135deg, #111827 0%, #0f172a 100%);
}

.main-content {
    background: linear-gradient(135deg, #111827 0%, #0f172a 100%);
}

/* Mobile styles */
@media (max-width: 767px) {
    .main-content {
        padding-top: 4rem; /* Space for mobile header */
    }
}

/* Tablet styles */
@media (min-width: 768px) and (max-width: 1023px) {
    .main-content {
        padding-top: 4rem; /* Space for mobile header */
        padding-left: 1rem;
        padding-right: 1rem;
    }
}

/* Desktop styles */
@media (min-width: 1024px) {
    .main-content {
        padding-top: 0;
    }
}
</style>