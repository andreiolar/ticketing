import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@ao-ticketing/common";
import { Message } from "node-nats-streaming";

import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: "abc",
  });

  await ticket.save();

  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "def",
    expiresAt: "pln",
    ticket: {
      id: ticket.id!,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("sets the userId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(ticketUpdatedData.orderId).toEqual(data.id);

  expect(msg.ack).toHaveBeenCalled();
});
