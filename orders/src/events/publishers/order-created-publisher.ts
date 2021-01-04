import { Publisher, OrderCreatedEvent, Subjects } from "@ao-ticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
