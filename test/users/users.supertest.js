import mongoose from "mongoose";
import config from "../../src/config/db/env.config.js";
import supertest from "supertest";
import { expect } from "chai";

const requester = supertest(config.rootUrl);

describe("Testing session usando cookies", () => {
    let cookie;
    let testUser = {
        first_name: "testUser",
        last_name: "testUser",
        email: "testUser@gmail.com",
        age: 30,
        password: "123",
    };
    let userID;

    it("Registrar correctamente al usuario", async () => {
        const { statusCode } = await requester
            .post("/api/jwt/register")
            .send(testUser);

        expect(statusCode).to.eql(201);
    });

    it("No registrar al usuario si el email ya existe", async () => {
        const { statusCode } = await requester
            .post("/api/jwt/register")
            .send(testUser);

        expect(statusCode).to.eql(302);
    });

    it("Loguear correctamente al usuario", async () => {
        const loginTest = {
            email: testUser.email,
            password: testUser.password,
        };

        const result = await requester.post("/api/jwt/login").send(loginTest);

        const cookieResult = result.headers["set-cookie"][0];

        userID = result.body._id;

        expect(result.statusCode).to.eql(200);

        const cookieData = cookieResult.split("=");
        cookie = {
            name: cookieData[0],
            value: cookieData[1],
        };

        expect(cookie.name).to.eql("jwtCookieToken");
        expect(cookie.value).to.be.ok;
    });

    it("Traer al usuario buscado por ID", async () => {
        const result = await requester
            .get(`/api/users/${userID}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(result.statusCode).to.eql(200);
    });
});