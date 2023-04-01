import { Publisher, OrderCancelleddEvent, Subjects } from "@bladtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelleddEvent> {
  readonly subject = Subjects.OrderCancelled;
}
