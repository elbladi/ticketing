import { OrderCancelleddEvent } from "@bladtickets/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const orderId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: "ticket",
    price: 10,
    userId: "123445",
  });
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelleddEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { ticket, data, msg, listener };
};

it("should update the ticket, publish an event and ack the message", async () => {
  const { ticket, data, msg, listener } = await setup();
  await listener.onMessage(data, msg);

  const ticketUpd = await Ticket.findById(ticket.id);
  expect(ticketUpd!.orderId).toBeUndefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
