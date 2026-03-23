import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VoiceTop5MatchTable } from "./voice-top5-match-table";
import type {
  VoiceIdentifyItem,
  VoiceIdentifyTwoItem,
} from "../types/voice.types";

interface VoiceSpeakerResultCardProps {
  title: string;
  item: VoiceIdentifyTwoItem;
  onRegisterUnknown: () => void;
  onSelectSegment?: (start: number, end?: number) => void;
}

function formatSeconds(value: number) {
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

function isUnknownSpeaker(item: VoiceIdentifyTwoItem) {
  const message = (item.message || "").toLowerCase();

  return (
    !item.matched_voice_id ||
    message.includes("no matching") ||
    message.includes("unknown") ||
    message.includes("not found")
  );
}

export function VoiceSpeakerResultCard({
  title,
  item,
  onRegisterUnknown,
  onSelectSegment,
}: VoiceSpeakerResultCardProps) {
  const isUnknown = isUnknownSpeaker(item);
  const top5Items: VoiceIdentifyItem[] = isUnknown ? [] : [item];

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {item.message || "Không có mô tả kết quả"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {typeof item.score === "number" ? (
            <Badge variant="secondary">Score: {item.score.toFixed(4)}</Badge>
          ) : null}

          {typeof item.num_speakers === "number" ? (
            <Badge variant="destructive">
              num_speakers: {item.num_speakers}
            </Badge>
          ) : null}
        </div>

        {item.audio_segment && item.audio_segment.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Timestamp / Segment</p>
            <div className="flex flex-wrap gap-2">
              {item.audio_segment.map((segment, index) => (
                <Button
                  key={`${segment.start}-${segment.end}-${index}`}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectSegment?.(segment.start, segment.end)}
                >
                  {formatSeconds(segment.start)} - {formatSeconds(segment.end)}
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        {!isUnknown ? (
          <VoiceTop5MatchTable
            title="Top 5 phù hợp"
            description="Hiện tại dùng dữ liệu match trả về để hiển thị kết quả phù hợp."
            items={top5Items}
            emptyText="Không có dữ liệu top 5."
          />
        ) : (
          <div className="rounded-2xl border border-dashed p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Chưa tìm thấy người phù hợp
              </p>
              <Button type="button" onClick={onRegisterUnknown}>
                Đăng ký giọng nói
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
