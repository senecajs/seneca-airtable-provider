/* Copyright © 2022 Seneca Project Contributors, MIT License. */

import * as Fs from 'fs'

const Seneca = require('seneca')
const SenecaMsgTest = require('seneca-msg-test')
const { Maintain } = require('@seneca/maintain')

import AirtableProvider from '../src/airtable-provider'
import AirtableProviderDoc from '../src/AirtableProvider-doc'

const BasicMessages = require('./basic.messages.js')

// Only run some tests locally (not on Github Actions).
let Config: undefined = undefined
if (Fs.existsSync(__dirname + '/local-config.js')) {
  Config = require('./local-config')
}

describe('airtable-provider', () => {
  test('happy', async () => {
    expect(AirtableProvider).toBeDefined()
    expect(AirtableProviderDoc).toBeDefined()

    const seneca = await makeSeneca()

    expect(
      await seneca.post('sys:provider,provider:airtable,get:info')
    ).toMatchObject({
      ok: true,
      name: 'airtable',
    })
  })

  test('messages', async () => {
    const seneca = await makeSeneca()
    await SenecaMsgTest(seneca, BasicMessages)()
  })

  test('base-list', async () => {
    if (!Config) return
    const seneca = await makeSeneca()

    // does this:  const base = await Airtable.bases();
    const bases = await seneca.entity('provider/airtable/base').list$()

    expect(bases.length > 0).toBeTruthy()
  })
})

async function makeSeneca() {
  const seneca = Seneca({ legacy: false })
    .test()
    .use('promisify')
    .use('entity')
    .use('env', {
      // debug: true,
      file: [__dirname + '/local-env.js;?'],
      var: {
        $AIRTABLE_ACCESSTOKEN: String,
      },
    })
    .use('provider', {
      provider: {
        airtable: {
          keys: {
            accesstoken: { value: '$AIRTABLE_ACCESSTOKEN' },
          },
        },
      },
    })
    .use(AirtableProvider)

  return seneca.ready()
}
