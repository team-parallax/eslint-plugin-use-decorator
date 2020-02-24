# eslint-plugin-use-decorator
This is a custom plugin for eslint which enforces the use of decorators on methods.

## Usage
Add this to your `.eslintrc`
```json
// .eslintrc
{
  "rules": {
    "use-decorator": [1, {
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
  private async somePrivateMethod(
      someParameter: number
  ): Promise<number> {
    return someParameter;
  }
}
```