import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  return ticket;
};

it("fetches orders for a particular user", async () => {
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = global.signin();
  const userTwo = global.signin();

  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  const orderTwo = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const orderThree = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderTwo.body.id);
  expect(response.body[1].id).toEqual(orderThree.body.id);
});
