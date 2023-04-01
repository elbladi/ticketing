import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

describe("show", () => {
  const api_tickets = "/api/tickets";
  it("returns 404 if ticket is not found", async () => {
    const valid_id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`${api_tickets}/${valid_id}`).send().expect(404);
  });

  it("returns ticket if is found", async () => {
    const title = "my title";
    const price = 20;
    const resp = await request(app)
      .post(api_tickets)
      .set("Cookie", global.signin())
      .send({ title, price })
      .expect(201);

    const ticketResp = await request(app)
      .get(`${api_tickets}/${resp.body.id}`)
      .send()
      .expect(200);

    expect(ticketResp.body.title).toEqual(title);
    expect(ticketResp.body.price).toEqual(price);
  });
});
