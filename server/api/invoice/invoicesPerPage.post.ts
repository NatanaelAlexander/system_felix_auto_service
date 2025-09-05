import { createResponse } from "../../utils/createStatus";
import { readBody } from "#imports";
import { sourceInvoicesPerPage } from "~~/server/controllers/invoice";

export default defineEventHandler(async (event) => {
    try {

        /* abstracción */
        const {
            page
        } = await readBody(event);

        const response = await sourceInvoicesPerPage({ page })
        if (response.status !== 200) {
            return createResponse({ response }, 400)
        }
        /* const invoices: any[] = response.data ? JSON.parse(response.data) : []
        return createResponse({ invoices }, 200); */
        return createResponse({ response }, 200);



    } catch (error) {
        console.log(error)
        return createResponse({ message: 'Request error' }, 500);
    }
})