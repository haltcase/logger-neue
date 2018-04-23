import test from 'ava'
import chalk from 'chalk'
import logger from '../dist'
import { stdout, stderr } from './helpers/intercept'

const log = logger()

const CRLF = /\r\n/g

test('non-error levels send the input to stdout', t => {
  const expected = chalk.green('info') + ': hello\n'
  const restore = stdout(actual => t.is(actual.replace(CRLF, '\n'), expected))
  log.info('hello')
  restore()
})

test('error levels send the input to stderr', t => {
  const expected = chalk.red.bgBlack('error') + ': fail\n'
  const restore = stderr(actual => t.is(actual.replace(CRLF, '\n'), expected))
  log.error('fail')
  restore()
})
