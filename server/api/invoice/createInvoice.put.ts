import { createResponse } from "../../utils/createStatus";
import { readBody } from "#imports";

import { putCreateInvoice, createServiceByInvoice } from "~~/server/controllers/invoice";

export default defineEventHandler(async (event) => {
    try {

        /* abstracción */
        const {
            date,
            customer_name,
            customer_phone_1,
            customer_phone_2,
            vehicle_name,
            vehicle_year,
            vehicle_licence_plate,
            vehicle_vin,
            sub_total,
            tax,
            total,
            services
        } = await readBody(event);

        /* Creación invoice y devuelta ID */
        const invoice = await putCreateInvoice({
            date,
            customer_name,
            customer_phone_1,
            customer_phone_2,
            vehicle_name,
            vehicle_year,
            vehicle_licence_plate,
            vehicle_vin,
            sub_total,
            tax,
            total
        })

        if (invoice.status !== 200 || !invoice.data) {
            return createResponse({ invoice }, 404);
        }

        let invoice_id = invoice.data?.id

        /* Creación servicio */
        const response = await createServiceByInvoice({ invoice_id, services })

        return createResponse({ response }, response.status);

    } catch (error) {
        console.log(error)
        return createResponse({ message: 'Request error' }, 500);
    }
})