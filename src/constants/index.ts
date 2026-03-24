export const APP_NAME = "Voice Identify";

export const QUERY_KEYS = {
  voice: {
    upload: ["voice", "upload"] as const,
    identify: ["voice", "identify"] as const,
    identifyTwo: ["voice", "identify-two"] as const,
  },
  translator: {
    ocr: ["translator", "ocr"] as const,
    translate: ["translator", "translate"] as const,
  },
} as const;

export const ROUTES = {
  HOME: "/",
  VOICE: "/voice",
  VOICE_ENROLL: "/voice/enroll",
  VOICE_SEARCH_SINGLE: "/voice/search-single",
  VOICE_SEARCH_MULTI: "/voice/search-multi",
  VOICE_GUIDE: "/voice/guide",
  TRANSLATOR: "/translator",
  NOT_FOUND: "*",
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

export const ACCEPTED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/vnd.wave",
  "audio/mp4",
  "audio/x-m4a",
  "audio/webm",
  "audio/ogg",
  "audio/flac",
] as const;

export const ACCEPTED_TRANSLATOR_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const MAX_AUDIO_FILE_SIZE_MB = 25;
export const MAX_AUDIO_FILE_SIZE_BYTES = MAX_AUDIO_FILE_SIZE_MB * 1024 * 1024;

export const MAX_TRANSLATOR_FILE_SIZE_MB = 25;
export const MAX_TRANSLATOR_FILE_SIZE_BYTES =
  MAX_TRANSLATOR_FILE_SIZE_MB * 1024 * 1024;

export const VOICE_API_ENDPOINTS = {
  UPLOAD: "/upload_voice/",
  IDENTIFY: "/identify_voice/",
  IDENTIFY_TWO: "/identify_2_voice/",
} as const;

export const TRANSLATOR_API_ENDPOINTS = {
  OCR: "/ocr/",
  TRANSLATE: "/translate",
} as const;

export const VOICE_TABS = {
  ENROLL: "enroll",
  IDENTIFY: "identify",
  IDENTIFY_TWO: "identify-two",
} as const;
