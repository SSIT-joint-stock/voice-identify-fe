import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, AudioWaveform } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerApi } from '@/api/auth.api';
import { ROUTES } from '@/constants';
import logo1 from '@/assets/logo1.png';
import headerBg from '@/assets/header1.webp';

// ─── Validation ────────────────────────────────────────────────────────────
const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Vui lòng nhập tên người dùng'),
    password: z
      .string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z
      .string()
      .min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// ─── Component ─────────────────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerApi({
        username: data.username,
        password: data.password,
        role: 'ADMIN',
      });
      toast.success('Đăng ký tài khoản thành công!');
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || 'Đăng ký thất bại';
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* ─── Left Branding Panel ─────────────────────────────────── */}
      <div
        className="relative hidden w-[52%] flex-col items-center justify-center overflow-hidden lg:flex"
        style={{ backgroundImage: `url(${headerBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-[#1a0a08]/80 via-[#2d1210]/70 to-[#4b1d18]/60 backdrop-blur-sm" />

        {/* Decorative floating orbs */}
        <div className="absolute top-20 right-16 h-56 w-56 rounded-full bg-[#fad29e]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-16 h-44 w-44 rounded-full bg-[#e8a04a]/8 blur-2xl animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/3 h-28 w-28 rounded-full bg-white/5 blur-2xl animate-pulse [animation-delay:3.5s]" />

        <div className="relative z-10 flex flex-col items-center gap-8 px-12 text-center">
          <div className="flex items-center justify-center rounded-2xl bg-white/10 p-4 backdrop-blur-md ring-1 ring-white/20 shadow-2xl">
            <img src={logo1} alt="Logo" className="h-20 w-20 object-contain" />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-light tracking-[0.25em] uppercase text-[#fad29e]/80">
              Bộ Công An
            </p>
            <h1 className="text-[28px] font-bold leading-tight tracking-wide text-[#fad29e]">
              Cục Kỹ Thuật Nghiệp Vụ
            </h1>
          </div>

          <div className="mx-auto h-px w-32 bg-linear-to-r from-transparent via-[#fad29e]/40 to-transparent" />

          <div className="flex items-center gap-3 text-white/70">
            <AudioWaveform className="h-5 w-5" />
            <p className="text-base font-light">
              Hệ thống nhận diện giọng nói
            </p>
          </div>
        </div>
      </div>

      {/* ─── Right Form Panel ────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center bg-[#f8f9fb] px-6 py-12 lg:px-16">
        <div className="w-full max-w-110">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img src={logo1} alt="Logo" className="h-12 w-12 object-contain" />
            <span className="text-lg font-bold text-[#4b1d18]">Cục Kỹ Thuật Nghiệp Vụ</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-[32px] font-bold tracking-tight text-[#1a1a2e]">
              Đăng ký tài khoản
            </h2>
            <p className="text-base text-[#6b7280]">
              Tạo tài khoản mới để sử dụng hệ thống
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="register-username" className="text-sm font-semibold text-[#374151]">
                Tên người dùng
              </Label>
              <Input
                id="register-username"
                type="text"
                placeholder="Nhập tên người dùng"
                autoComplete="username"
                className="h-12 rounded-xl border-[#e5e7eb] bg-white px-4 text-base shadow-sm transition-all duration-200 placeholder:text-[#9ca3af] focus:border-[#4b1d18] focus:ring-2 focus:ring-[#4b1d18]/10"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="register-password" className="text-sm font-semibold text-[#374151]">
                Mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ít nhất 6 ký tự"
                  autoComplete="new-password"
                  className="h-12 rounded-xl border-[#e5e7eb] bg-white px-4 pr-12 text-base shadow-sm transition-all duration-200 placeholder:text-[#9ca3af] focus:border-[#4b1d18] focus:ring-2 focus:ring-[#4b1d18]/10"
                  {...register('password')}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#4b1d18] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="register-confirm" className="text-sm font-semibold text-[#374151]">
                Xác nhận mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="register-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu"
                  autoComplete="new-password"
                  className="h-12 rounded-xl border-[#e5e7eb] bg-white px-4 pr-12 text-base shadow-sm transition-all duration-200 placeholder:text-[#9ca3af] focus:border-[#4b1d18] focus:ring-2 focus:ring-[#4b1d18]/10"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#4b1d18] transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl bg-[#4b1d18] text-base font-semibold text-white shadow-lg shadow-[#4b1d18]/20 transition-all duration-200 hover:bg-[#3a1512] hover:shadow-xl hover:shadow-[#4b1d18]/30 active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang tạo tài khoản...
                </span>
              ) : (
                'Đăng ký'
              )}
            </Button>
          </form>

          {/* Login link */}
          <p className="mt-8 text-center text-sm text-[#6b7280]">
            Đã có tài khoản?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="font-semibold text-[#4b1d18] underline-offset-4 hover:underline transition-colors"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
