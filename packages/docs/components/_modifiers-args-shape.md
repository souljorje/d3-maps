```ts
{
  [methodName: string]: Arg | Arg[]
}
```

1. Single non-array value: `Arg | [Arg]` - pass directly or wrap with an array
2. Single array value: `[Arg]` - **must be wrapped** with an array
3. Multiple values: `[Arg1, Arg2, ...]`
