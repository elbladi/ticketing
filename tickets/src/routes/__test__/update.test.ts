import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if provided id doesnt exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "adsa", price: 20 })
    .expect(404);
});
it("returns a 401 if user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "adsa", price: 20 })
    .expect(401);
});
it("returns a 401 if user doesnt own the ticket", async () => {
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "sad", price: 10 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "updated", price: 123456 })
    .expect(401);
});
it("returns a 400 if provided invalid title or price", async () => {
  const cookie = global.signin();
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "sad", price: 10 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 10 })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "valid title", price: -10 })
    .expect(400);
});
it("updates the ticket with valid inputs", async () => {
  const cookie = global.signin();
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "sad", price: 10 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "valid title", price: 1010 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const resp = await request(app)
    .get(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send();

  expect(resp.body.title).toEqual("valid title");
  expect(resp.body.price).toEqual(1010);
});

it("rejects updates if ticket is reserved", async () => {
  const cookie = global.signin();
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "sad", price: 10 })
    .expect(201);

  const foundTicket = await Ticket.findById(ticket.body.id);
  foundTicket!.set({ orderId: "1234" });
  await foundTicket!.save();

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "valid title", price: 1010 })
    .expect(400);
});
