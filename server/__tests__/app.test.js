jest.mock("uuid", () => ({
    v4: () => "test-uuid",
}));

const request = require("supertest");
const createApp = require("../dist/app.js").default;

jest.setTimeout(20000);

const app = createApp("*");

test("GET /api/health should return 200", async() => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
});

test("User login should respond", async() => {
    const res = await request(app)
        .post("/api/auth/login")
        .send({
            email: "test@gmail.com",
            password: "123456"
        });

    expect(res.statusCode).toBeDefined();
});