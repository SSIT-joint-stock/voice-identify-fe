import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VoiceUploadForm } from "./voice-upload-form";
import type { VoiceIdentifyTwoItem } from "../types/voice.types";

interface VoiceEnrollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceFile: File | null;
  speakerItem?: VoiceIdentifyTwoItem | null;
}

export function VoiceEnrollDialog({
  open,
  onOpenChange,
  sourceFile,
  speakerItem,
}: VoiceEnrollDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Đăng ký giọng nói</DialogTitle>
          <DialogDescription>
            Mở form đăng ký để lưu thông tin người nói chưa có trên hệ thống.
            {speakerItem?.audio_segment?.length
              ? " Có kèm thông tin segment để đối chiếu khi thao tác."
              : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {sourceFile ? (
            <div className="rounded-lg border p-3 text-sm text-muted-foreground">
              File nguồn: <span className="font-medium">{sourceFile.name}</span>
            </div>
          ) : null}

          <VoiceUploadForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
