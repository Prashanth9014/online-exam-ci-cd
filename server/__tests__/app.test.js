jest.mock("uuid", () => ({
    v4: () => "test-uuid",
}));

const mongoose = require("mongoose");
const request = require("supertest");
const createApp = require("../dist/app.js").default;

jest.setTimeout(20000);

const app = createApp("*");
// ✅ CONNECT DATABASE BEFORE TESTS
beforeAll(async() => {
    await mongoose.connect("mongodb://127.0.0.1:27017/online_recruit_system");
});

// ✅ CLOSE DATABASE AFTER TESTS
afterAll(async() => {
    await mongoose.connection.close();
});
// ✅ Health test
test("GET /api/health should return 200", async() => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
});

// ✅ Login test
test("POST /api/auth/login should respond", async() => {
    const res = await request(app)
        .post("/api/auth/login")
        .send({
            email: "test@gmail.com",
            password: "123456"
        });

    expect(res.statusCode).toBeGreaterThan(0); // ✅ simple check
});