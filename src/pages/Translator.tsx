import { useState } from "react";
import { Languages, ScanText } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  OCR_LANGUAGE_OPTIONS,
  TRANSLATE_LANGUAGE_OPTIONS,
  translatorOcrSchema,
  translatorTranslateSchema,
  type TranslatorOcrSchemaInput,
  type TranslatorOcrSchemaOutput,
} from "@/feature/translator/schemas/translator.schema";
import {
  useTranslatorOcr,
  useTranslatorText,
} from "@/feature/translator/hooks/use-translator";
import { TranslatorFileDropzone } from "@/feature/translator/components/translator-file-dropzone";
import { TranslatorResultColumns } from "@/feature/translator/components/translator-result-columns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default function Translator() {
  const [ocrText, setOcrText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLang, setTargetLang] = useState("en");

  const ocrMutation = useTranslatorOcr();
  const translateMutation = useTranslatorText();

  const form = useForm<
    TranslatorOcrSchemaInput,
    unknown,
    TranslatorOcrSchemaOutput
  >({
    resolver: zodResolver(translatorOcrSchema),
    defaultValues: {
      file: null,
      language: "vi",
      format: true,
    },
  });

  const onSubmit: SubmitHandler<TranslatorOcrSchemaOutput> = async (values) => {
    setTranslatedText("");
    const result = await ocrMutation.mutateAsync(values);
    setOcrText(result.text || "");
  };

  const handleTranslate = async () => {
    const parsed = translatorTranslateSchema.safeParse({
      source_text: ocrText,
      target_lang: targetLang,
    });

    if (!parsed.success) return;

    const result = await translateMutation.mutateAsync(parsed.data);
    setTranslatedText(result.translated_text || "");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
            <Languages className="size-4" />
            Translator / OCR
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            OCR tài liệu và dịch nội dung
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Tải file lên để OCR lấy text từ tài liệu, sau đó bấm translate để
            dịch toàn bộ nội dung sang ngôn ngữ đích.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_140px]">
              <FormField
                control={form.control}
                name="file"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>File OCR</FormLabel>
                    <FormControl>
                      <TranslatorFileDropzone
                        value={field.value ?? null}
                        onChange={field.onChange}
                        disabled={ocrMutation.isPending}
                        error={fieldState.error?.message}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngôn ngữ OCR</FormLabel>
                    <FormControl>
                      <select
                        value={field.value}
                        onChange={field.onChange}
                        className="h-11 w-full rounded-md border bg-white px-3 text-sm outline-none"
                      >
                        {OCR_LANGUAGE_OPTIONS.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-end">
                <Button
                  type="submit"
                  className="h-11 w-full"
                  disabled={ocrMutation.isPending}
                >
                  <ScanText className="mr-2 size-4" />
                  {ocrMutation.isPending ? "Đang OCR..." : "OCR file"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </section>

      <TranslatorResultColumns
        sourceText={ocrText}
        translatedText={translatedText}
        onTranslate={handleTranslate}
        isTranslating={translateMutation.isPending}
        targetLang={targetLang}
      />

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <label className="mb-2 block text-sm font-medium">
          Ngôn ngữ dịch đích
        </label>
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="h-11 w-full max-w-70 rounded-md border bg-white px-3 text-sm outline-none"
        >
          {TRANSLATE_LANGUAGE_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label} ({item.value})
            </option>
          ))}
        </select>
      </section>
    </div>
  );
}
