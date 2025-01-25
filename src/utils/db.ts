import { Database } from "bun:sqlite";

let db: Database;

export function getDb() {
	if (!db) {
		db = new Database("./data/flights.db", {
			readonly: true,
		});
	}
	return db;
}

export function getRecentFlights() {
	const db = getDb();
	return db
		.query(`
        SELECT 
            fr24_id,
            flight,
            callsign,
            type,
            registration,
            operator,
            orig_iata,
            dest_iata,
            timestamp
        FROM flights 
        ORDER BY timestamp DESC;
    `)
		.all();
}
