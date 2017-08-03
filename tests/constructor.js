import test from 'ava'
import LoggerNeue from '../dist'

test('creates a new instance', t => {
  const log = new LoggerNeue()
  t.true(log != null)
  t.is(typeof log.log, 'function')
})

test('`create()` method constructs a new instance', t => {
  const log = LoggerNeue.create()
  t.true(log != null)
  t.is(typeof log.log, 'function')
})

test('constructor throws if `options` is not an object', t => {
  t.notThrows(() => new LoggerNeue())
  t.notThrows(() => LoggerNeue.create())
  t.notThrows(() => new LoggerNeue({}))
  t.notThrows(() => LoggerNeue.create({}))

  t.throws(() => new LoggerNeue('failure'))
  t.throws(() => LoggerNeue.create('failure'))
})

test('`options.levels` overrides default levels', t => {
  const log = LoggerNeue.create({
    levels: {
      lone: [0, 'cyan']
    }
  })

  t.deepEqual(log.getLevelNames(), ['lone'])
})

test('`options.levels` allows both array & object definitions', t => {
  const log = LoggerNeue.create({
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
