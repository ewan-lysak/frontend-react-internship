import { pipe } from "fp-ts/lib/function";
import { info, error } from "fp-ts/lib/Console";
import * as TE from "fp-ts/lib/TaskEither";

import { getConfigFromJson } from "./config";
import { run } from "./app";

const main = pipe(
  TE.Do,
  getConfigFromJson,
  TE.chain((config) => TE.fromIO(run(config))),
  TE.fold(
    (err) => TE.fromIO(error(`err: ${err}`)),
    () => TE.fromIO(info(`http server is running`))
  )
);

main();
