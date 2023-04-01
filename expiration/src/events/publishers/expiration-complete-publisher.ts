import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@bladtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
