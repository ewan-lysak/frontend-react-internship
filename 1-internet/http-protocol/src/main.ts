import { pipe } from "fp-ts/lib/function";
import { error } from "fp-ts/lib/Console";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";

import { getConfigFromJson } from "./config";
import { run } from "./app";

const main = pipe(
  TE.Do,
  TE.chain(() => getConfigFromJson("./config.json")),
  TE.chain((config) => TE.fromIO(run(config))),
  TE.fold((err) => T.fromIO(error(`err: ${err}`)), T.of)
);

main();
