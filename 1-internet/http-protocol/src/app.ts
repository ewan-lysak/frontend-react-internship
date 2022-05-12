import { createServer, Server, Socket } from "net";

import { pipe } from "fp-ts/lib/function";
import { error } from "fp-ts/lib/Console";
import * as IO from "fp-ts/lib/IO";

import { Config } from "./config";

const getReqFromChunk = (chunk: Buffer): string => chunk.toString();

const getReqHead = (req: string): string => req.split("\r\n")[0];

const getResponse =
  (config: Config) =>
  (reqHead: string): string =>
    reqHead === config.homeRequestHead
      ? config.homeResponse
      : config.notFoundResponse;

const sendReponse = (socket: Socket) => (response: string) => {
  socket.write(response);
  socket.end();
};

const handleConnection = (config: Config) => (socket: Socket) => {
  socket.on("error", (err) => {
    error(`err: ${err}`)();
  });

  socket.on("data", (chunk) =>
    pipe(
      getReqFromChunk(chunk),
      getReqHead,
      getResponse(config),
      sendReponse(socket)
    )
  );
};

const listenServer =
  (port: number) =>
  (server: Server): IO.IO<Server> =>
  () =>
    server.listen(port);

export const run = (config: Config): IO.IO<Server> =>
  pipe(
    handleConnection(config),
    createServer as (connectionListener?: (socket: Socket) => void) => Server,
    listenServer(4000)
  );
