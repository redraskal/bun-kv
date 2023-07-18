# bun-kv

A simple KV store using Bun's [SQLite](https://bun.sh/docs/api/sqlite) module.

```bash
bun i redraskal/bun-kv#main
```

```ts
import KV from "bun-kv";

const database = new Database("bun.sqlite");
const KV = new KV(database);

KV.set("banana", "bread");
console.log(KV.get("banana")); // "bread"

KV.remove("banana");
```

This project was created using `bun init` in bun v0.6.15. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
