import express from "express";
import cookieSession from "cookie-session";
import "express-async-errors";
import { json } from "body-parser";
import { errorHandler, NotFoundError, currentUser } from "@ao-ticketing/common";

import { createTicketRouter } from "./routes/create";
import { readTicketRouter } from "./routes/read";
import { readAllTicketsRouter } from "./routes/read-all";
import { updateTicketRouter } from "./routes/update";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

app.use(createTicketRouter);
app.use(readTicketRouter);
app.use(readAllTicketsRouter);
app.use(updateTicketRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
