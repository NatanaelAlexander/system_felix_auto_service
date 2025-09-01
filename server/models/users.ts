import { tursoClient } from "../bd/index";

interface TypeSearchUser {
    email: string;
    password: string;
}

interface TypeCreateUser {
    email: string;
    passHash: string;
    rol_id: number;
    name: string;
}

interface TypeGetUSerByEmail {
    email: string;
}

export const searchUserAuth = async ({ email, password }: TypeSearchUser) => {
    try {

        const users = await tursoClient.execute({
            sql: `SELECT * FROM users 
            JOIN roles ON users.rol_id = roles.id
            WHERE email = ? AND password = ?`,
            args: [email, password]
        });

        return { data: users.rows, status: 200 }

    } catch (error) {
        console.log("searchUserAuth error", error);
        return { message: 'Error desconocido al buscar el usuario', status: 500 }
    };
}

export const createUser = async ({ email, passHash, rol_id, name }: TypeCreateUser) => {
    try {

        console.log("createUser", email, passHash, rol_id, name);
        const users = await tursoClient.execute({
            sql: `
            INSERT INTO users (email, password, rol_id, name)   
            VALUES (?, ?, ?, ?)`,
            args: [email, passHash, rol_id, name]
        });

        return { data: users.rows, status: 200 }

    } catch (error) {
        console.log("createUser error", error);
        return { message: 'Error desconocido al buscar al crear usuario', status: 500 }
    };
}

export const findUserByEmail = async ({ email }: TypeGetUSerByEmail) => {
    try {

        const users = await tursoClient.execute({
            sql: `
            SELECT * FROM users Where email = ?`,
            args: [email]
        });

        return { data: users.rows, status: 200 }

    } catch (error) {
        console.log("createUser error", error);
        return { message: 'Error desconocido al buscar al crear usuario', status: 500 }
    };
}