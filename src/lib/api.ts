// Use the OpenF1 API base URL by default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.openf1.org/v1';

// OpenF1 does not require an API key like FastF1,
// so you may remove API_KEY-related headers (if not needed)
const getHeaders = (): HeadersInit => ({
    'Content-Type': 'application/json'
});

// --- OpenF1 Data Structures ---

export interface CarDataPoint {
    brake: number;
    date: string;
    driver_number: number;
    drs: number;
    meeting_key: number;
    n_gear: number;
    rpm: number;
    session_key: number;
    speed: number;
    throttle: number;
}

export interface OpenF1Driver {
    broadcast_name: string;
    country_code: string;
    driver_number: number;
    first_name: string;
    full_name: string;
    headshot_url: string;
    last_name: string;
    meeting_key: number;
    name_acronym: string;
    session_key: number;
    team_colour: string;
    team_name: string;
}

export interface LapData {
    date_start: string;
    driver_number: number;
    duration_sector_1: number;
    duration_sector_2: number;
    duration_sector_3: number;
    i1_speed: number;
    i2_speed: number;
    is_pit_out_lap: boolean;
    lap_duration: number;
    lap_number: number;
    meeting_key: number;
    segments_sector_1: number[];
    segments_sector_2: number[];
    segments_sector_3: number[];
    session_key: number;
    st_speed: number;
}

export interface IntervalData {
    date: string;
    driver_number: number;
    gap_to_leader: number | null;
    interval: number | null;
    meeting_key: number;
    session_key: number;
}

// --- OpenF1 API Fetch Functions ---

/**
 * Fetch car (telemetry) data.
 * Example URL: https://api.openf1.org/v1/car_data?driver_number=55&session_key=9159&speed>=315
 */
export const fetchCarData = async (
    driverNumber: number,
    sessionKey: number,
    speedFilter?: number
): Promise<CarDataPoint[]> => {
    const params = new URLSearchParams({
        driver_number: driverNumber.toString(),
        session_key: sessionKey.toString()
    });
    if (speedFilter !== undefined) {
        // Note: To filter where speed is greater than or equal to a value, OpenF1 expects "speed>=" in the query string.
        params.append('speed>=', speedFilter.toString());
    }
    const url = `${API_BASE_URL}/car_data?${params.toString()}`;
    console.log(`Fetching car data from: ${url}`);
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

/**
 * Fetch driver info.
 * Example URL: https://api.openf1.org/v1/drivers?driver_number=1&session_key=9158
 */
export const fetchDriverInfo = async (
    driverNumber: number,
    sessionKey: number
): Promise<OpenF1Driver[]> => {
    const params = new URLSearchParams({
        driver_number: driverNumber.toString(),
        session_key: sessionKey.toString()
    });
    const url = `${API_BASE_URL}/drivers?${params.toString()}`;
    console.log(`Fetching driver info from: ${url}`);
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

/**
 * Fetch lap data.
 * Example URL: https://api.openf1.org/v1/laps?session_key=9161&driver_number=63&lap_number=8
 */
export const fetchLapData = async (
    sessionKey: number,
    driverNumber: number,
    lapNumber: number
): Promise<LapData[]> => {
    const params = new URLSearchParams({
        session_key: sessionKey.toString(),
        driver_number: driverNumber.toString(),
        lap_number: lapNumber.toString()
    });
    const url = `${API_BASE_URL}/laps?${params.toString()}`;
    console.log(`Fetching lap data from: ${url}`);
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

/**
 * Fetch interval data.
 * Example URL: https://api.openf1.org/v1/intervals?session_key=9165&interval<0.005
 */
export const fetchIntervals = async (
    sessionKey: number,
    intervalThreshold: number
): Promise<IntervalData[]> => {
    const params = new URLSearchParams({
        session_key: sessionKey.toString(),
        // Use the filtering syntax as documented (key with operator)
        'interval<': intervalThreshold.toString()
    });
    const url = `${API_BASE_URL}/intervals?${params.toString()}`;
    console.log(`Fetching intervals from: ${url}`);
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// Additional functions (such as for meetings, pit stops, positions, etc.) 
// should be refactored similarly – updating endpoint paths and query parameter names as per OpenF1 docs.
