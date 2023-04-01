import {
  Listener,
  OrderCancelleddEvent,
  OrderStatus,
  Subjects,
} from "@bladtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queueGroupName";

export class OrderCancelledListener extends Listener<OrderCancelleddEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelleddEvent["data"], msg: Message) {
    const order = await Order.findByVersion({
      id: data.id,
      version: data.version,
    });

    if (!order) throw Error(`Order ${data.id} not found`);
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
