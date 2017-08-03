import test from 'ava'
import Neue from '../dist'
import { stderr } from './helpers/intercept'

test('adds a new level to the instance', t => {
  const log = Neue.create()

  log.addLevel('foobar', {
    level: 42,
    colors: ['bold', 'blue']
  })

  t.is(typeof log.foobar, 'function')
  t.deepEqual(
    log.getLevelNames(),
    ['error', 'warn', 'info', 'verbose', 'debug', 'silly', 'foobar']
  )
})

test('also allows more concise array syntax', t => {
  const log = Neue.create()

  log.addLevel('barbaz', [99, ['red', 'bgYellow']])

  t.is(typeof log.barbaz, 'function')
  t.deepEqual(
    log.getLevelNames(),
    ['error', 'warn', 'info', 'verbose', 'debug', 'silly', 'barbaz']
  )
})

test('supports adding new error levels', t => {
  t.plan(5)

  const log = Neue.create({ console: { level: 7 } })

  log.addLevel('err1', [6, ['red', 'bgYellow'], true])
  log.addLevel('err2', {
    level: 7,
    colors: ['red', 'bgYellow'],
    isError: true
  })

  t.is(typeof log.err1, 'function')
  t.is(typeof log.err2, 'function')

  t.deepEqual(
    log.getLevelNames(),
    ['error', 'warn', 'info', 'verbose', 'debug', 'silly', 'err1', 'err2']
  )

  const restore = stderr(result => t.regex(result, /fail/))

  log.err1('fail')
  log.err2('fail')

  restore()
})
