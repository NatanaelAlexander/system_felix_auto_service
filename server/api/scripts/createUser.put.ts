import { createResponse } from "../../utils/createStatus";
import { readBody } from "#imports";
/* ESto no se debiera de subri a github ctm */
/* ESto no se debiera de subri a github ctm */
/* ESto no se debiera de subri a github ctm */
/* ESto no se debiera de subri a github ctm */
/* ESto no se debiera de subri a github ctm */
/* ESto no se debiera de subri a github ctm */
/* ESto no se debiera de subri a github ctm */
/* ESto no se debiera de subri a github ctm */
/* ESto no se debiera de subri a github ctm */
/* ESto no se debiera de subri a github ctm */
/* ESto no se debiera de subri a github ctm */
/* ESto no se debiera de subri a github ctm */
import { putUserCreate } from "~~/server/controllers/users";

export default defineEventHandler(async (event) => {
    try {

        const { email, password, rol_id, name } = await readBody(event);
        const user = await putUserCreate({ email, password, rol_id, name })

        return createResponse({ user }, user.status);

    } catch (error) { return createResponse({ message: 'Error con la solicitud' }, 500); }
})