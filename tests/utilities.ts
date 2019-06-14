import test from 'ava'
import logger from '../src'

const log = logger()

test('`getLevelByNumber()`', t => {
  t.is(log.getLevelByNumber(0), 'error')
  t.is(log.getLevelByNumber(1), 'warn')
  t.is(log.getLevelByNumber(2), 'info')
  t.is(log.getLevelByNumber(3), 'verbose')
  t.is(log.getLevelByNumber(4), 'debug')
  t.is(log.getLevelByNumber(5), 'silly')
})

test('`getNumberOfLevel()`', t => {
  t.is(log.getNumberOfLevel('error'), 0)
  t.is(log.getNumberOfLevel('warn'), 1)
  t.is(log.getNumberOfLevel('info'), 2)
  t.is(log.getNumberOfLevel('verbose'), 3)
  t.is(log.getNumberOfLevel('debug'), 4)
  t.is(log.getNumberOfLevel('silly'), 5)
})

test('`getLevels()`', t => {
  t.deepEqual(
    log.getLevelNames(),
    ['error', 'warn', 'info', 'verbose', 'debug', 'silly']
  )
})

test('`getConsoleLevel()` & `setConsoleLevel()`', t => {
  t.is(log.getConsoleLevel(), 2)
  log.setConsoleLevel(3)
  t.is(log.getConsoleLevel(), 3)
})

test('`getFileLevel()` & `setFileLevel()`', t => {
  t.is(log.getFileLevel(), -1)

  const temp = logger({
    file: {
      path: 'temp.txt'
    }
  })

  t.is(temp.getFileLevel(), 0)
  temp.setFileLevel(3)
  t.is(temp.getFileLevel(), 3)
})

test('`pre` events support preventing logs', t => {
  log.on('log', () => {
    t.fail('Log was not prevented as expected.')
  })

  log.on('pre:log', ({ prevent }) => {
    prevent()
  })

  log.info('this should never be seen')

  t.pass()
})
