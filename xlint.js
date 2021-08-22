'use strict'
const { spawnSync } = require('child_process')

function getListFromShell (shell, options = { shell: true }) {
  const result = spawnSync(shell, options)

  return result
}

function getDiffFiles (commit = 'HEAD', anotherCommit = 'origin/master') {
  const shell = `git --no-pager diff ${commit} ${anotherCommit} --stat --name-only '**/*.js'`
  const diffFiles = getListFromShell(shell)

  return diffFiles
}

const diffList = getDiffFiles(
  'HEAD',
  'origin/master'
)

console.log('diffList ==>', diffList)

if (Array.isArray(diffList) && diffList.length) {
  const lintProcess = spawnSync(
    'npx eslint',
    diffList,
    {
      stdio: ['inherit', 'inherit', 'pipe'],
      shell: true
    }
  )
  const errMsg = lintProcess.stderr.toString()
  if (errMsg) {
    console.error(errMsg)
    process.exit(1)
  } else {
    console.log('well done. lint pass!')
  }
} else {
  console.log('本次无须 diff lint.')
}
