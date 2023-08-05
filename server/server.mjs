import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 7778 });

wss.on("connection", (client) => {
  console.log("New client");

  client.on("message", (data) => {
    const { userName, message } = JSON.parse(data.toString());
    const currentDate = new Date().toLocaleTimeString();
    const reply = `[${currentDate}] <b>${userName}</b>: ${message}`;

    wss.clients.forEach((client) => client.send(reply));
  });

  client.on("close", () => {
    console.log("Client left");
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = fastify();

server.register(fastifyStatic, {
  root: path.join(__dirname, "../client"),
});

server
  .listen({ port: 7777 })
  .then(() => {
    console.log("Server is running");
  })
  .catch((error) => {
    console.error(error);
  });
