import { Search, UsersRound, AudioLines } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { VoiceIdentifyForm } from "@/feature/voice/components/voice-identify-form";
import { VoiceIdentifyTwoForm } from "@/feature/voice/components/voice-identify-two-form";
import { VoiceResultTop5 } from "@/feature/voice/components/voice-result-top5";
import { VoiceResultTwoSpeakers } from "@/feature/voice/components/voice-result-two-speakers";
import { VoiceErrorDialog } from "@/feature/voice/components/voice-error-dialog";
import { useVoiceStore } from "@/feature/voice";

export default function VoiceSearch() {
  const { identifyResult, identifyTwoResult, errorDialog, closeErrorDialog } =
    useVoiceStore();

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
              <Search className="size-4" />
              Tra cứu giọng nói
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Tra cứu và nhận diện giọng nói
            </h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Tải file audio để hệ thống nhận diện người nói đã biết và trả về
              kết quả phù hợp. Với luồng nhiều người nói, kết quả sẽ được hiển
              thị theo từng nhóm riêng biệt.
            </p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AudioLines className="size-5" />
                Nhận diện 1 người
              </CardTitle>
              <CardDescription>
                Dùng cho file audio chỉ có 1 người nói hoặc backend nhận diện
                theo luồng 1 speaker.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VoiceIdentifyForm />
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersRound className="size-5" />
                Nhận diện 1-2 người
              </CardTitle>
              <CardDescription>
                Dùng cho file audio có tối đa 2 người nói, kết quả hiển thị theo
                từng speaker/segment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VoiceIdentifyTwoForm />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-6">
            <VoiceResultTop5 items={identifyResult?.items ?? []} />
          </div>

          <div className="space-y-6">
            <VoiceResultTwoSpeakers items={identifyTwoResult?.items ?? []} />
          </div>
        </section>
      </div>

      <VoiceErrorDialog
        open={errorDialog.open}
        title={errorDialog.title}
        description={errorDialog.description}
        onClose={closeErrorDialog}
      />
    </>
  );
}
