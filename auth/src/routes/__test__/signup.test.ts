import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@Test.com", password: "password" })
    .expect(201);
});

it("return a 400 when email is invalid", () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "testsaom", password: "password" })
    .expect(400);
});

it("return a 400 when pswd is invalid", () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@Test.com", password: "a" })
    .expect(400);
});

it("return a 400 with missing email & password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "email@test.com" })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({ password: "email@test.com" })
    .expect(400);
});
it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@Test.com", password: "password" })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@Test.com", password: "password" })
    .expect(400);
});
it("should send the jdk cookie header whe successful signup", async () => {
  const resp = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@Test.com", password: "password" })
    .expect(201);

  expect(resp.get("Set-Cookie")).toBeDefined();
});
