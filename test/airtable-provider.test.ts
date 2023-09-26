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

describe('Airtable-provider', () => {
  test('happy', async () => {
    expect(AirtableProvider).toBeDefined()
    expect(AirtableProviderDoc).toBeDefined()

    const seneca = await makeSeneca()

    expect(
      await seneca.post('sys:provider,provider:Airtable,get:info')
    ).toMatchObject({
      ok: true,
      name: 'Airtable',
    })
  })

  test('messages', async () => {
    const seneca = await makeSeneca()
    await SenecaMsgTest(seneca, BasicMessages)()
  })

  // test('site-basic', async () => {
  //   if (!Config) return
  //   const seneca = await makeSeneca()

  //   // does this:   const sites = await Airtable.sites();
  //   const list = await seneca.entity('provider/Airtable/site').list$()
  //   expect(list.length > 0).toBeTruthy()

  //   const site0 = await seneca
  //     .entity('provider/Airtable/site')
  //     .load$(Config.site0.id)
  //   expect(site0.name).toContain(Config.site0.name)
  // })

  // test('collection-basic', async () => {
  //   if (!Config) return
  //   const seneca = await makeSeneca()

  //   const list = await seneca
  //     .entity('provider/Airtable/collection')
  //     .list$(Config.site0.id)
  //   expect(list.length > 0).toBeTruthy()

  //   const collection0 = await seneca
  //     .entity('provider/Airtable/collection')
  //     .load$({
  //       siteId: Config.site0.id,
  //       collectionId: Config.site0.collections.collection0.id,
  //     })
  //   expect(collection0.name).toContain(
  //     Config.site0.collections.collection0.name
  //   )
  // })

  // test('item-basic', async () => {
  //   if (!Config) return
  //   const seneca = await makeSeneca()

  //   const list = await seneca
  //     .entity('provider/Airtable/item')
  //     .list$(Config.site0.collections.collection0.id)
  //   expect(list.length > 0).toBeTruthy()

  //   const item0 = await seneca.entity('provider/Airtable/item').load$({
  //     collectionId: Config.site0.collections.collection0.id,
  //     itemId: Config.site0.collections.collection0.items.item0.id,
  //   })
  //   expect(item0.name).toContain(
  //     Config.site0.collections.collection0.items.item0.name
  //   )
  // })

  test('maintain', async () => {
    await Maintain()
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
