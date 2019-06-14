export default {
  compileEnhancements: false,
  extensions: [
    "ts"
  ],
  files: [
    'tests/**/*.ts'
  ],
  helpers: [
    'tests/helpers/**/*.ts'
  ],
  require: [
    'ts-node/register'
  ]
}
