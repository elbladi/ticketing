import { TicketCreatedEvent } from "@bladtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/tickets";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "my test",
    version: 0,
    userId: "1232",
    price: 200,
  };

  // create a message obj
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  // call onMessage with the mocked data
  await listener.onMessage(data, msg);

  // ensure a ticket was created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});
it("should ack the message", async () => {
  const { listener, data, msg } = await setup();

  // call onMessage with the mocked data
  await listener.onMessage(data, msg);

  // ensure ack is called
  expect(msg.ack).toHaveBeenCalled();
});
