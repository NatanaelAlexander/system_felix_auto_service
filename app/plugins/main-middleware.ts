export default defineNuxtPlugin((nuxtApp) => {
  // Usar el router de Vue Router directamente
  const router = nuxtApp.$router as any

  router.beforeEach(async (to: any, from: any) => {
    console.log('Soy el middleware')

    if (to.path !== '/') {
      // Solo ejecutar en el cliente (no en SSR)
      if (typeof window === 'undefined') {
        console.log('Ejecutándose en servidor, saltando validación')
        return
      }

      // Verificar cookies usando document.cookie directamente
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) {
          return parts.pop()?.split(';').shift()
        }
        return null
      }

      const tokenCookie = getCookie('token')
      const userCookie = getCookie('user')

      // Si no hay cookies, redirigir al login
      if (!tokenCookie || !userCookie) {
        console.log('No hay cookies de autenticación, redirigiendo a /')
        return router.push('/')
      }

      try {
        // Decodificar y parsear user cookie
        const decodedUserCookie = decodeURIComponent(userCookie)
        const userData = JSON.parse(decodedUserCookie)

        if (!userData.id) {
          console.log('Cookie de usuario inválida, redirigiendo a /')
          return router.push('/')
        }

        // Validar con la API usando fetch nativo
        const response = await fetch('/api/auth/isLogged', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: decodeURIComponent(tokenCookie),
            user_id: userData.id
          })
        })

        const result = await response.json()

        // Si la API responde con error o no está autenticado, redirigir
        if (!result) {
          console.log('Token inválido o expirado, redirigiendo a /')
          return router.push('/')
        }


      } catch (error) {
        console.log('Error al validar token, redirigiendo a /', error)
        return router.push('/')
      }
    }
  })
})