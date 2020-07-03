import test from 'ava'
import logger, { LoggerNeue, Style } from '../src'

test('creates a new instance', t => {
  const log = new LoggerNeue()
  t.true(log != null)
  t.is(typeof log.log, 'function')
})

test('constructor throws if `options` is not an object', t => {
  t.notThrows(() => new LoggerNeue())
  t.notThrows(() => new LoggerNeue({}))
  t.notThrows(() => logger())
  t.notThrows(() => logger({}))

  // @ts-expect-error
  t.throws(() => new LoggerNeue('failure'))

  // @ts-expect-error
  t.throws(() => logger('failure'))
})

test('`options.levels.style` throws on invalid styles', t => {
  t.throws(() =>
    logger({
      levels: {
        // @ts-expect-error
        YELL: [0, 'loud']
      }
    })
  )
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
