import { defineEventHandler, getRequestURL, getCookie, createError, setHeaders } from 'h3'
import { verifyUserAndtoken } from '../controllers/users'

export default defineEventHandler(async (event) => {
    const url = getRequestURL(event) // devuelve la URL completa con host
    console.log('New request: ' + url)

    // 🔹 Ver si empieza con /api/invoice o /api/scripts (APIs privadas)
    if (event.node.req.url?.startsWith('/api/invoice') || event.node.req.url?.startsWith('/api/scripts')) {
        
        // Handle CORS preflight requests
        if (event.node.req.method === 'OPTIONS') {
            setHeaders(event, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Max-Age': '86400',
            })
            return ''
        }

        // Set CORS headers for all API responses
        setHeaders(event, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
            'Access-Control-Allow-Credentials': 'true',
        })
        console.log('estas son mis apis privadas')
        
        try {
            // Obtener cookies del request
            const tokenCookie = getCookie(event, 'token')
            const userCookie = getCookie(event, 'user')

            // Verificar que existan las cookies
            if (!tokenCookie || !userCookie) {
                console.log('Missing authentication cookies')
                throw createError({
                    statusCode: 400,
                    statusMessage: 'You do not have access to the system'
                })
            }

            // Parsear user cookie
            let userData
            try {
                userData = JSON.parse(decodeURIComponent(userCookie))
            } catch (parseError) {
                console.log('Invalid user cookie format')
                throw createError({
                    statusCode: 400,
                    statusMessage: 'You do not have access to the system'
                })
            }

            // Verificar que userData tenga id
            if (!userData || !userData.id) {
                console.log('Invalid user data in cookie')
                throw createError({
                    statusCode: 400,
                    statusMessage: 'You do not have access to the system'
                })
            }

            // Verificar token usando la misma lógica que isLogged
            const verificationResult = await verifyUserAndtoken({
                token: decodeURIComponent(tokenCookie),
                user_id: userData.id
            })

            // Si la verificación falla, denegar acceso
            if (verificationResult.status !== 200 || !verificationResult.data) {
                console.log('Token verification failed')
                throw createError({
                    statusCode: 400,
                    statusMessage: 'You do not have access to the system'
                })
            }

            console.log('Authentication successful for user:', userData.id)
            
        } catch (error: any) {
            // Si es un error de createError, lo re-lanzamos
            if (error.statusCode) {
                throw error
            }
            
            // Para otros errores, crear un error genérico
            console.log('Authentication error:', error)
            throw createError({
                statusCode: 400,
                statusMessage: 'You do not have access to the system'
            })
        }
    }
})