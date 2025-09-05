import { createResponse } from "../../utils/createStatus";
import { readBody } from "#imports";
import { deleteServiceByIdOfInvoice, deleteInvoiceByID } from "~~/server/controllers/invoice";

export default defineEventHandler(async (event) => {
    try {

        /* abstracción */
        const {
            invoice_id
        } = await readBody(event);

        const deleteService = await deleteServiceByIdOfInvoice({ invoice_id })
        if (deleteService.status !== 200) {
            return createResponse({ deleteService }, deleteService.status);
        }

        const deleteInvoice = await deleteInvoiceByID({ invoice_id })
        if (deleteInvoice.status !== 200) {
            return createResponse({ deleteInvoice }, deleteInvoice.status);
        }

        return createResponse({ message: 'delete success' }, 200);

    } catch (error) {
        console.log(error)
        return createResponse({ message: 'Request error' }, 500);
    }
})