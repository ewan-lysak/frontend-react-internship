import { createServer, Server, Socket } from "net";

import { pipe } from "fp-ts/lib/function";
import { error } from "fp-ts/lib/Console";
import * as T from "fp-ts/lib/Task";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as IO from "fp-ts/lib/IO";

import { Config } from "./config";

const getHttpRequestHead = (req: string): string => req.split("\r\n")[0];

const getResponse =
  (config: Config) =>
  (reqHead: string): string =>
    reqHead === config.homeRequestHead
      ? config.homeResponse
      : config.notFoundResponse;

const sendReponse =
  (socket: Socket) =>
  (response: string): IO.IO<void> =>
  () => {
    socket.write(response);
    socket.end();
  };

const promisifySocketRequest =
  (socket: Socket): TE.TaskEither<Error, string> =>
  () =>
    new Promise((resolve, reject) => {
      socket.on("error", (err) => pipe(err, E.left, reject));
      socket.on("data", (chunk) => pipe(chunk.toString(), E.right, resolve));
    });

const handleConnection =
  (config: Config) =>
  (socket: Socket): Promise<void> =>
    pipe(
      TE.Do,
      TE.chain(() => promisifySocketRequest(socket)),
      TE.map(getHttpRequestHead),
      TE.map(getResponse(config)),
      TE.chain((response) => pipe(response, sendReponse(socket), TE.fromIO)),
      TE.fold((err) => T.fromIO(error(`err: ${err}`)), T.of)
    )();

const listenServer =
  (port: number) =>
  (server: Server): IO.IO<Server> =>
  () =>
    server.listen(port);

export const run = (config: Config): IO.IO<Server> =>
  pipe(
    handleConnection(config),
    (connectionListener) => createServer(connectionListener),
    listenServer(4000)
  );
