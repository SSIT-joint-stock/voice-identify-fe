import { Link } from "react-router-dom";
import { CircleUserRound, Info, MicVocal, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import micWave from "@/assets/micwave.png";

const quickActions = [
  {
    title: "ĐĂNG KÝ GIỌNG NÓI",
    to: ROUTES.VOICE_ENROLL,
    icon: MicVocal,
  },
  {
    title: "TRA CỨU 1 NGƯỜI",
    to: ROUTES.VOICE_SEARCH_SINGLE,
    icon: Search,
  },
  {
    title: "TRA CỨU 1-2 NGƯỜI",
    to: ROUTES.VOICE_SEARCH_MULTI,
    icon: CircleUserRound,
  },
  {
    title: "HƯỚNG DẪN SỬ DỤNG",
    to: ROUTES.VOICE_GUIDE,
    icon: Info,
  },
];

export default function Home() {
  return (
    <div className="space-y-7">
      <section className="rounded-[22px] bg-white px-8 py-8 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
        <div className="grid items-center lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="flex justify-center items-center lg:justify-start">
            <img
              src={micWave}
              alt="Microphone and waveform"
              className="h-auto w-full max-w-80 object-contain xl:max-w-80"
            />
          </div>

          <div className="min-w-0">
            <h1 className="font-serif text-[30px] font-bold leading-tight text-[#4b1d18] md:text-[40px] xl:text-[46px]">
              Hệ thống nhận diện đối tượng dựa trên đặc điểm sinh trắc giọng nói
              và dịch đa ngôn ngữ
            </h1>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.title} to={item.to} className="block">
              <Card className="h-full rounded-[18px] border-0 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-transform duration-200 hover:-translate-y-1">
                <CardContent className="flex min-h-32 flex-col items-center justify-center gap-4 px-6 py-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full text-[#4b140c]">
                    <Icon className="size-11 stroke-[1.8]" />
                  </div>

                  <h2 className="text-[16px] font-bold tracking-wide text-[#4b140c] md:text-[17px]">
                    {item.title}
                  </h2>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
