
import { searchUserAuth, createUser, findUserByEmail } from "../models/users";
import { generateToken, validateToken } from "../utils/token"
import bcrypt from 'bcryptjs';

interface TypeGetUserByEmail {
    email: string,
    password: string
}

interface TypeGetCreateUser {
    email: string,
    password: string,
    rol_id: number,
    name: string
}

interface TypeVerifyUserAndToken {
    token: string,
    user_id: number
}

export const getUserForLogin = async ({ email, password }: TypeGetUserByEmail) => {
    try {

        if (!email || email.trim() == "" || email == undefined || email == null)
            return { message: 'Required fields missing: email', status: 400 }

        if (!password || password.trim() == "" || password == undefined || password == null)
            return { message: 'Required fields missing: password', status: 400 }

        const response = await searchUserAuth({ email });

        if (response && response.data && response.data.length > 0) {
            const hash = String(response.data[0].password);

            const isValid: boolean = bcrypt.compareSync(password, hash);

            if (!isValid) {
                return { message: 'Incorrect password', status: 401 };
            }

            const user_id = Number(response.data[0].id);
            const rol_id = Number(response.data[0].rol_id);
            const tokenGenerado = await generateToken({ user_id, rol_id })

            /* Quitarle la password al response */
            const sanitized = (({ password, rol_id, ...rest }) => rest)(response.data[0]);

            return { data: sanitized, token: tokenGenerado, status: 200 };
        } else {
            return { message: 'Email not found', status: 404 };
        }

    } catch (error) {
        console.log("getUserForLogin error", error);
        return { message: 'Unknown error while fetching the user', status: 500 };
    }
};


export const putUserCreate = async ({ email, password, rol_id, name }: TypeGetCreateUser) => {
    try {

        /* Verificar si esta el correo disponible, asin user asignado */

        const userExist = await findUserByEmail({ email });
        if (userExist && userExist.data && userExist.data.length > 0) {
            return { message: 'Email is already in use', status: 400 }
        }

        /* Hashear Password */
        const passHash = bcrypt.hashSync(password.trim(), 10);

        const response = await createUser({ email, passHash, rol_id, name });

        if (response.status === 200) {
            return { data: response.data, status: 200 };
        } else {
            return { message: 'Could not create the user', status: 404 }
        }

    } catch (error) {
        return { message: 'Unknown error while fetching the user', status: 500 }
    }
}

export const verifyUserAndtoken = async ({ token, user_id }: TypeVerifyUserAndToken) => {
    try {

        if (!token || token.trim() == '' || token == null || token == undefined)
            return { message: 'Required fields missing: token', status: 400 }
        if (!user_id || user_id == null || user_id == undefined)
            return { message: 'Required fields missing: token', status: 400 }

        /* Verificar si esta bien el token */
        const verifyToken = await validateToken(token)
        console.log(verifyToken.user_id, user_id)

        /* buscar el payload del token y comprar user_id con el del token */

        if (verifyToken.user_id != user_id) {
            return { data: false, status: 400 }
        }

        /* Si todo esta bien, lo de abajo */
        return { data: true, status: 200 };

    } catch (error) {
        return { message: 'Unknown error while verify User and token', status: 500 }
    }
}
