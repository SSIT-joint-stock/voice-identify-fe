import { useRef } from "react";
import { Upload, FileAudio, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceAudioDropzoneProps {
  value: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: string;
}

export function VoiceAudioDropzone({
  value,
  onChange,
  disabled = false,
  label = "Tải file audio",
  description = "Hỗ trợ mp3, wav, m4a, webm, ogg, flac",
  error,
}: VoiceAudioDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handlePickFile = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onChange(file);
  };

  const handleRemoveFile = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "rounded-2xl border border-dashed p-6 transition-colors",
          "bg-card text-card-foreground",
          disabled && "cursor-not-allowed opacity-60",
          error && "border-destructive"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.m4a,.webm,.ogg,.flac"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />

        {!value ? (
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="rounded-full border p-3">
              <Upload className="size-5" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handlePickFile}
              disabled={disabled}
            >
              Chọn file audio
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full border p-3">
                <FileAudio className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{value.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(value.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handlePickFile}
                disabled={disabled}
              >
                Đổi file
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleRemoveFile}
                disabled={disabled}
              >
                <X className="mr-2 size-4" />
                Xóa
              </Button>
            </div>
          </div>
        )}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
