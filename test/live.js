const Seneca = require("seneca");

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

    const list = await seneca.entity("provider/airtable/site").list$();
    console.log(list.slice(0, 3));
  });
