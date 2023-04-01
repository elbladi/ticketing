import request from "supertest";
import { app } from "../../app";

it("returns a 400 when email does not exist", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({ email: "test@Test.com", password: "password" })
    .expect(400);
});
it("returns a 400 when password is wrong", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@Test.com", password: "password" })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@Test.com", password: "wrongPassword" })
    .expect(400);
});

it("should send the jdk cookie header when successful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@Test.com", password: "password" })
    .expect(201);

  const resp = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@Test.com", password: "password" })
    .expect(200);
  expect(resp.get("Set-Cookie")).toBeDefined();
});
