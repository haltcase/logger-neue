import test from 'ava'
import logger, { LoggerNeue } from '../dist'

test('creates a new instance', t => {
  const log = new LoggerNeue()
  t.true(log != null)
  t.is(typeof log.log, 'function')
})

test('constructor throws if `options` is not an object', t => {
  t.notThrows(() => new LoggerNeue())
  t.notThrows(() => new LoggerNeue({}))
  t.throws(() => new LoggerNeue('failure'))

  t.notThrows(() => logger())
  t.notThrows(() => logger({}))
  t.throws(() => logger('failure'))
})

test('`options.levels` overrides default levels', t => {
  const log = logger({
    levels: {
      lone: [0, 'cyan']
    }
  })

  t.deepEqual(log.getLevelNames(), ['lone'])
})

test('`options.levels` allows both array & object definitions', t => {
  const log = logger({
    levels: {
      first: [0, 'cyan'],
      second: {
        level: 1,
        colors: ['red', 'bold', 'underline']
      }
    }
  })

  t.deepEqual(log.getLevelNames(), ['first', 'second'])
})
