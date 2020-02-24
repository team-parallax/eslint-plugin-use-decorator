# eslint-plugin-use-decorator
[![Version npm][version]](http://npmjs.com/package/eslint-plugin-use-decorator)
[![Dependencies][david]](https://david-dm.org/team-parallax/eslint-plugin-use-decorator)
![peerDependencies][peer]
[![Known Vulnerabilities][vulnerabilities]](https://snyk.io/test/npm/eslint-plugin-use-decorator)
[![License][license]](https://opensource.org/licenses/MIT)

[version]: http://img.shields.io/npm/v/eslint-plugin-use-decorator.svg?style=flat-square
[david]: https://img.shields.io/david/team-parallax/eslint-plugin-use-decorator.svg?style=flat-square
[peer]: https://img.shields.io/david/peer/team-parallax/eslint-plugin-use-decorator.svg?style=flat-square
[vulnerabilities]: https://snyk.io/test/npm/eslint-plugin-use-decorator/badge.svg?style=flat-square
[license]: https://img.shields.io/badge/License-MIT-brightgreen.svg?style=flat-square

This is a custom plugin for eslint which enforces the use of decorators on methods.

## Note
This **only** works with the `@typescript-eslint` plugin

## Installation
```bash
npm install --save-dev eslint-plugin-use-decorator
```

## Usage
Add this to your `.eslintrc`
```json
// .eslintrc
{
  "plugins": ["use-decorator"],
  "rules": {
    "use-decorator/use-decorator": [1, {
      "params": [
        {
          "name": "assertParameter",
          "public": true
        }
      ],
      "methods": [
        {
          "name": "assert",
          "public": true
        },
        {
          "name": "errorcatch",
          "async": true,
          "private": true
        }
      ]
    }]
  }
}
```
Now methods and its parameters are checked for their decorators. Above rule would enforce following custom decorators:
```typescript
class SomeClass {
  @assert
  someMethod(
    @assertParameter
      someParameter: number
  ): number {
    return someParameter;
  }
  
  @errorcatch
  private async somePrivateAsyncMethod(
      someParameter: number
  ): Promise<number> {
    return someParameter;
  }
  
  /**
   *  This one does not need a decorator, because its only async.
   *  It would need to be private as well for the linting to take effect.
   */
  async someAsyncMethod(
      someParameter: number
  ): Promise<number> {
    return someParameter;
  }
}
```
The options object looks like this:
## Options
```json5
{
  "params": [
    {
      "name": "string",
      "private?": "boolean", // default: false
      "public?": "boolean", // default: false
      "async?": "boolean", // default: false, 
      "static?": "boolean" // default: false
    }
  ],
  "methods": [
    {
      "name": "assert",
      "private?": "boolean", // default: false
      "public?": "boolean", // default: false
      "async?": "boolean", // default: false
      "static?": "boolean" // default: false
    }
  ]
}
```