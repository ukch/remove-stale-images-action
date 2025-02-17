import * as core from '@actions/core'
import { context } from '@actions/github'
import stale from './stale'
import GHAPI, { QueryTypes } from './ghapi'

async function run(): Promise<void> {
  try {
    const user = context.repo.owner
    const queryType = core.getInput('organization') ? QueryTypes.organization : QueryTypes.user
    const token = core.getInput('token')
    const packages = core.getInput('packages').split(',')
    const keep = parseInt(core.getInput('keep'))

    core.info(`ℹ I will keep the latest ${keep} versions of each package.`)

    await stale(user, queryType, packages, keep, new GHAPI(token), core.info)
  } catch (error) {
    core.debug(error)

    core.setFailed(error.message)
  }
}

run()
