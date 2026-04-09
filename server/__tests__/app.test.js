jest.mock("uuid", () => ({
    v4: () => "test-uuid",
}));

const request = require("supertest");
const createApp = require("../dist/app.js").default;

jest.setTimeout(10000);

const app = createApp("*");

test("GET /api/health should return 200", async() => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
});