// Two API endpoints for products to perform read, write operations
import { conn } from "@/app/db.js";

/**
 * @param request HTTP GET request with product name
 * @returns list of products from database
 */
export const GET = async (req, params, res) => {
  try {
    const query = `SELECT p.product_id, p.price, p.product_name 
                    FROM pos.product p`;
    const response = await conn.query(query);

    return Response.json(response.rows);
  } catch (error) {
    return Response.json({ message: error.message });
  }
}

/**
 * @param request HTTP POST request body of type application/json 
 * which is list of products to store in database
 * @returns boolean value of true if successful
 */

