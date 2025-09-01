import { createResponse } from "../../utils/createStatus";
import { readBody } from "#imports";

import { verifyUserAndtoken } from "../../controllers/users";

export default defineEventHandler(async (event) => {
    try {

        const { token, user_id } = await readBody(event);
        const response = await verifyUserAndtoken({ token, user_id })
        /* Comprobar si el token existe y esta bueno y luego comprobar si el id del usuario corresponde al token */

        return createResponse({ message: response.data }, response.status);

    } catch (error) { return createResponse({ message: 'Request error' }, 500); }
})