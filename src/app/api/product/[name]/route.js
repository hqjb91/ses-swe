// API endpoint for products to perform read operation
import { conn } from "@/app/db.js";

/**
 * @param request HTTP GET request with product name
 * @returns product based on requested product name from database
 */
export const GET = async (req, params, res) => {
  const { name } = params.params;

  try {
    const query = `SELECT product_id, price, product_name 
                    FROM pos.product WHERE product_name = $1`;
    const response = await conn.query(query, [name]);

    return Response.json(response.rows);
  } catch (error) {
    return Response.json({ message: error.message });
  }
}