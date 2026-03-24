import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TranslatorFileDropzoneProps {
  value: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  error?: string;
}

export function TranslatorFileDropzone({
  value,
  onChange,
  disabled,
  error,
}: TranslatorFileDropzoneProps) {
  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed bg-white px-6 py-10 text-center transition hover:bg-slate-50">
        <input
          type="file"
          className="hidden"
          disabled={disabled}
          accept=".pdf,.png,.jpg,.jpeg,.txt,.docx"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            onChange(file);
          }}
        />

        <UploadCloud className="mb-3 size-10 text-slate-500" />
        <p className="font-medium text-slate-700">Tải file để OCR</p>
        <p className="mt-1 text-sm text-slate-500">
          Hỗ trợ pdf, png, jpg, jpeg, txt, docx
        </p>
      </label>

      {value ? (
        <div className="flex items-center justify-between rounded-xl border bg-white px-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-medium">{value.name}</p>
            <p className="text-sm text-slate-500">
              {(value.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange(null)}
            disabled={disabled}
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
