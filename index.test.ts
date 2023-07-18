import Database from "bun:sqlite";
import { test, expect, mock } from "bun:test";
import KV from ".";

const instance = mock((table?: string) => {
	const database = new Database();
	return {
		database,
		kv: new KV(database, table),
	};
});

const random = mock(() => Math.random().toString());

function exists(database: Database, table: string) {
	return (
		database
			.prepare(
				`
		SELECT EXISTS (
			SELECT name FROM sqlite_schema
			WHERE type='table' AND name='${table}'
		)
	`
			)
			.values()[0][0] == 1
	);
}

test("can create kv table", () => {
	const { database } = instance();
	expect(exists(database, "kv")).toBeTrue();
});

test("can use custom table", () => {
	const { database } = instance("bacon");
	expect(exists(database, "kv")).toBeFalse();
	expect(exists(database, "bacon")).toBeTrue();
});

test("can add & remove data from custom table", () => {
	const { kv } = instance("cool_kids_table");
	const value = random();
	kv.set("test", value);
	expect(kv.get("test")).toBe(value);
	kv.remove("test");
	expect(kv.get("test")).toBeUndefined();
});

test("can update data from custom table", () => {
	const { kv } = instance("cool_kids_table");
	const value = random();
	const updated = value + 5;
	kv.set("test", value);
	expect(kv.get("test")).toBe(value);
	kv.set("test", updated);
	expect(kv.get("test")).toBe(updated);
});
