import test from "ava"
import logger from "../src"
import { stderr } from "./helpers/intercept"

import { resolve } from "path"
import { existsSync, readFile, unlink } from "fs"
import { promisify } from "util"

const unlinkAsync = promisify(unlink)
const readFileAsync = promisify(readFile)

const path = resolve(process.cwd(), "temp.log")

const log = logger({
  file: { path }
})

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

test.after.always(async () => unlinkAsync(path))

test("only writes errors by default", async t => {
  const restore = stderr(() => {})
  t.false(existsSync(path))
  log.silly("nothing")
  t.false(existsSync(path))

  log.error("happens")
  // yes I know this isn't ideal
  await sleep(1000)
  t.true(existsSync(path))

  const content = JSON.parse(await readFileAsync(path, "utf8"))

  t.is(content.level, "error")
  t.deepEqual(content.input, ["happens"])

  restore()
})
