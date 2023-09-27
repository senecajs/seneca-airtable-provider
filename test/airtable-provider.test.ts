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

  // checks that base.list$() works
  test('base-list', async () => {
    if (!Config) return
    const seneca = await makeSeneca()

    const bases = await seneca.entity('provider/airtable/base').list$()

    expect(bases.length > 0).toBeTruthy()
  })

  // checks that table.list$() works
  test('table-list', async () => {
    if (!Config) return
    const seneca = await makeSeneca()

    const tables = await seneca.entity('provider/airtable/table').list$({ baseId: Config.base0.id })

    expect(tables.length > 0).toBeTruthy()
  })

  // checks that table.save$() works
  test('table-save', async () => {
    if (!Config) return
    const seneca = await makeSeneca()

    // generate a random id
    const tableId = Math.floor(Math.random() * 1000000)

    // generate name using tableId
    const name = `Seneca Table ${tableId}`

    let table = seneca.entity('provider/airtable/table').data$({
      name: name,
      description: "A table created from Seneca.js",
      fields: [
        {
          description: "Name of the apartment",
          name: "Name",
          type: "singleLineText"
        },
        {
          name: "Address",
          type: "singleLineText"
        },
        {
          name: "Visited",
          options: {
            color: "greenBright",
            icon: "check"
          },
          type: "checkbox"
        }
      ],
    })

    try {
      table = await table.save$({ baseId: Config.base0.id })
    }
    catch (e) {
      console.log(e.message)
      console.log(e.status)
      console.log(e.body)
    }

    expect(table.name).toBe(name)
  })
})

// checks that record.list$() works
test('record-list', async () => {
  if (!Config) return
  const seneca = await makeSeneca()

  const records = await seneca.entity('provider/airtable/record').list$({ baseId: Config.base0.id, tableId: Config.table0.id })

  expect(records.length > 0).toBeTruthy()
})

// checks that record.load$() works
test('record-load', async () => {
  if (!Config) return
  const seneca = await makeSeneca()

  const record = await seneca.entity('provider/airtable/record').load$({ baseId: Config.base0.id, tableId: Config.table0.id, recordId: Config.record0.id })

  expect(record.id).toBe(Config.record0.id)
})

// checks that record.save$() works
test('record-save', async () => {
  if (!Config) return
  const seneca = await makeSeneca()

  let records = seneca.entity('provider/airtable/record').data$({
    records: [
      {
        fields: {
          Name: "Union Square",
        }
      },
      {
        fields: {
          Name: "Ferry Building"
        }
      }
    ]
  })

  try {
    records = await records.save$({ baseId: Config.base0.id, tableId: Config.table0.id })
  }
  catch (e) {
    console.log(e.message)
    console.log(e.status)
    console.log(e.body)
  }

  expect(records.length == 2).toBeTruthy()
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
