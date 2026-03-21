import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface VoiceAudioPlayerProps {
  file: File | null;
  title?: string;
  startAt?: number;
}

export function VoiceAudioPlayer({
  file,
  title = "Audio player",
  startAt,
}: VoiceAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (
      typeof startAt === "number" &&
      audioRef.current &&
      Number.isFinite(startAt)
    ) {
      audioRef.current.currentTime = startAt;
    }
  }, [startAt]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      await audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    audioRef.current.pause();
    setIsPlaying(false);
  };

  if (!file || !audioUrl) return null;

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <audio
          ref={audioRef}
          controls
          src={audioUrl}
          className="w-full"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />

        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={togglePlay}>
            {isPlaying ? (
              <>
                <Pause className="mr-2 size-4" />
                Tạm dừng
              </>
            ) : (
              <>
                <Play className="mr-2 size-4" />
                Phát
              </>
            )}
          </Button>

          <p className="text-sm text-muted-foreground break-all">{file.name}</p>
        </div>
      </CardContent>
    </Card>
  );
}
