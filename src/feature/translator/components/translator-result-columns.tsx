import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface TranslatorResultColumnsProps {
  sourceText: string;
  translatedText: string;
  onTranslate: () => void;
  isTranslating?: boolean;
  targetLang: string;
}

export function TranslatorResultColumns({
  sourceText,
  translatedText,
  onTranslate,
  isTranslating,
  targetLang,
}: TranslatorResultColumnsProps) {
  const handleCopy = async (value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Text từ file</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleCopy(sourceText)}
            disabled={!sourceText}
          >
            <Copy className="mr-2 size-4" />
            Copy
          </Button>
        </div>

        <textarea
          value={sourceText}
          readOnly
          className="min-h-90 w-full resize-none rounded-xl border bg-slate-50 p-4 text-sm outline-none"
          placeholder="Nội dung OCR sẽ hiển thị ở đây..."
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="h-11 flex-1 rounded-md border bg-slate-50 px-3 text-sm leading-11 text-slate-600">
            Ngôn ngữ đích: {targetLang}
          </div>

          <Button
            type="button"
            onClick={onTranslate}
            disabled={!sourceText || !targetLang || isTranslating}
          >
            {isTranslating ? "Đang dịch..." : "Translate"}
          </Button>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Text đã dịch</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleCopy(translatedText)}
            disabled={!translatedText}
          >
            <Copy className="mr-2 size-4" />
            Copy
          </Button>
        </div>

        <textarea
          value={translatedText}
          readOnly
          className="min-h-108 w-full resize-none rounded-xl border bg-slate-50 p-4 text-sm outline-none"
          placeholder="Kết quả dịch sẽ hiển thị ở đây..."
        />
      </div>
    </div>
  );
}
