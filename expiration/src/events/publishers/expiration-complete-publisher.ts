import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@ao-ticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
