import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import { LoaderCircle, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  uploadVoiceSchema,
  type UploadVoiceSchemaInput,
  type UploadVoiceSchemaOutput,
} from '../schemas/voice.schema';
import { useUploadVoice } from '../hooks/use-voice';
import { VoiceAudioDropzone } from './voice-audio-dropzone';
import { VoiceAudioPlayer } from './voice-audio-player';
import { cropAudioFile } from '@/utils/audio.utils';

interface VoiceUploadFormProps {
  initialFile?: File | null;
  initialStart?: number;
  initialEnd?: number;
  onUploadSuccess?: () => void;
  onFileChange?: () => void;
  compact?: boolean;
}

function getYearOptions() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 50 }, (_, index) => String(currentYear - index));
}

const YEAR_OPTIONS = getYearOptions();

export function VoiceUploadForm({
  initialFile = null,
  initialStart,
  initialEnd,
  onUploadSuccess,
  onFileChange,
  compact = false,
}: VoiceUploadFormProps) {
  const form = useForm<UploadVoiceSchemaInput, unknown, UploadVoiceSchemaOutput>({
    resolver: zodResolver(uploadVoiceSchema),
    defaultValues: {
      name: '',
      citizenIdentification: '',
      phoneNumber: '',
      hometown: '',
      job: '',
      passport: '',
      criminalRecords: [],
      audioFile: initialFile,
      start: initialStart,
      end: initialEnd,
    },
  });

  const watchedAudioFile = useWatch({
    control: form.control,
    name: 'audioFile',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'criminalRecords',
  });

  const uploadMutation = useUploadVoice({
    onSuccess: () => {
      form.reset({
        name: '',
        citizenIdentification: '',
        phoneNumber: '',
        hometown: '',
        job: '',
        passport: '',
        criminalRecords: [],
        audioFile: initialFile,
        start: initialStart,
        end: initialEnd,
      });
      onUploadSuccess?.();
    },
  });

  const onSubmit: SubmitHandler<UploadVoiceSchemaOutput> = async (values) => {
    try {
      let fileToUpload = values.audioFile;

      if (fileToUpload && typeof initialStart === 'number' && typeof initialEnd === 'number') {
        const loadingToast = toast.loading('Đang xử lý cắt âm thanh...');
        try {
          fileToUpload = await cropAudioFile(fileToUpload, initialStart, initialEnd);
          toast.success('Đã xử lý âm thanh đoạn chọn.', { id: loadingToast });
        } catch (cropError) {
          toast.error('Lỗi khi cắt âm thanh: ' + (cropError as Error).message, {
            id: loadingToast,
          });
          return;
        }
      }

      if (!fileToUpload) {
        toast.error('Vui lòng chọn file audio.');
        return;
      }

      await uploadMutation.mutateAsync({
        ...values,
        audioFile: fileToUpload,
      });
    } catch {
      // Error handled by useUploadVoice, but we catch to prevent unhandled rejections
    }
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader className={compact ? 'pb-3' : undefined}>
        <CardTitle>Đăng ký giọng nói</CardTitle>
        <CardDescription>
          Theo spec API: thông tin cá nhân đi bằng query params, còn file và criminal_record đi bằng
          form-data.
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

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <FormLabel>Criminal record</FormLabel>
                  <FormDescription>
                    Thêm từng mục tiền án / tiền sự. Hệ thống sẽ tự đóng gói thành JSON gửi lên
                    server.
                  </FormDescription>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ case: '', year: '' })}
                >
                  <Plus className="mr-2 size-4" />
                  Thêm mục
                </Button>
              </div>

              {fields.length === 0 ? (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  Chưa có mục nào. Nếu không có tiền án / tiền sự, hệ thống sẽ gửi [].
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((fieldItem, index) => (
                    <div
                      key={fieldItem.id}
                      className="grid gap-4 rounded-xl border p-4 md:grid-cols-[1fr_180px_auto]"
                    >
                      <FormField
                        control={form.control}
                        name={`criminalRecords.${index}.case`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nội dung</FormLabel>
                            <FormControl>
                              <Input placeholder="Ví dụ: Tội trộm cắp" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`criminalRecords.${index}.year`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Năm</FormLabel>
                            <FormControl>
                              <select
                                value={field.value}
                                onChange={field.onChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                              >
                                <option value="">Chọn năm</option>
                                {YEAR_OPTIONS.map((year) => (
                                  <option key={year} value={year}>
                                    {year}
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
                          type="button"
                          variant="destructive"
                          onClick={() => remove(index)}
                          className="w-full md:w-auto"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="audioFile"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>File audio</FormLabel>
                  <FormControl>
                    <VoiceAudioDropzone
                      value={field.value ?? null}
                      onChange={(file) => {
                        field.onChange(file);
                        onFileChange?.();
                      }}
                      disabled={uploadMutation.isPending}
                      error={fieldState.error?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <VoiceAudioPlayer file={watchedAudioFile ?? null} title="Audio đăng ký" />

            <Button type="submit" disabled={uploadMutation.isPending}>
              {uploadMutation.isPending ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Đang upload...
                </>
              ) : (
                'Upload voice'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
