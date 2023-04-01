import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

describe("NEW route", () => {
  let cookie: string[];
  const api_tickets = "/api/tickets";
  beforeAll(() => {
    cookie = global.signin();
  });

  it("has a route handler listening to /api/tickets for post requests", async () => {
    const response = await request(app).post(api_tickets).send({});

    expect(response.status).not.toEqual(404);
  });

  it("can only be accessed if the user is signed in", async () => {
    await request(app).post(api_tickets).send({}).expect(401);
  });

  it("returns a status other than 401 if the user is signed in", async () => {
    const response = await request(app)
      .post(api_tickets)
      .set("Cookie", cookie)
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it("returns an error if an invalid title is provided", async () => {
    await request(app)
      .post(api_tickets)
      .set("Cookie", cookie)
      .send({
        title: "",
        price: 10,
      })
      .expect(400);
    await request(app)
      .post(api_tickets)
      .set("Cookie", cookie)
      .send({
        price: 10,
      })
      .expect(400);
  });

  it("returns an error if an invalid price is provided", async () => {
    await request(app)
      .post(api_tickets)
      .set("Cookie", cookie)
      .send({
        title: "Valid title",
        price: 0,
      })
      .expect(400);
    await request(app)
      .post(api_tickets)
      .set("Cookie", cookie)
      .send({
        title: "Valid title",
      })
      .expect(400);
  });

  it("creates a ticket with valid inputs", async () => {
    // Get all tickets availables
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
      .post(api_tickets)
      .set("Cookie", cookie)
      .send({ title: "asdasd", price: 20 })
      .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
  });
  it("publishes an event", async () => {
    await request(app)
      .post(api_tickets)
      .set("Cookie", cookie)
      .send({ title: "asdasd", price: 20 })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
