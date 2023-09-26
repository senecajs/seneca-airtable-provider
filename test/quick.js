const Airtable = require("airtable-api");
const token = require("./local-env").AIRTABLE_ACCESSTOKEN;

run();

async function run() {
  // initialize the client with the access token
  const airtable = new Airtable({ token });

  const col = await airtable.collection({
    collectionId: "",
  });
  const colItems = await col.items();
  console.log(colItems);
}
