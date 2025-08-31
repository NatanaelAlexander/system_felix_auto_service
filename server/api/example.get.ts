export default defineEventHandler((event) => {

  console.log('API example called')

  return {
    message: 'Hola desde la API con Nitro 🚀'
  }
})