import Database from "bun:sqlite";

export default class KV {
	readonly #database: Database;
	readonly #table: string;
	#select;
	#set;
	#delete;

	constructor(database: Database, table?: string) {
		this.#database = database;
		this.#table = table || "kv";
		this.#database
			.prepare(
				`
			CREATE TABLE IF NOT EXISTS ${this.#table} (
				key TEXT NOT NULL PRIMARY KEY,
				value TEXT NOT NULL
			) WITHOUT ROWID;
		`
			)
			.run();
		this.#select = this.#database.query(`SELECT value FROM ${this.#table} WHERE key = $key`);
		this.#set = this.#database.query(`INSERT OR REPLACE INTO ${this.#table} (key, value) VALUES ($key, $value)`);
		this.#delete = this.#database.query(`DELETE FROM ${this.#table} WHERE key = $key`);
	}

	get(key: string) {
		const row = this.#select.get(key) as { value: string } | null;
		return row?.value;
	}

	set(key: string, value: string) {
		return this.#set.run(key, value);
	}

	remove(key: string) {
		return this.#delete.run(key);
	}
}
