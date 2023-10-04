// Two API endpoints for orders to perform read, write operations
import { conn } from "@/app/db.js";

/**
 * @param request HTTP GET request 
 * @returns list of orders in database
 */
export const GET = async (req, params, res) => {
  try {
    const query = `SELECT o.order_id, o.quantity, p.product_name, p.price
                    FROM pos.order o
                    JOIN pos.product p
                    ON o.product_id = p.product_id`;
    const response = await conn.query(query);

    return Response.json(response.rows);
  } catch (error) {
    return Response.json({ message: error.message });
  }
}

/**
 * @param request HTTP POST request body of type application/json 
 * which is list of orders to store in database
 * @returns boolean value of true if successful
 */
export const POST = async (req, params, res) => {
  try {
    const requestBody = await req.json();
    for (let input in requestBody) {
      console.log(requestBody[input]['product'])
      console.log(requestBody[input]['quantity'])
      const query = `INSERT INTO pos.order (product_id, quantity) VALUES 
                     ((SELECT product_id FROM pos.product WHERE product_name = $1::text), $2)`;
      await conn.query(query, [requestBody[input]['product'], requestBody[input]['quantity']]);
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ message: error.message });
  }
}
