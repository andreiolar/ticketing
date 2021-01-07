import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("marks an order as canelled", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.status).toEqual(OrderStatus.Cancelled);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
