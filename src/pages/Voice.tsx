import { Mic, Search, UsersRound, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VOICE_TABS } from "@/constants";
import { useVoiceStore } from "@/feature/voice";
import { VoiceUploadForm } from "@/feature/voice/components/voice-upload-form";
import { VoiceIdentifyForm } from "@/feature/voice/components/voice-identify-form";
import { VoiceIdentifyTwoForm } from "@/feature/voice/components/voice-identify-two-form";
import { VoiceResultTop5 } from "@/feature/voice/components/voice-result-top5";
import { VoiceResultTwoSpeakers } from "@/feature/voice/components/voice-result-two-speakers";
import { VoiceErrorDialog } from "@/feature/voice/components/voice-error-dialog";
import { Card, CardContent } from "@/components/ui/card";

export default function Voice() {
  const {
    activeTab,
    setActiveTab,
    uploadResult,
    identifyResult,
    identifyTwoResult,
    errorDialog,
    closeErrorDialog,
  } = useVoiceStore();

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
                <Mic className="size-4" />
                Voice Recognition Workspace
              </div>

              <h1 className="text-3xl font-bold tracking-tight">
                Voice Identify System
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Giao diện thao tác cho 3 nghiệp vụ chính: đăng ký giọng nói,
                nhận diện 1 người nói, và nhận diện file audio có tối đa 2 người
                nói.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="rounded-2xl">
                <CardContent className="flex items-center gap-3 p-4">
                  <Mic className="size-5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Enroll</p>
                    <p className="font-semibold">Upload profile + audio</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="flex items-center gap-3 p-4">
                  <Search className="size-5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Identify</p>
                    <p className="font-semibold">Top 5 similarity</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="flex items-center gap-3 p-4">
                  <UsersRound className="size-5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Dual Speaker
                    </p>
                    <p className="font-semibold">1 hoặc 2 speaker</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as (typeof VOICE_TABS)[keyof typeof VOICE_TABS])
          }
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-1 gap-2 md:grid-cols-3">
            <TabsTrigger value={VOICE_TABS.ENROLL} className="gap-2">
              <Mic className="size-4" />
              Đăng ký giọng nói
            </TabsTrigger>

            <TabsTrigger value={VOICE_TABS.IDENTIFY} className="gap-2">
              <Search className="size-4" />
              Tra cứu
            </TabsTrigger>

            <TabsTrigger value={VOICE_TABS.IDENTIFY_TWO} className="gap-2">
              <UsersRound className="size-4" />
              Nhận diện 1-2 người
            </TabsTrigger>
          </TabsList>

          <TabsContent value={VOICE_TABS.ENROLL} className="space-y-6">
            <VoiceUploadForm />

            {uploadResult ? (
              <Card className="rounded-2xl border-green-200">
                <CardContent className="flex items-center gap-3 p-4">
                  <CheckCircle2 className="size-5 text-green-600" />
                  <div>
                    <p className="font-medium">Upload thành công</p>
                    <p className="text-sm text-muted-foreground">
                      {uploadResult.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value={VOICE_TABS.IDENTIFY} className="space-y-6">
            <VoiceIdentifyForm />
            <VoiceResultTop5 items={identifyResult?.items ?? []} />
          </TabsContent>

          <TabsContent value={VOICE_TABS.IDENTIFY_TWO} className="space-y-6">
            <VoiceIdentifyTwoForm />
            <VoiceResultTwoSpeakers items={identifyTwoResult?.items ?? []} />
          </TabsContent>
        </Tabs>
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
