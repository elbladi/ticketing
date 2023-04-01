import { Publisher, Subjects, TicketUpdatedEvent } from "@bladtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
