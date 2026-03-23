import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { VoiceUploadForm } from './voice-upload-form';
import { VoiceAudioPlayer } from './voice-audio-player';
import type { VoiceIdentifyTwoItem } from '../types/voice.types';

interface VoiceEnrollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceFile: File | null;
  speakerItem?: VoiceIdentifyTwoItem | null;
  onEnrollSuccess?: (data: VoiceIdentifyTwoItem) => void;
}

function formatSeconds(value: number) {
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function VoiceEnrollDialog({
  open,
  onOpenChange,
  sourceFile,
  speakerItem,
  onEnrollSuccess,
}: VoiceEnrollDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Đăng ký giọng nói</DialogTitle>
          <DialogDescription>
            Mở form đăng ký để lưu thông tin người nói chưa có trên hệ thống.
            {speakerItem?.audio_segment?.length
              ? ' Có kèm thông tin segment để đối chiếu khi thao tác.'
              : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {sourceFile ? (
            <div className="rounded-lg border p-3 text-sm text-muted-foreground">
              File nguồn: <span className="font-medium">{sourceFile.name}</span>
            </div>
          ) : null}

          {speakerItem?.audio_segment?.length ? (
            <div className="space-y-2 rounded-lg border p-3">
              <p className="text-sm font-medium">Timestamp speaker</p>
              <div className="flex flex-wrap gap-2">
                {speakerItem.audio_segment.map((segment, index) => (
                  <Badge key={`${segment.start}-${segment.end}-${index}`} variant="secondary">
                    {formatSeconds(segment.start)} - {formatSeconds(segment.end)}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}

          <VoiceAudioPlayer file={sourceFile} title="Audio nguồn" />

          <VoiceUploadForm
            initialFile={sourceFile}
            initialStart={
              speakerItem?.audio_segment && speakerItem.audio_segment.length > 0
                ? [...speakerItem.audio_segment].sort(
                    (a, b) => b.end - b.start - (a.end - a.start)
                  )[0].start
                : undefined
            }
            initialEnd={
              speakerItem?.audio_segment && speakerItem.audio_segment.length > 0
                ? [...speakerItem.audio_segment].sort(
                    (a, b) => b.end - b.start - (a.end - a.start)
                  )[0].end
                : undefined
            }
            compact
            onUploadSuccess={(data) => {
              if (data && speakerItem) {
                onEnrollSuccess?.({
                  ...speakerItem,
                  ...data,
                });
              }
              onOpenChange(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
