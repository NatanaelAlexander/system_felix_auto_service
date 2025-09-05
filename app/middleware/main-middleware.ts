export default defineNuxtPlugin(() => {
  const router = useRouter()
  
  router.beforeEach((to, from) => {
    console.log('Soy el middleware')
    
    if (to.path === '/invoices') {
      return navigateTo('/')
    }
  })
})