import { createClient } from "@libsql/client";

// Asegúrate de que las variables existan
const url = process.env.APP_URL_TURSO;
const token = process.env.APP_TOKEN_TURSO;

if (!url || !token) {
    throw new Error("Faltan las variables de entorno TURSO_DATABASE_URL o TURSO_AUTH_TOKEN");
}

export const tursoClient = createClient({
    url: url,
    authToken: token,
});