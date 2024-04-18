import config from "../../src/config/db/env.config.js";
import supertest from "supertest";
import { expect } from "chai";

const requester = supertest(config.rootUrl);

describe("Testing products api", () => {
    before(async function () {
        this.cookie;
        this.testUser = {
            first_name: "testProducts",
            last_name: "testProducts",
            email: config.adminMail,
            age: 30,
            password: config.adminPass,
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

    it("Traer todos los productos de la API", async function () {
        const result = await requester
            .get("/api/products")
            .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`]);

        // Assert
        expect(result.statusCode).to.eql(200);
    });

    it("Crear producto, el API POST /api/products debe generar un nuevo producto en la DB", async function () {
        const testProduct = {
            title: "Producto de prueba 01",
            description: "Esto es un producto de prueba",
            price: 500,
            code: "abc123",
            category: "test",
            stock: 10,
        };

        const { statusCode, _body } = await requester
            .post("/api/products")
            .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`])
            .send(testProduct);

        // Guardar el ID del producto creado
        this.productID = _body.product._id;

        // Assert
        expect(statusCode).to.eql(201);
    });

    it("Crear producto sin un campo, debe retornar un status 400 con error.", async function () {
        const testProduct = {
            // title: "Producto de prueba 01",
            description: "Esto es un producto de prueba",
            price: 500,
            code: "def456",
            category: "test",
            stock: 10,
        };

        const { statusCode, _body } = await requester
            .post("/api/products")
            .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`])
            .send(testProduct);

        // Assert
        expect(statusCode).to.eql(400);
        expect(_body).to.have.property("error");
    });

    it("Obtener un único producto por ID", async function () {
        const { statusCode, _body } = await requester
            .get(`/api/products/getProduct/${this.productID}`)
            .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`]);

        // Assert
        expect(statusCode).to.eql(200);
        expect(_body.product._id).to.eql(this.productID);
    });

    it("Modificar campos de un producto", async function () {
        const testProduct = {
            title: "Producto de prueba 01",
            description: "Estoy modificando un campo del producto de prueba",
            price: 500,
            code: "abc123",
            category: "test",
            stock: 10,
        };

        const { statusCode, _body } = await requester
            .put(`/api/products/${this.productID}`)
            .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`])
            .send(testProduct);

        // Assert
        expect(statusCode).to.eql(200);
        expect(_body.product.code).to.eql(testProduct.code);
        expect(_body.product.description).to.not.eql(testProduct.description);
    });

    it("Eliminar un producto", async function () {
        const { statusCode } = await requester
            .delete(`/api/products/${this.productID}`)
            .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`]);

        // Assert
        expect(statusCode).to.eql(200);

        // Verificar que el producto ha sido eliminado
        const result = await requester.get(`/api/products/${this.productID}`);
        expect(result.ok).to.eql(false);
    });
});