// IMPORTANT: assumes node-fetch@2
const Fetch = require("node-fetch");

const Seneca = require("seneca");

// global.fetch = Fetch

Seneca({ legacy: false })
  .test()
  .use("promisify")
  .use("entity")
  .use("env", {
    // debug: true,
    file: [__dirname + "/local-env.js;?"],
    var: {
      $AIRTABLE_ACCESSTOKEN: String,
    },
  })
  .use("provider", {
    provider: {
      airtable: {
        keys: {
          accesstoken: { value: "$AIRTABLE_ACCESSTOKEN" },
        },
      },
    },
  })
  .use("../", {
    fetch: Fetch,
    entity: {
      record: {
        save: {
          name: "Base 123",
        },
      },
    },
  })
  .ready(async function () {
    const seneca = this;
    console.log(await seneca.post("sys:provider,provider:airtable,get:info"));
    // list bases
    const bases = await seneca.entity("provider/airtable/base").list$();
    console.log("bases", bases.length);
    // list tables
    let tables = await seneca.entity("provider/airtable/table").list$();
    console.log("tables", tables.length);
    // list records
    let records = await seneca.entity("provider/airtable/record").list$();
    console.log("records", records.length);
    let record = seneca.entity("provider/airtable/record").data$({
      name: "",
    });
    try {
      record = await record.save$();
      console.log("record", record);
    } catch (e) {
      console.log(e.message);
      console.log(e.status);
      console.log(e.body);
    }
  });
