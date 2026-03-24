import axios from "axios";
import { TRANSLATOR_API_ENDPOINTS } from "@/constants";
import type {
  TranslatorOcrRequest,
  TranslatorOcrResponse,
  TranslatorTranslateRequest,
  TranslatorTranslateResponse,
} from "../types/translator.types";

const translatorOcrClient = axios.create({
  baseURL: "http://localhost:8003",
});

const translatorTranslateClient = axios.create({
  baseURL: "http://localhost:8505",
});

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const translatorApi = {
  async ocrDocument(
    payload: TranslatorOcrRequest
  ): Promise<TranslatorOcrResponse> {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("language", payload.language);
    formData.append("format", String(payload.format));

    const response = await translatorOcrClient.post(
      TRANSLATOR_API_ENDPOINTS.OCR,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const data = response.data;
    const text = isRecord(data)
      ? asString(data.results, asString(data.text, ""))
      : "";

    return {
      text,
      raw: data,
    };
  },

  async translateText(
    payload: TranslatorTranslateRequest
  ): Promise<TranslatorTranslateResponse> {
    const response = await translatorTranslateClient.post(
      TRANSLATOR_API_ENDPOINTS.TRANSLATE,
      {
        source_text: payload.source_text,
        target_lang: payload.target_lang,
      }
    );

    const data = response.data;
    const translatedText = isRecord(data)
      ? asString(data.translated_text, "")
      : "";

    return {
      translated_text: translatedText,
      raw: data,
    };
  },
};
