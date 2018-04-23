import test from 'ava'
import logger from '../dist'
import { stderr } from './helpers/intercept'

import { resolve } from 'path'
import { existsSync, readFile, remove } from 'fs-extra'

const path = resolve(process.cwd(), 'temp.log')

const log = logger({
  file: { path }
})

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

test.after.always(async () => remove(path))

test('only writes errors by default', async t => {
  const restore = stderr(() => {})
  t.false(existsSync(path))
  log.silly('nothing')
  t.false(existsSync(path))

  log.error('happens')
  // yes I know this isn't ideal
  await sleep(1000)
  t.true(existsSync(path))

  const content = JSON.parse(await readFile(path, 'utf8'))

  t.is(content.level, 'error')
  t.deepEqual(content.input, ['happens'])

  restore()
})
