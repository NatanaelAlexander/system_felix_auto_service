<template>
  <div
    class="login-container min-h-dvh sm:min-h-dvh md:min-h-dvh lg:min-h-screen flex items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 font-sans">
    <div
      class="w-full max-w-md min-h-[600px] sm:min-h-[650px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/5 flex flex-col justify-center">
      <!-- Logo Section -->
      <div class="flex justify-center mb-10 sm:mb-12">
        <div class="relative">
          <!-- Glow effect -->
          <div class="absolute inset-0 bg-red-500/20 rounded-full blur-xl scale-110 animate-pulse"></div>
          <!-- Logo container -->
          <div class="relative p-2">
            <img src="/logo_fenix_sin_fondo.png" alt="Felix Auto Service Logo"
              class="w-70 h-60 md:w-56 md:h-56 object-contain drop-shadow-2xl logo-cropped" />
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-6 sm:space-y-8 flex-1 flex flex-col justify-center -mt-10">
        <!-- Email Field -->
        <div class="space-y-3">
          <label for="email" class="text-white text-sm font-medium block">Email</label>
          <input id="email" v-model="formData.email" type="email" :class="[
            'w-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-white/10 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white text-sm sm:text-base transition-all duration-300 outline-none',
            'placeholder:text-white/60 placeholder:opacity-100',
            'focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,53,69,0.1)] focus:bg-gradient-to-br focus:from-gray-600 focus:to-gray-700',
            errors.email ? 'border-red-500 shadow-[0_0_0_3px_rgba(220,53,69,0.1)]' : ''
          ]" placeholder="Enter your email" maxlength="100" @change="validateEmail" @input="clearErrors" />
          <span v-if="errors.email" class="text-red-500 text-xs font-medium mt-1 block">{{ errors.email }}</span>
        </div>

        <!-- Password Field -->
        <div class="space-y-3">
          <label for="password" class="text-white text-sm font-medium block">Password</label>
          <input id="password" v-model="formData.password" type="password" :class="[
            'w-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-white/10 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white text-sm sm:text-base transition-all duration-300 outline-none',
            'placeholder:text-white/60 placeholder:opacity-100',
            'focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,53,69,0.1)] focus:bg-gradient-to-br focus:from-gray-600 focus:to-gray-700',
            errors.password ? 'border-red-500 shadow-[0_0_0_3px_rgba(220,53,69,0.1)]' : ''
          ]" placeholder="Enter your password" maxlength="100" @change="validatePassword" @input="clearErrors" />
          <span v-if="errors.password" class="text-red-500 text-xs font-medium mt-1 block">{{ errors.password }}</span>
        </div>

        <!-- Axios Error Message -->
        <div v-if="axiosError" class="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p class="text-red-400 text-sm font-medium">{{ axiosError }}</p>
        </div>

        <!-- Login Button -->
        <button type="submit" :disabled="isSubmitting"
          class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base transition-all duration-300 mt-6 sm:mt-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
          <span v-if="isSubmitting">Signing in...</span>
          <span v-else>Sign In</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email: string
  password: string
}

const formData = reactive<FormData>({
  email: '',
  password: ''
})

const errors = reactive<FormErrors>({
  email: '',
  password: ''
})

const isSubmitting = ref(false)
const axiosError = ref('')

// Clear all errors when user types
const clearErrors = () => {
  errors.email = ''
  errors.password = ''
  axiosError.value = ''
}

// Email validation
const validateEmail = (): boolean => {
  const email = formData.email.trim()

  if (!email) {
    errors.email = 'Email address is required'
    return false
  }

  // Check for @ symbol
  if (!email.includes('@')) {
    errors.email = 'Email must contain @ symbol (e.g., user@domain.com)'
    return false
  }

  // Check for domain with dot
  const parts = email.split('@')
  if (parts.length !== 2) {
    errors.email = 'Email format is invalid. Use format: user@domain.com'
    return false
  }

  const domain = parts[1]
  if (!domain || !domain.includes('.')) {
    errors.email = 'Email domain must contain a dot (e.g., .com, .org, .net)'
    return false
  }

  // More comprehensive email regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address (e.g., user@example.com)'
    return false
  }

  errors.email = ''
  return true
}

// Password validation
const validatePassword = (): boolean => {
  const password = formData.password.trim()

  if (!password) {
    errors.password = 'Password is required'
    return false
  }

  errors.password = ''
  return true
}

// Handle form submission
const handleLogin = async () => {
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()

  if (!isEmailValid || !isPasswordValid) {
    return
  }

  isSubmitting.value = true
  axiosError.value = '' // Clear previous axios errors

  try {
    // Simulate API call
    const config = useRuntimeConfig()
    const url = config.public.apiBase
    const response = await axios.post(`${url}/api/auth/auth`, {
      "email": formData.email,
      "password": formData.password
    })

    // Save user data into cookies after successful login
    const userData = response.data.user.data
    const userToken = response.data.user.token
    
    // Cookie para los datos del usuario
    const userCookie = useCookie<{ id: number; email: string; name: string; rol_name: string }>('user', { maxAge: 60 * 60 * 10, sameSite: 'lax' })
    userCookie.value = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      rol_name: userData.rol_name
    }
    
    // Cookie para el token
    const tokenCookie = useCookie<string>('token', { maxAge: 60 * 60 * 10, sameSite: 'lax' })
    tokenCookie.value = userToken
    // Here you would typically make an API call to authenticate
    // For now, we just log the data

    // Recargar la página tras login exitoso
    if (response.status === 200) {
      window.location.reload()
    }

  } catch (error: any) {
    console.error('Login error:', error.response.data.user.message)
    axiosError.value = error.response.data.user.message
  } finally {
    isSubmitting.value = false
  }
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
</script>

<style scoped>
.logo-cropped {
  clip-path: inset(20% 0% 0% 0%);
}

/* Mobile viewport height fix */
@media (max-width: 1023px) {
  .login-container {
    min-height: 100vh;
    min-height: 100dvh; /* Dynamic viewport height for mobile */
    min-height: calc(var(--vh, 1vh) * 100); /* Fallback for older browsers */
  }
}
</style>