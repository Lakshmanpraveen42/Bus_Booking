/**
 * Environment configuration.
 * All services must import from here — never read import.meta.env directly in components.
 * To switch to real backend: set VITE_USE_MOCK=false in .env
 */

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yourdomain.com/v1';

/** Simulated network delay (ms) for mock services — feels realistic */
export const MOCK_DELAY = 1500;
