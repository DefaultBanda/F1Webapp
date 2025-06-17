// api.ts — Direct OpenF1 Integration
// No backend proxy; all calls go to https://api.openf1.org/v1

// --- Data Structures (Exported) ---
export interface LapTimeDataPoint { LapNumber: number; [driverCode: string]: number | null; }
export interface SpeedDataPoint { Distance: number; Speed: number; }
export interface GearMapDataPoint { X: number; Y: number; nGear: number; }
export interface ThrottleDataPoint { Distance: number; Throttle: number; }
export interface BrakeDataPoint { Distance: number; Brake: number; }
export interface RPMDataPoint { Distance: number; RPM: number; }
export interface DRSDataPoint { Distance: number; DRS: number; }
export interface SessionDriver { code: string; name: string; team: string; }
export interface AvailableSession { name: string; type: string; startTime: string; }
export interface DriverStanding { rank: number; code: string; name: string; team: string; points: number; wins: number; podiums: number; }
export interface TeamStanding { rank: number; team: string; points: number; wins: number; podiums: number; }
export interface RaceResult { round: number; driver: string; team: string; teamColor: string; date?: string; location?: string; }
export interface DetailedRaceResult {
  position: number | null;
  driverCode: string;
  fullName: string;
  team: string;
  points: number;
  status: string;
  gridPosition?: number | null;
  teamColor: string;
  fastestLapTimeValue?: string | null;
}
export interface LapPositionDataPoint { LapNumber: number; [driverCode: string]: number | null; }

// --- Stint Analysis Interfaces ---
export interface LapDetail { lapNumber: number; lapTime: number; }
export interface StintAnalysisData { driverCode: string; stintNumber: number; compound: string; startLap: number; endLap: number; lapDetails: LapDetail[]; }

// --- OpenF1 Base URL ---
const OPENF1_BASE = 'https://api.openf1.org/v1';

// --- Helpers: Resolve meeting & session keys ---
async function getMeetingKey(year: number, event: string): Promise<number> {
  const res = await fetch(`${OPENF1_BASE}/meetings?year=${year}`);
  const list = await res.json();
  const m = list.find((m: any) => m.name.toLowerCase().includes(event.toLowerCase()));
  if (!m) throw new Error(`Meeting not found for ${year} ${event}`);
  return m.meeting_key;
}

async function getSessionKey(meetingKey: number, session: string): Promise<number> {
  const res = await fetch(`${OPENF1_BASE}/sessions?meeting_key=${meetingKey}`);
  const list = await res.json();
  const s = list.find((s: any) => s.name.toLowerCase().includes(session.toLowerCase()));
  if (!s) throw new Error(`Session '${session}' not found for meeting ${meetingKey}`);
  return s.session_key;
}

// --- API Fetch Functions ---
export const fetchAvailableSessions = async (year: number, event: string): Promise<AvailableSession[]> => {
  const mk = await getMeetingKey(year, event);
  const raw = await fetch(`${OPENF1_BASE}/sessions?meeting_key=${mk}`).then(r => r.json());
  return raw.map((s: any) => ({ name: s.name, type: s.type, startTime: s.date || '' }));
};

export const fetchSessionDrivers = async (year: number, event: string, session: string): Promise<SessionDriver[]> => {
  const mk = await getMeetingKey(year, event);
  const sk = await getSessionKey(mk, session);
  const raw = await fetch(`${OPENF1_BASE}/entry_list?session_key=${sk}`).then(r => r.json());
  return raw.map((d: any) => ({ code: d.driver_number, name: d.full_name, team: d.team }));
};

export const fetchLapTimes = async (year: number, event: string, session: string, drivers: string[]): Promise<LapTimeDataPoint[]> => {
  const mk = await getMeetingKey(year, event);
  const sk = await getSessionKey(mk, session);
  const all: LapTimeDataPoint[] = [];
  for (const d of drivers) {
    const laps = await fetch(`${OPENF1_BASE}/laps?session_key=${sk}&driver_number=${d}`).then(r => r.json());
    laps.forEach((lap: any) => {
      const e = all.find(x => x.LapNumber === lap.lap_number);
      if (e) e[d] = lap.lap_time;
      else all.push({ LapNumber: lap.lap_number, [d]: lap.lap_time });
    });
  }
  return all;
};

export const fetchTelemetrySpeed = async (year: number, event: string, session: string, driver: string, lap: number): Promise<SpeedDataPoint[]> => {
  const mk = await getMeetingKey(year, event);
  const sk = await getSessionKey(mk, session);
  const data = await fetch(`${OPENF1_BASE}/car_data?session_key=${sk}&driver_number=${driver}&lap_number=${lap}`).then(r => r.json());
  return data.map((p: any) => ({ Distance: p.distance, Speed: p.speed }));
};

