import { createResponse } from "../../utils/createStatus";
import { readBody } from "#imports";

import { getUserForLogin } from "../../controllers/users";

export default defineEventHandler(async (event) => {
    try {
        
        const { email, password } = await readBody(event);
        const user = await getUserForLogin({ email, password })

        return createResponse({ user }, user.status);

    } catch (error) { return createResponse({ message: 'Request error' }, 500); }
})