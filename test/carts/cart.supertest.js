import config from "../../src/config/db/env.config.js";
import supertest from "supertest";
import { expect } from "chai";

const requester = supertest(config.rootUrl);

describe("Testing products api", () => {
    before(async function () {
        this.cookie;
        this.testUser = {
            first_name: "testCart",
            last_name: "testCart",
            email: "testCart@gmail.com",
            age: 30,
            password: "123",
        };

        // Registrar usuario para pruebas
        await requester.post("/api/jwt/register").send(this.testUser);

        const loginTest = {
            email: this.testUser.email,
            password: this.testUser.password,
        };

        // Iniciar sesión del usuario
        const userLogin = await requester.post("/api/jwt/login").send(loginTest);

        const cookieResult = userLogin.headers["set-cookie"][0];

        // Extraer la cookie y guardarla en la variable global this.cookie
        const cookieData = cookieResult.split("=");
        this.cookie = {
            name: cookieData[0],
            value: cookieData[1],
        };
    });

    it("Traer todos los carritos de la API", async function () {
        const result = await requester
            .get("/api/carts")
            .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`]);

        // Assert
        expect(result.statusCode).to.eql(200);
        expect(Array.isArray(result.body.data)).to.be.true;
    });

    it("Crear un carrito en la DB", async function () {
        const testCart = {
            products: [],
        };

        const { statusCode, body } = await requester
            .post("/api/carts/")
            .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`])
            .send(testCart);

        // Assert
        expect(statusCode).to.eql(200);
        expect(body).to.not.be.empty;
        expect(body.data._id).to.be.ok;
        this.cartID = body.data._id;
    });

    it("Vaciar carrito", async function () {
        const { body, statusCode } = await requester
            .delete(`/api/carts/${this.cartID}`)
            .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`]);

        // Assert
        expect(statusCode).to.eql(200);
        expect(body.cart.products).to.be.empty;
    });
});