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
  .use("../")
  .ready(async function () {
    const seneca = this;
    console.log(await seneca.post("sys:provider,provider:airtable,get:info"));
    // list bases
    const bases = await seneca.entity("provider/airtable/base").list$();
    console.log("bases", bases.length);
  });
