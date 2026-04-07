import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPasswordApi } from '@/api/auth.api';

// ─── Validation ────────────────────────────────────────────────────────────
const resetSchema = z
  .object({
    old_password: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    new_password: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
    confirm_new_password: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((d) => d.new_password === d.confirm_new_password, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirm_new_password'],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({ open, onOpenChange }: Props) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { old_password: '', new_password: '', confirm_new_password: '' },
  });

  const onSubmit = async (data: ResetFormValues) => {
    try {
      await resetPasswordApi(data);
      toast.success('Đổi mật khẩu thành công!');
      reset();
      onOpenChange(false);
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || 'Đổi mật khẩu thất bại';
      toast.error(message);
    }
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const passwordField = (
    id: string,
    label: string,
    placeholder: string,
    fieldName: 'old_password' | 'new_password' | 'confirm_new_password',
    show: boolean,
    toggle: () => void,
  ) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold text-[#374151]">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          className="h-11 rounded-lg border-[#e5e7eb] bg-white pr-11 text-base shadow-sm transition-all duration-200 placeholder:text-[#9ca3af] focus:border-[#4b1d18] focus:ring-2 focus:ring-[#4b1d18]/10"
          {...register(fieldName)}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#4b1d18] transition-colors"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {errors[fieldName] && (
        <p className="text-sm text-red-500">{errors[fieldName]?.message}</p>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-110 rounded-2xl p-0 overflow-hidden">
        <div className="bg-linear-to-r from-[#4b1d18] to-[#6b2d20] px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Đổi mật khẩu
            </DialogTitle>
            <DialogDescription className="text-sm text-white/70">
              Nhập mật khẩu hiện tại và mật khẩu mới để thay đổi
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-6 pb-6 pt-4">
          {passwordField(
            'cp-old', 'Mật khẩu hiện tại', 'Nhập mật khẩu hiện tại',
            'old_password', showOld, () => setShowOld((v) => !v),
          )}
          {passwordField(
            'cp-new', 'Mật khẩu mới', 'Ít nhất 6 ký tự',
            'new_password', showNew, () => setShowNew((v) => !v),
          )}
          {passwordField(
            'cp-confirm', 'Xác nhận mật khẩu mới', 'Nhập lại mật khẩu mới',
            'confirm_new_password', showConfirm, () => setShowConfirm((v) => !v),
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="h-11 flex-1 rounded-lg text-base"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 flex-1 rounded-lg bg-[#4b1d18] text-base font-semibold text-white shadow-md hover:bg-[#3a1512] active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang lưu...
                </span>
              ) : (
                'Xác nhận'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
