import { createServer, Server, Socket } from "net";

import { pipe } from "fp-ts/lib/function";
import { error, info } from "fp-ts/lib/Console";
import { isString } from "fp-ts/lib/string";
import * as T from "fp-ts/lib/Task";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as IO from "fp-ts/lib/IO";
import * as O from "fp-ts/lib/Option";

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

type CreateServerFn = (
  connectionListener: (socket: Socket) => Promise<void>
) => Server;

export const run = (config: Config): IO.IO<void> =>
  pipe(
    handleConnection(config),
    createServer as CreateServerFn,
    listenServer(4000),
    IO.chain((server) =>
      pipe(
        O.fromNullable(server.address()),
        O.fold(
          () => "http server is running",
          (serverAddress) =>
            isString(serverAddress)
              ? `http server is running on address ${serverAddress}`
              : `http server is running on port ${serverAddress.port}`
        ),
        info
      )
    )
  );