export const fetchTelemetryGear = async (year: number, event: string, session: string, driver: string, lap: number): Promise<GearMapDataPoint[]> => {
  const mk = await getMeetingKey(year, event);
  const sk = await getSessionKey(mk, session);
  const data = await fetch(`${OPENF1_BASE}/car_data?session_key=${sk}&driver_number=${driver}&lap_number=${lap}`).then(r => r.json());
  return data.map((p: any) => ({ X: p.longitude, Y: p.latitude, nGear: p.n_gear }));
};

export const fetchTelemetryThrottle = async (year: number, event: string, session: string, driver: string, lap: number): Promise<ThrottleDataPoint[]> => {
  const mk = await getMeetingKey(year, event);
  const sk = await getSessionKey(mk, session);
  const data = await fetch(`${OPENF1_BASE}/car_data?session_key=${sk}&driver_number=${driver}&lap_number=${lap}`).then(r => r.json());
  return data.map((p: any) => ({ Distance: p.distance, Throttle: p.throttle }));
};

export const fetchTelemetryBrake = async (year: number, event: string, session: string, driver: string, lap: number): Promise<BrakeDataPoint[]> => {
  const mk = await getMeetingKey(year, event);
  const sk = await getSessionKey(mk, session);
  const data = await fetch(`${OPENF1_BASE}/car_data?session_key=${sk}&driver_number=${driver}&lap_number=${lap}`).then(r => r.json());
  return data.map((p: any) => ({ Distance: p.distance, Brake: p.brake }));
};

export const fetchTelemetryRPM = async (year: number, event: string, session: string, driver: string, lap: number): Promise<RPMDataPoint[]> => {
  const mk = await getMeetingKey(year, event);
  const sk = await getSessionKey(mk, session);
  const data = await fetch(`${OPENF1_BASE}/car_data?session_key=${sk}&driver_number=${driver}&lap_number=${lap}`).then(r => r.json());
  return data.map((p: any) => ({ Distance: p.distance, RPM: p.rpm }));
};

export const fetchTelemetryDRS = async (year: number, event: string, session: string, driver: string, lap: number): Promise<DRSDataPoint[]> => {
  const mk = await getMeetingKey(year, event);
  const sk = await getSessionKey(mk, session);
  const data = await fetch(`${OPENF1_BASE}/car_data?session_key=${sk}&driver_number=${driver}&lap_number=${lap}`).then(r => r.json());
  return data.map((p: any) => ({ Distance: p.distance, DRS: p.drs === '1' ? 1 : 0 }));
};

export const fetchLapPositions = async (year: number, event: string, session: string): Promise<LapPositionDataPoint[]> => {
  const mk = await getMeetingKey(year, event);
  const sk = await getSessionKey(mk, session);
  return fetch(`${OPENF1_BASE}/position_data?session_key=${sk}`).then(r => r.json());
};

export const fetchStintAnalysis = async (year: number, event: string, session: string): Promise<StintAnalysisData[]> => {
  // Stint analysis is not directly supported by OpenF1; returning empty array as a placeholder
  return [];
};

export const fetchRaceResults = async (year: number): Promise<RaceResult[]> => {
  const mk = await getMeetingKey(year, '');
  return fetch(`${OPENF1_BASE}/results/races?meeting_key=${mk}`).then(r => r.json());
};

export const fetchSpecificRaceResults = async (year: number, event: string, session: string): Promise<DetailedRaceResult[]> => {
  const mk = await getMeetingKey(year, event);
  return fetch(`${OPENF1_BASE}/results/race/${year}?meeting_key=${mk}`).then(r => r.json());
};

export const fetchDriverStandings = async (year: number): Promise<DriverStanding[]> => {
  const mk = await getMeetingKey(year, '');
  return fetch(`${OPENF1_BASE}/standings/drivers?meeting_key=${mk}`).then(r => r.json());
};

export const fetchTeamStandings = async (year: number): Promise<TeamStanding[]> => {
  const mk = await getMeetingKey(year, '');
  return fetch(`${OPENF1_BASE}/standings/constructors?meeting_key=${mk}`).then(r => r.json());
};

// --- Schedule Interface and Fetch ---
export interface ScheduleEvent { meetingKey: number; name: string; country: string; date: string; }
export const fetchSchedule = async (year: number): Promise<ScheduleEvent[]> => {
  const raw = await fetch(`${OPENF1_BASE}/meetings?year=${year}`).then(r => r.json());
  return raw.map((m: any) => ({ meetingKey: m.meeting_key, name: m.name, country: m.country || '', date: m.date || '' }));
};
