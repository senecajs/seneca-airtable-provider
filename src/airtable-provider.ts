/* Copyright © 2022 Seneca Project Contributors, MIT License. */

const Pkg = require('../package.json')

type AirtableProviderOptions = {
  url: string
  fetch: any
  entity: Record<string, any>
  debug: boolean
}

function AirtableProvider(this: any, options: AirtableProviderOptions) {
  const seneca: any = this

  const makeUtils = this.export('provider/makeUtils')

  const {
    makeUrl,
    getJSON,
    postJSON,
    entityBuilder
  } = makeUtils({
    name: 'airtable',
    url: options.url,
  })

  seneca.message('sys:provider,provider:airtable,get:info', get_info)

  const makeConfig = (config?: any) => seneca.util.deep({
    headers: {
      ...seneca.shared.headers
    }
  }, config)

  async function get_info(this: any, _msg: any) {
    return {
      ok: true,
      name: 'airtable',
      version: Pkg.version,
      sdk: {
        name: 'airtable',
        version: Pkg.dependencies['airtable'],
      },
    }
  }

  entityBuilder(this, {
    provider: {
      name: 'airtable',
    },
    entity: {
      base: {
        cmd: {
          list: {
            action: async function (this: any, entize: any, msg: any) {
              let json: any =
                await getJSON(makeUrl('meta/bases', msg.q), makeConfig())
              let res = json
              let list = res.bases.map((data: any) => entize(data))
              return list
            },
          },

        },
      },

      table: {
        cmd: {
          list: {
            action: async function (this: any, entize: any, msg: any) {
              let q = msg.q || {}
              let baseId = q.baseId

              let json: any =
                await getJSON(makeUrl(`meta/bases/${baseId}/tables`, msg.q), makeConfig())
              let tables = json.tables
              let list = tables.map((data: any) => entize(data))
              // TODO: ensure seneca-transport preserves array props
              list.page = json.page

              return list
            },
          },
          save: {
            action: async function (this: any, entize: any, msg: any) {
              let q = msg.q || {}
              let baseId = q.baseId

              let body = this.util.deep(
                options.entity.table.save,
                msg.ent.data$(false)
              )

              delete body.baseId; //Todo: See how to better handle this

              let json: any =
                await postJSON(makeUrl(`meta/bases/${baseId}/tables`, msg.q), makeConfig({
                  body
                }))

              let table = json
              return entize(table)
            },
          }
        }
      },

      record: {
        cmd: {
          list: {
            action: async function (this: any, entize: any, msg: any) {
              let q = msg.q || {}
              let baseId = q.baseId
              let tableId = q.tableId

              let json: any =
                await getJSON(makeUrl(`${baseId}/${tableId}`, msg.q), makeConfig())

              let records = json.records
              let list = records.map((data: any) => entize(data))
              // TODO: ensure seneca-transport preserves array props
              list.offset = json.offset

              return list
            },
          },
          load: {
            action: async function (this: any, entize: any, msg: any) {
              let q = msg.q || {}
              let baseId = q.baseId
              let tableId = q.tableId
              let recordId = q.recordId

              let json: any =
                await getJSON(makeUrl(`${baseId}/${tableId}/${recordId}`, msg.q), makeConfig())

              let record = json
              return entize(record)
            },
          },
        }
      }

    },
  })

  seneca.prepare(async function (this: any) {
    let res =
      await this.post('sys:provider,get:keymap,provider:airtable')

    if (!res.ok) {
      throw this.fail('keymap')
    }

    let auth = res.keymap.accesstoken.value

    this.shared.headers = {
      Authorization: 'Bearer ' + auth
    }

    // this.shared.primary = {
    //   name: res.keymap.name.value,
    //   description: res.keymap.description.value,
    // }

  })


  return {
    exports: {
    }
  }
}

// Default options.
const defaults: AirtableProviderOptions = {
  // NOTE: include trailing /
  url: 'https://api.airtable.com/v0/',

  // Use global fetch by default - if exists
  fetch: ('undefined' === typeof fetch ? undefined : fetch),

  entity: {
    table: {
      save: {
        // Default fields
      }
    },
    record: {
      save: {
        // Default fields
      }
    }
  },

  // TODO: Enable debug logging
  debug: false
}

Object.assign(AirtableProvider, { defaults })

export default AirtableProvider

if ('undefined' !== typeof module) {
  module.exports = AirtableProvider
}
