import { Mic, FileAudio, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { VoiceUploadForm } from "@/feature/voice/components/voice-upload-form";
import { useVoiceStore } from "@/feature/voice";

export default function VoiceEnroll() {
  const { uploadResult, resetUploadResult } = useVoiceStore();

  useEffect(() => {
    resetUploadResult();
    return () => {
      resetUploadResult();
    };
  }, [resetUploadResult]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
              <Mic className="size-4" />
              Khai báo hồ sơ giọng nói
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Khai báo hồ sơ và enroll giọng nói
            </h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Cập nhật thông tin định danh và tải file audio để lưu mẫu giọng
              nói lên hệ thống.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="rounded-2xl">
              <CardContent className="flex items-center gap-3 p-4">
                <FileAudio className="size-5" />
                <div>
                  <p className="text-sm text-muted-foreground">Audio</p>
                  <p className="font-semibold">Upload file mẫu</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="flex items-center gap-3 p-4">
                <ShieldCheck className="size-5" />
                <div>
                  <p className="text-sm text-muted-foreground">Profile</p>
                  <p className="font-semibold">Lưu hồ sơ định danh</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <VoiceUploadForm onFileChange={resetUploadResult} />

      {uploadResult ? (
        <Card className="rounded-2xl border-green-200">
          <CardContent className="p-4">
            <p className="font-medium text-green-700">Gửi đăng ký thành công</p>
            <p className="text-sm text-muted-foreground">
              {uploadResult.message}
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
