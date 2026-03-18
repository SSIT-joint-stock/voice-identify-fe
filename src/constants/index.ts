// App-wide constants

export const APP_NAME = 'Voice Identify';

export const QUERY_KEYS = {
  // Example: users: ['users'] as const,
} as const;

export const ROUTES = {
  HOME: '/',
  NOT_FOUND: '*',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
