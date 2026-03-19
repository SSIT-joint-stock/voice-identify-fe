import { Link } from "react-router-dom";
import { ArrowRight, BookOpenText, Mic, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Speech-to-Text / Voice Identify
          </p>
          <h1 className="text-4xl font-bold tracking-tight">
            Hệ thống nhận diện giọng nói theo luồng sử dụng thực tế
          </h1>
          <p className="text-muted-foreground">
            Tách riêng trang tra cứu, trang đăng ký giọng nói và trang hướng dẫn
            để thao tác rõ ràng hơn, không còn dồn toàn bộ chức năng vào một
            workspace tab như bản demo ghép nữa.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" className="rounded-xl">
              <Link to={ROUTES.VOICE_SEARCH}>
                Mở trang tra cứu
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="rounded-xl">
              <Link to={ROUTES.VOICE_ENROLL}>Mở trang đăng ký</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardContent className="space-y-3 p-6">
            <Search className="size-6" />
            <h2 className="text-lg font-semibold">Tra cứu giọng nói</h2>
            <p className="text-sm text-muted-foreground">
              Dùng để tải file audio và nhận diện kết quả theo luồng 1 người
              hoặc 1-2 người nói.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="space-y-3 p-6">
            <Mic className="size-6" />
            <h2 className="text-lg font-semibold">Đăng ký giọng nói</h2>
            <p className="text-sm text-muted-foreground">
              Tạo hồ sơ định danh và lưu mẫu giọng nói để phục vụ nhận diện về
              sau.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="space-y-3 p-6">
            <BookOpenText className="size-6" />
            <h2 className="text-lg font-semibold">Hướng dẫn sử dụng</h2>
            <p className="text-sm text-muted-foreground">
              Gợi ý chuẩn bị file audio, lưu ý nghiệp vụ và các khuyến nghị khi
              thao tác.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
