import * as jose from 'jose';

interface TypeGenerateToken {
    user_id: number;
    rol_id: number;
}

export const generateToken = async ({ user_id, rol_id }: TypeGenerateToken) => {
    try {
        const config = useRuntimeConfig();
        const secret = new TextEncoder().encode(config.appSecretWord);

        const token = await new jose.SignJWT({
            user_id: user_id,
            rol_id: rol_id,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("10h") // puedes poner "2d", "30m", etc.
            .sign(secret)
        return token

    } catch (error) {
        console.log("generateToken error", error);
        return { message: 'Unknown error while generating the token', status: 500 }
    }
}

export const validateToken = async (token: string) => {
    try {
        const config = useRuntimeConfig();
        const secret = new TextEncoder().encode(config.appSecretWord);
        const { payload } = await jose.jwtVerify(token, secret)
        return payload // aquí estarán user_id, rol_id, iat, exp
    } catch (err) {
        console.error("Token inválido:", err)
        return { message: 'Unknown error while validating the token', status: 500 }
    }
}