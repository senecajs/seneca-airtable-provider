![Seneca Airtable-Provider](http://senecajs.org/files/assets/seneca-logo.png)

> _Seneca Airtable-Provider_ is a plugin for [Seneca](http://senecajs.org)

Provides access to the Airtable CMS API using the Seneca _provider_
convention. Airtable CMS API entities are represented as Seneca entities so
that they can be accessed using the Seneca entity API and messages.

See [seneca-entity](senecajs/seneca-entity) and the [Seneca Data
Entities
Tutorial](https://senecajs.org/docs/tutorials/understanding-data-entities.html) for more details on the Seneca entity API.

[![npm version](https://img.shields.io/npm/v/@seneca/airtable-provider.svg)](https://npmjs.com/package/@seneca/airtable-provider)
[![build](https://github.com/senecajs/seneca-airtable-provider/actions/workflows/build.yml/badge.svg)](https://github.com/senecajs/seneca-airtable-provider/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/senecajs/seneca-airtable-provider/badge.svg?branch=main)](https://coveralls.io/github/senecajs/seneca-airtable-provider?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/senecajs/seneca-airtable-provider/badge.svg)](https://snyk.io/test/github/senecajs/seneca-airtable-provider)
[![DeepScan grade](https://deepscan.io/api/teams/5016/projects/19462/branches/505954/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5016&pid=19462&bid=505954)
[![Maintainability](https://api.codeclimate.com/v1/badges/f76e83896b731bb5d609/maintainability)](https://codeclimate.com/github/senecajs/seneca-airtable-provider/maintainability)

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------- |

## Quick Example

```js
// Setup - Make sure to load AIRTABLE-ACCESS-TOKEN from a Vault or env variable.
Seneca()
  .use("promisify")
  .use("entity")
  .use("provider", {
    provider: {
      airtable: {
        keys: {
          accesstoken: { value: "<AIRTABLE-ACCESS-TOKEN>" },
        },
      },
    },
  })
  .use("airtable-provider")
  .ready(async function () {
    const seneca = this;
    console.log(await seneca.post("sys:provider,provider:airtable,get:info"));
    // list bases
    const bases = await seneca.entity("provider/airtable/base").list$();
    console.log("bases", bases.length);
  });
```

## Install

```sh
$ npm install @seneca/airtable-provider @seneca/env
```

## How to get access

## Options

## Action Patterns

- ["role":"entity","base":"airtable","cmd":"list","name":"base","zone":"provider"]
- ["role":"entity","base":"airtable","cmd":"list","name":"table","zone":"provider"]
- ["role":"entity","base":"airtable","cmd":"save","name":"table","zone":"provider"]
- ["role":"entity","base":"airtable","cmd":"list","name":"record","zone":"provider"]
- ["role":"entity","base":"airtable","cmd":"load","name":"record","zone":"provider"]
- ["role":"entity","base":"airtable","cmd":"save","name":"record","zone":"provider"]
- ["sys":"provider","get":"info","provider":"airtable"]

## Action Descriptions

## More Examples

## Motivation

## Support

Check out our sponsors and supporters, Voxgig, on their website [here](https://www.voxgig.com).

## API

## Contributing

The [SenecaJS org](http://senecajs.org/) encourages participation. If you feel you can help in any way, be
it with bug reporting, documentation, examples, extra testing, or new features, feel free
to [create an issue](https://github.com/senecajs/seneca-maintain/issues/new), or better yet - [submit a Pull Request](https://github.com/senecajs/seneca-maintain/pulls). For more
information on contribution, please see our [Contributing Guide](http://senecajs.org/contribute).

## Background

Check out the SenecaJS roadmap [here](https://senecajs.org/roadmap/)!
