import request from "supertest";
import app from "./app";

describe("POST /auth/register", () => {
  test("return 400 when email is missing", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ password: "test123" });

    expect(response.status).toBe(400);
  });

  test("return 400 when password is missing", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ email: "test@example.com" });

    expect(response.status).toBe(400);
  });

  test("creates a new user with valid data", async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    const response = await request(app)
      .post("/auth/register")
      .send({ email: uniqueEmail, password: "test123" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe(uniqueEmail);
    expect(response.body).not.toHaveProperty("password");
  });
});
