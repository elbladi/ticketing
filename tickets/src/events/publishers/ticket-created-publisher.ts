import { Publisher, Subjects, TicketCreatedEvent } from "@bladtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
