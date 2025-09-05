import { createClient } from "@libsql/client";

// Obtener configuración de runtime
const config = useRuntimeConfig();

// Asegúrate de que las variables existan
const url = config.appUrlTurso;
const token = config.appTokenTurso;

if (!url || !token) {
    throw new Error("Faltan las variables de entorno APP_URL_TURSO o APP_TOKEN_TURSO");
}

export const tursoClient = createClient({
    url: url,
    authToken: token,
});