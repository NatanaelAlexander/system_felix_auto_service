
import { searchUserAuth, createUser, findUserByEmail } from "../models/users";
import { generateToken } from "../utils/token"
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

export const getUserForLogin = async ({ email, password }: TypeGetUserByEmail) => {
    try {
        const response = await searchUserAuth({ email });

        if (response && response.data && response.data.length > 0) {
            const hash = String(response.data[0].password);

            const isValid: boolean = bcrypt.compareSync(password, hash);

            if (!isValid) {
                return { message: 'Contraseña incorrecta', status: 401 };
            }

            const user_id = Number(response.data[0].id);
            const rol_id = Number(response.data[0].rol_id);
            const tokenGenerado = await generateToken({ user_id, rol_id })

            /* Quitarle la password al response */
            const sanitized = (({ password, rol_id, ...rest }) => rest)(response.data[0]);

            return { data: sanitized, token: tokenGenerado, status: 200 };
        } else {
            return { message: 'Correo no encontrado', status: 404 };
        }

    } catch (error) {
        console.log("getUserForLogin error", error);
        return { message: 'Error desconocido al buscar el usuario', status: 500 };
    }
};


export const putUserCreate = async ({ email, password, rol_id, name }: TypeGetCreateUser) => {
    try {

        /* Verificar si esta el correo disponible, asin user asignado */

        const userExist = await findUserByEmail({ email });
        if (userExist && userExist.data && userExist.data.length > 0) {
            return { message: 'El correo ya esta en uso', status: 400 }
        }

        /* Hashear Password */
        const passHash = bcrypt.hashSync(password.trim(), 10);

        const response = await createUser({ email, passHash, rol_id, name });

        if (response.status === 200) {
            return { data: response.data, status: 200 };
        } else {
            return { message: 'No se pudo crear el usuario', status: 404 }
        }

    } catch (error) {
        return { message: 'Error desconocido al buscar el usuario', status: 500 }
    }
}
