import { readFile } from "fs/promises";

import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import * as J from "fp-ts/lib/Json";

export type Config = {
  homeRequestHead: string;
  homeResponse: string;
  notFoundResponse: string;
};

const getFileContents = (path: string): TE.TaskEither<Error, string> =>
  TE.tryCatch(() => readFile(path, "utf-8"), E.toError);

export const getConfigFromJson = (path: string) =>
  pipe(
    TE.Do,
    TE.chain(() => getFileContents(path)),
    TE.chain((contents) =>
      TE.fromEither(J.parse(contents) as E.Either<unknown, Config>)
    )
  );
