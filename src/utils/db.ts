import { Database } from "bun:sqlite";

let db: Database;

export type Flight = {
	altitude: number;
	callsign: string;
	destIata: string;
	destIcao: string;
	eta: number;
	flight: string;
	fr24Id: string;
	groundSpeed: number;
	latitude: number;
	longitude: number;
	operator: string;
	origIata: string;
	origIcao: string;
	registration: string;
	squawk: string;
	timestamp: number;
	track: number;
	type: string;
	verticalSpeed: number;
};

export function getDb() {
	if (!db) {
		db = new Database("./data/flights.db", {
			readonly: true,
		});
	}
	return db;
}

export function getRecentFlights(): Flight[] {
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
			orig_icao,
			dest_iata,
			dest_icao,
			altitude,
			ground_speed,
			vertical_speed,
			track,
			squawk,
			latitude,
			longitude,
			timestamp,
			eta
		FROM flights 
		ORDER BY timestamp DESC;
	`)
		.all() as {
		altitude: number;
		callsign: string;
		dest_iata: string;
		dest_icao: string;
		eta: number;
		flight: string;
		fr24_id: string;
		ground_speed: number;
		latitude: number;
		longitude: number;
		operator: string;
		orig_iata: string;
		orig_icao: string;
		registration: string;
		squawk: string;
		timestamp: number;
		track: number;
		type: string;
		vertical_speed: number;
	}[];

	return rows.map((row) => ({
		altitude: row.altitude,
		callsign: row.callsign,
		destIata: row.dest_iata,
		destIcao: row.dest_icao,
		eta: row.eta,
		flight: row.flight,
		fr24Id: row.fr24_id,
		groundSpeed: row.ground_speed,
		latitude: row.latitude,
		longitude: row.longitude,
		operator: row.operator,
		origIata: row.orig_iata,
		origIcao: row.orig_icao,
		registration: row.registration,
		squawk: row.squawk,
		timestamp: row.timestamp,
		track: row.track,
		type: row.type,
		verticalSpeed: row.vertical_speed,
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

export function getFlightsByModel(model: string): Flight[] {
	const db = getDb();
	const rows = db
		.query(
			`SELECT 
        fr24_id, flight, callsign, type, registration,
		operator, orig_iata, orig_icao, dest_iata, dest_icao, timestamp, altitude, ground_speed, vertical_speed, track, squawk, latitude, longitude, eta
      FROM flights 
      WHERE type = $model
      ORDER BY timestamp DESC;`,
		)
		.all({
			$model: model,
		}) as {
		altitude: number;
		callsign: string;
		dest_iata: string;
		dest_icao: string;
		eta: number;
		flight: string;
		fr24_id: string;
		ground_speed: number;
		latitude: number;
		longitude: number;
		operator: string;
		orig_iata: string;
		orig_icao: string;
		registration: string;
		squawk: string;
		timestamp: number;
		track: number;
		type: string;
		vertical_speed: number;
	}[];

	return rows.map((row) => ({
		altitude: row.altitude,
		callsign: row.callsign,
		destIata: row.dest_iata,
		destIcao: row.dest_icao,
		eta: row.eta,
		flight: row.flight,
		fr24Id: row.fr24_id,
		groundSpeed: row.ground_speed,
		latitude: row.latitude,
		longitude: row.longitude,
		operator: row.operator,
		origIata: row.orig_iata,
		origIcao: row.orig_icao,
		registration: row.registration,
		squawk: row.squawk,
		timestamp: row.timestamp,
		track: row.track,
		type: row.type,
		verticalSpeed: row.vertical_speed,
	}));
}
