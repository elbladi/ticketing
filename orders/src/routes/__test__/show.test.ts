import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/orders";
import { Ticket } from "../../models/tickets";

it("fetches the order", async () => {
  const cookie = global.signin();
  const ticket = Ticket.build({
    title: "hotel",
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
  });
  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const resp = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(resp.body.id).toEqual(order.id);
});

it("returns error if tries to fetch other's user order", async () => {
  const cookie = global.signin();
  const ticket = Ticket.build({
    title: "hotel",
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
  });
  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});
