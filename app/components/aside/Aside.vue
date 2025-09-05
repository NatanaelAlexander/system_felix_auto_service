<template>
  <!-- Mobile Header -->
  <header class="flex items-center px-4 py-3.5 bg-gradient-to-br from-gray-800 to-gray-900 border-b border-white/10 fixed top-0 left-0 right-0 z-40 backdrop-blur-xl shadow-lg lg:hidden">
    <button @click="toggleAside" class="bg-gradient-to-br from-red-500 to-red-600 border-none rounded-2xl w-11 h-11 text-white cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:scale-105 active:translate-y-0 active:scale-95 flex items-center justify-center">
      <svg v-if="!isAsideOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    <div class="flex-1 ml-4 flex items-center">
      <h1 class="text-gray-100 text-sm font-medium tracking-wide opacity-95 m-0">Felix Auto Service</h1>
    </div>
  </header>

  <!-- Mobile Overlay -->
  <div v-if="isAsideOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden" @click="closeAside"></div>

  <!-- Aside Navigation -->
  <aside :class="[
    'w-72 h-dvh sm:h-dvh md:h-dvh lg:h-screen bg-gradient-to-br from-gray-800 to-gray-900 fixed left-0 top-0 flex flex-col backdrop-blur-2xl z-50 transform transition-transform duration-300 ease-out md:translate-x-0 lg:fixed lg:my-0 lg:mx-0 lg:rounded-none lg:border-0 lg:transform-none',
    isAsideOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 lg:translate-x-0'
  ]">
    <!-- User Profile Section - Fixed at top -->
    <div class="flex items-center p-6 border-b border-white/10 bg-gradient-to-br from-gray-700 to-gray-800 lg:rounded-t-3xl relative flex-shrink-0">
      <div class="w-13 h-13 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mr-4 flex-shrink-0 shadow-lg border-2 border-white/10">
        <span class="text-2xl text-white">👤</span>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-gray-100 text-base font-semibold m-0 mb-1 truncate">{{ userData?.name || 'User' }}</h3>
        <p class="text-gray-400 text-sm m-0 truncate">{{ userData?.email || 'user@example.com' }}</p>
      </div>
    </div>

    <!-- Navigation - Scrollable content -->
    <nav class="flex-1 py-6 px-0 overflow-y-auto aside-scroll">
      <ul class="list-none p-0 m-0">
        <li class="mb-2 px-5">
          <NuxtLink to="/" class="flex items-center px-5 py-4 text-gray-300 no-underline transition-all duration-300 rounded-2xl relative overflow-hidden hover:bg-gray-700/60 hover:text-gray-100 hover:translate-x-1 active:bg-red-500/20 active:text-red-50 active:font-semibold active:border active:border-red-500/30 active:shadow-lg" active-class="bg-red-500/20 text-red-50 font-semibold border border-red-500/30 shadow-lg" @click="closeAside">
            <svg class="w-5 h-5 mr-4 flex-shrink-0 transition-transform duration-300 stroke-2 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
              </path>
            </svg>
            <span class="text-sm font-medium">Home</span>
          </NuxtLink>
        </li>
        <li class="mb-2 px-5">
          <NuxtLink to="/invoices" class="flex items-center px-5 py-4 text-gray-300 no-underline transition-all duration-300 rounded-2xl relative overflow-hidden hover:bg-gray-700/60 hover:text-gray-100 hover:translate-x-1 active:bg-red-500/20 active:text-red-50 active:font-semibold active:border active:border-red-500/30 active:shadow-lg" active-class="bg-red-500/20 text-red-50 font-semibold border border-red-500/30 shadow-lg" @click="closeAside">
            <svg class="w-5 h-5 mr-4 flex-shrink-0 transition-transform duration-300 stroke-2 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
              </path>
            </svg>
            <span class="text-sm font-medium">Invoices</span>
          </NuxtLink>
        </li>
        <li class="mb-2 px-5">
          <NuxtLink to="/createInvoice" class="flex items-center px-5 py-4 text-gray-300 no-underline transition-all duration-300 rounded-2xl relative overflow-hidden hover:bg-gray-700/60 hover:text-gray-100 hover:translate-x-1 active:bg-red-500/20 active:text-red-50 active:font-semibold active:border active:border-red-500/30 active:shadow-lg" active-class="bg-red-500/20 text-red-50 font-semibold border border-red-500/30 shadow-lg" @click="closeAside">
            <svg class="w-5 h-5 mr-4 flex-shrink-0 transition-transform duration-300 stroke-2 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
              </path>
            </svg>
            <span class="text-sm font-medium">Create Invoice</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Logout Section - Fixed at bottom -->
    <div class="p-6 border-t border-white/10 flex-shrink-0">
      <button @click="logout" class="w-full flex items-center px-5 py-4 text-gray-300 transition-all duration-300 rounded-2xl relative overflow-hidden hover:bg-red-500/20 hover:text-red-50 hover:translate-x-1 active:bg-red-500/30 active:text-red-50 active:font-semibold active:border active:border-red-500/30 active:shadow-lg bg-transparent border border-transparent">
        <svg class="w-5 h-5 mr-4 flex-shrink-0 transition-transform duration-300 stroke-2 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        <span class="text-sm font-medium">Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Get user data from cookies
