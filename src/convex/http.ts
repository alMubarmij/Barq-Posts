import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { handleUpdate } from "./telegram";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/api/telegram/webhook",
  method: "POST",
  handler: handleUpdate,
});

export default http;
