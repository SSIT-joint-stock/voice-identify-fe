import { Link } from "react-router-dom";
import { ArrowRight, Mic, Search, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Speech-to-Text / Voice Identify
          </p>
          <h1 className="text-4xl font-bold tracking-tight">
            Hệ thống nhận diện giọng nói theo đúng luồng nghiệp vụ
          </h1>
          <p className="text-muted-foreground">
            Gồm 3 tác vụ chính: đăng ký giọng nói, nhận diện top 5 người giống
            nhất và nhận diện file audio có tối đa 2 người nói.
          </p>

          <div className="pt-2">
            <Button asChild size="lg" className="rounded-xl">
              <Link to={ROUTES.VOICE}>
                Mở workspace
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardContent className="space-y-3 p-6">
            <Mic className="size-6" />
            <h2 className="text-lg font-semibold">Upload Voice</h2>
            <p className="text-sm text-muted-foreground">
              Đăng ký hồ sơ người dùng kèm file audio theo đúng spec API.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="space-y-3 p-6">
            <Search className="size-6" />
            <h2 className="text-lg font-semibold">Identify Top 5</h2>
            <p className="text-sm text-muted-foreground">
              Trả về 5 người giống nhất và sắp xếp theo điểm số giảm dần.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="space-y-3 p-6">
            <UsersRound className="size-6" />
            <h2 className="text-lg font-semibold">Identify 1-2 Speakers</h2>
            <p className="text-sm text-muted-foreground">
              Nhận diện tối đa 2 người nói trong cùng một file audio và hiển thị
              timestamp nếu có.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
