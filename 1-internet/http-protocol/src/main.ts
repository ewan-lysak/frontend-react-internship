import { pipe } from "fp-ts/lib/function";
import { isString } from "fp-ts/lib/string";
import { info, error } from "fp-ts/lib/Console";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import * as O from "fp-ts/lib/Option";

import { getConfigFromJson } from "./config";
import { run } from "./app";

const main = pipe(
  TE.Do,
  TE.chain(() => getConfigFromJson("./config.json")),
  TE.chain((config) => TE.fromIO(run(config))),
  TE.fold(
    (err) => T.fromIO(error(`err: ${err}`)),
    (server) =>
      pipe(
        O.fromNullable(server.address()),
        O.fold(
          () => `http server is running`,
          (serverAddress) =>
            isString(serverAddress)
              ? `http server is running on address ${serverAddress}`
              : `http server is running on port ${serverAddress.port}`
        ),
        info,
        T.fromIO
      )
  )
);

main();
