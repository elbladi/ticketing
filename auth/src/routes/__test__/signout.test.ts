import request from "supertest";
import { app } from "../../app";

it("clears cookie when signout", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@Test.com", password: "password" })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@Test.com", password: "password" })
    .expect(200);

  const resp = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  expect(resp.get("Set-Cookie")[0]).toBe(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
