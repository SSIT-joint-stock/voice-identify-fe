import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  uploadVoiceSchema,
  type UploadVoiceSchemaInput,
  type UploadVoiceSchemaOutput,
} from "../schemas/voice.schema";
import { useUploadVoice } from "../hooks/use-voice";
import { VoiceAudioDropzone } from "./voice-audio-dropzone";

interface VoiceUploadFormProps {
  initialFile?: File | null;
  onUploadSuccess?: () => void;
  compact?: boolean;
}

export function VoiceUploadForm({
  initialFile = null,
  onUploadSuccess,
  compact = false,
}: VoiceUploadFormProps) {
  const form = useForm<
    UploadVoiceSchemaInput,
    unknown,
    UploadVoiceSchemaOutput
  >({
    resolver: zodResolver(uploadVoiceSchema),
    defaultValues: {
      name: "",
      citizenIdentification: "",
      phoneNumber: "",
      hometown: "",
      job: "",
      passport: "",
      criminalRecord: "[]",
      audioFile: initialFile,
    },
  });

  const uploadMutation = useUploadVoice({
    onSuccess: () => {
      form.reset({
        name: "",
        citizenIdentification: "",
        phoneNumber: "",
        hometown: "",
        job: "",
        passport: "",
        criminalRecord: "[]",
        audioFile: initialFile,
      });
      onUploadSuccess?.();
    },
  });

  const onSubmit: SubmitHandler<UploadVoiceSchemaOutput> = async (values) => {
    await uploadMutation.mutateAsync(values);
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader className={compact ? "pb-3" : undefined}>
        <CardTitle>Đăng ký giọng nói</CardTitle>
        <CardDescription>
          Theo spec API: thông tin cá nhân đi bằng query params, còn file và
          criminal_record đi bằng form-data.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ tên" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="citizenIdentification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CCCD/CMND</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập CCCD/CMND" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hometown"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quê quán</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập quê quán" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="job"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nghề nghiệp</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập nghề nghiệp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hộ chiếu</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số hộ chiếu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="criminalRecord"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Criminal record (JSON array)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder={
                        '[]\nhoặc\n[{"case":"Tội trộm cắp","year":2020}]'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Theo spec phải là chuỗi JSON array. Ví dụ: [] hoặc
                    [&#123;"case":"Tội trộm cắp","year":2020&#125;]
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="audioFile"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>File audio</FormLabel>
                  <FormControl>
                    <VoiceAudioDropzone
                      value={field.value ?? null}
                      onChange={field.onChange}
                      disabled={uploadMutation.isPending}
                      error={fieldState.error?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={uploadMutation.isPending}>
              {uploadMutation.isPending ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Đang upload...
                </>
              ) : (
                "Upload voice"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
