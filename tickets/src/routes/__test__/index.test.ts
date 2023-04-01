import request from "supertest";
import { app } from "../../app";

const path = "/api/tickets";

const createTicket = () => {
  return request(app)
    .post(path)
    .set("Cookie", global.signin())
    .send({ title: "first", price: 20 });
};

it("should return all tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const resp = await request(app).get(path).send().expect(200);
  expect(resp.body.length).toEqual(3);
});
