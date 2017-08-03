import test from 'ava'
import chalk from 'chalk'
import Neue from '../dist'
import { stdout, stderr } from './helpers/intercept'

const log = Neue.create()

test('non-error levels send the input to stdout', t => {
  const expected = chalk.green('info') + ': hello\n'
  const restore = stdout(actual => t.is(actual, expected))
  log.info('hello')
  restore()
})

test('error levels send the input to stderr', t => {
  const expected = chalk.red.bgBlack('error') + ': fail\n'
  const restore = stderr(actual => t.is(actual, expected))
  log.error('fail')
  restore()
})
