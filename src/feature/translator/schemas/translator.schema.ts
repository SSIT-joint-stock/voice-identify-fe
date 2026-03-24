import { z } from "zod";
import {
  ACCEPTED_TRANSLATOR_FILE_TYPES,
  MAX_TRANSLATOR_FILE_SIZE_BYTES,
} from "@/constants";

export const OCR_LANGUAGE_OPTIONS = [
  { value: "vi", label: "Tiếng Việt" },
  { value: "en", label: "English" },
  { value: "de", label: "German" },
  { value: "fr", label: "French" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
] as const;

export const TRANSLATE_LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "vi", label: "Vietnamese" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese (Simplified)" },
  { value: "zh-Hant", label: "Chinese (Traditional)" },
  { value: "es", label: "Spanish" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "th", label: "Thai" },
  { value: "id", label: "Indonesian" },
  { value: "ms", label: "Malay" },
] as const;

const ocrLanguageValues = OCR_LANGUAGE_OPTIONS.map((item) => item.value);
const translateLanguageValues = TRANSLATE_LANGUAGE_OPTIONS.map(
  (item) => item.value
);

function isValidOcrLanguage(value: string) {
  return ocrLanguageValues.some((lang) => lang === value);
}

function isValidTranslateLanguage(value: string) {
  return translateLanguageValues.some((lang) => lang === value);
}

const translatorFileSchema = z
  .custom<File | null>((value) => value === null || value instanceof File, {
    message: "Vui lòng chọn file cần OCR.",
  })
  .refine(
    (file): file is File => file instanceof File,
    "Vui lòng chọn file cần OCR."
  )
  .refine((file) => file.size > 0, "File không hợp lệ.")
  .refine(
    (file) => file.size <= MAX_TRANSLATOR_FILE_SIZE_BYTES,
    `File không được vượt quá ${
      MAX_TRANSLATOR_FILE_SIZE_BYTES / 1024 / 1024
    }MB.`
  )
  .refine(
    (file) =>
      ACCEPTED_TRANSLATOR_FILE_TYPES.includes(
        file.type as (typeof ACCEPTED_TRANSLATOR_FILE_TYPES)[number]
      ),
    "Định dạng file chưa được hỗ trợ. Chỉ hỗ trợ pdf/png/jpg/jpeg/txt/docx."
  )
  .transform((file) => file as File);

export const translatorOcrSchema = z.object({
  file: translatorFileSchema,
  language: z
    .string()
    .trim()
    .refine((value) => isValidOcrLanguage(value), {
      message: "Ngôn ngữ OCR không hợp lệ.",
    }),
  format: z.boolean().default(true),
});

export const translatorTranslateSchema = z.object({
  source_text: z.string().trim().min(1, "Không có nội dung để dịch."),
  target_lang: z
    .string()
    .trim()
    .refine((value) => isValidTranslateLanguage(value), {
      message: "Ngôn ngữ dịch không hợp lệ.",
    }),
});

export type TranslatorOcrSchemaInput = z.input<typeof translatorOcrSchema>;
export type TranslatorOcrSchemaOutput = z.output<typeof translatorOcrSchema>;

export type TranslatorTranslateSchemaInput = z.input<
  typeof translatorTranslateSchema
>;
export type TranslatorTranslateSchemaOutput = z.output<
  typeof translatorTranslateSchema
>;
