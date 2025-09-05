import { createResponse } from "../../utils/createStatus";
import { readBody } from "#imports";
import { sourceFilterInvoices } from "~~/server/controllers/invoice";

export default defineEventHandler(async (event) => {
    try {

        /* abstracción */
        const {
            page,
            filter,
            date
        } = await readBody(event);

        const response = await sourceFilterInvoices({ page, filter, date })
        if (response.status !== 200) {
            return createResponse({ response }, 400)
        }
        
        return createResponse({ response }, 200);

    } catch (error) {
        console.log(error)
        return createResponse({ message: 'Request error' }, 500);
    }
})
