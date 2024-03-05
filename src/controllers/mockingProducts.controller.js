import { generateProduct } from "../utils.js";

export const getMockProducts = async (req, res) => {
    try {
        let products = [];
        for (let i = 0; i < 50; i++) {
            products.push(generateProduct());
        }
        res.send({ status: "succes", payload: products });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({ error: error, message: "No se pueden obtener los productos." });
    }
};