import { TicketUpdatedEvent } from "@ao-ticketing/common";
import mongoose from "mongoose";

import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id!,
    version: ticket.version + 1,
    title: "new concert",
    price: 999,
    userId: mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("finds, updates, and saves the ticket", async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async (done) => {
  const { msg, data, ticket, listener } = await setup();
  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    done();
  }

  expect(msg.ack).not.toHaveBeenCalled();
});
