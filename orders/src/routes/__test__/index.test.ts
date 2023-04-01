import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/orders";
import { Ticket } from "../../models/tickets";

const createTicket = async () => {
  const ticket = Ticket.build({
    title: "hotel",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  return ticket;
};

it("should return user orders", async () => {
  const ticket_1 = await createTicket();
  const ticket_2 = await createTicket();
  const ticket_3 = await createTicket();

  // Create order as user 1
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket_1.id })
    .expect(201);

  // Create 2 orders as user 2
  const cookie = global.signin();
  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket_2.id })
    .expect(201);
  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket_3.id })
    .expect(201);

  // request to get only orders of user 2
  const resp = await request(app)
    .get("/api/orders")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(resp.body.length).toEqual(2);
  expect(resp.body[0].id).toEqual(order1.id);
  expect(resp.body[1].id).toEqual(order2.id);
});
