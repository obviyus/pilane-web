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
	const rows = db
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
		.all() as {
		fr24_id: string;
		flight: string;
		callsign: string;
		type: string;
		registration: string;
		operator: string;
		orig_iata: string;
		dest_iata: string;
		timestamp: number;
	}[];

	return rows.map((row) => ({
		fr24Id: row.fr24_id,
		flight: row.flight,
		callsign: row.callsign,
		type: row.type,
		registration: row.registration,
		operator: row.operator,
		origIata: row.orig_iata,
		destIata: row.dest_iata,
		timestamp: row.timestamp,
	}));
}

export function getUniqueModels() {
	const db = getDb();
	const rows = db
		.query(`
			SELECT type, COUNT(*) as count 
			FROM flights 
			GROUP BY type 
			ORDER BY count DESC, type ASC;
		`)
		.all() as { type: string; count: number }[];

	return rows.map((row) => ({
		type: row.type,
		count: row.count,
	}));
}

export function getFlightsByModel(model: string) {
	const db = getDb();
	const rows = db
		.query(
			`SELECT 
        fr24_id, flight, callsign, type, registration,
        operator, orig_iata, dest_iata, timestamp
      FROM flights 
      WHERE type = $model
      ORDER BY timestamp DESC;`,
		)
		.all({
			$model: model,
		}) as {
		fr24_id: string;
		flight: string;
		callsign: string;
		type: string;
		registration: string;
		operator: string;
		orig_iata: string;
		dest_iata: string;
		timestamp: number;
	}[];

	return rows.map((row) => ({
		fr24Id: row.fr24_id,
		flight: row.flight,
		callsign: row.callsign,
		type: row.type,
		registration: row.registration,
		operator: row.operator,
		origIata: row.orig_iata,
		destIata: row.dest_iata,
		timestamp: row.timestamp,
	}));
}