const userData = useCookie<{ id: number; email: string; name: string; rol_name: string }>('user')

// Aside toggle functionality
const isAsideOpen = ref(false)

const toggleAside = () => {
  isAsideOpen.value = !isAsideOpen.value
}

const closeAside = () => {
  isAsideOpen.value = false
  // Ensure body scroll is restored
  if (process.client) {
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.width = ''
  }
}

// Close aside on route change
const route = useRoute()
watch(() => route.path, () => {
  closeAside()
})

// Logout function
const logout = () => {
  // Clear cookies
  const userCookie = useCookie('user')
  const tokenCookie = useCookie('token')
  
  userCookie.value = null
  tokenCookie.value = null
  
  // Close aside
  closeAside()
  
  // Redirect to login page
  navigateTo('/')
}

// Mobile viewport height fix
onMounted(() => {
  const setVH = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }
  
  setVH()
  window.addEventListener('resize', setVH)
  window.addEventListener('orientationchange', setVH)
  
  onUnmounted(() => {
    window.removeEventListener('resize', setVH)
    window.removeEventListener('orientationchange', setVH)
  })
})

// Block body scroll when aside is open on mobile/tablet
watch(isAsideOpen, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      // Block body scroll
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      // Restore body scroll
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.width = ''
  }
})
</script>

<style scoped>
/* Solo estilos específicos que no se pueden hacer con Tailwind */
.aside-navigation {
  box-shadow: none;
}

@media (min-width: 1024px) {
  .aside-navigation {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
  }
}

/* Custom scrollbar for aside navigation */
.aside-scroll::-webkit-scrollbar {
  width: 6px;
}

.aside-scroll::-webkit-scrollbar-track {
  background: rgba(55, 65, 81, 0.3);
  border-radius: 3px;
}

.aside-scroll::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.6);
  border-radius: 3px;
}

.aside-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}

/* Firefox scrollbar */
.aside-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(107, 114, 128, 0.6) rgba(55, 65, 81, 0.3);
}

/* Mobile viewport height fix */
@media (max-width: 1023px) {
  .mobile-aside {
    height: 100vh;
    height: 100dvh; /* Dynamic viewport height for mobile */
    height: calc(var(--vh, 1vh) * 100); /* Fallback for older browsers */
  }
}

/* Ensure aside doesn't exceed viewport on mobile */
@media (max-width: 1023px) {
  aside {
    max-height: 100vh;
    max-height: 100dvh;
    max-height: calc(var(--vh, 1vh) * 100);
  }
}
</style>
