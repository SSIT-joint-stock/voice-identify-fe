import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatError } from "@/utils";
import { translatorApi } from "../api/translator.api";
import type {
  TranslatorOcrSchemaOutput,
  TranslatorTranslateSchemaOutput,
} from "../schemas/translator.schema";

export function useTranslatorOcr() {
  return useMutation({
    mutationFn: async (values: TranslatorOcrSchemaOutput) => {
      return translatorApi.ocrDocument({
        file: values.file,
        language: values.language.trim(),
        format: values.format,
      });
    },
    onSuccess: () => {
      toast.success("OCR thành công.");
    },
    onError: (error) => {
      toast.error(formatError(error));
    },
  });
}

export function useTranslatorText() {
  return useMutation({
    mutationFn: async (values: TranslatorTranslateSchemaOutput) => {
      return translatorApi.translateText({
        source_text: values.source_text.trim(),
        target_lang: values.target_lang.trim(),
      });
    },
    onSuccess: () => {
      toast.success("Dịch thành công.");
    },
    onError: (error) => {
      toast.error(formatError(error));
    },
  });
}
