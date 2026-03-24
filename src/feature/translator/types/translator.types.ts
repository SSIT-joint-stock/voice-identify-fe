export interface TranslatorOcrRequest {
  file: File;
  language: string;
  format: boolean;
}

export interface TranslatorOcrResponse {
  text: string;
  raw: unknown;
}

export interface TranslatorTranslateRequest {
  source_text: string;
  target_lang: string;
}

export interface TranslatorTranslateResponse {
  translated_text: string;
  raw: unknown;
}
