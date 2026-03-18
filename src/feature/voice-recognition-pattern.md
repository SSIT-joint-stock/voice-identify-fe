# 🎙️ Voice Identify Project — Tài Liệu Kỹ Thuật

> **Stack:** React + TypeScript · TanStack React Query · Axios · Zustand · Zod · React Hook Form · shadcn/ui · Tailwind CSS

---

## Mục Lục

1. [Cấu trúc thư mục](#1-cấu-trúc-thư-mục)
2. [Axios — Interceptor & Instance](#2-axios--interceptor--instance)
3. [API Layer](#3-api-layer)
4. [TanStack React Query](#4-tanstack-react-query)
5. [Zod — Validation Schema](#5-zod--validation-schema)
6. [React Hook Form + Zod](#6-react-hook-form--zod)
7. [Zustand — State Management](#7-zustand--state-management)
8. [shadcn/ui & Tailwind CSS](#8-shadcnui--tailwind-css)
9. [Luồng hoạt động tổng thể](#9-luồng-hoạt-động-tổng-thể)

---

## 1. Cấu Trúc Thư Mục

```
src/
├── api/
│   └── axios.instance.ts          # Axios instance + interceptors
│
├── features/
│   └── voice/
│       ├── api/
│       │   └── voice.api.ts       # Gọi HTTP tới backend
│       ├── hooks/
│       │   └── useVoice.ts        # TanStack Query mutations
│       ├── schemas/
│       │   └── voice.schema.ts    # Zod schemas
│       ├── store/
│       │   └── voice.store.ts     # Zustand store
│       ├── types/
│       │   └── index.ts           # TypeScript interfaces
│       └── components/
│           ├── VoiceUploadForm.tsx
│           ├── VoiceIdentifyForm.tsx
│           └── VoiceCompareForm.tsx
│
├── components/
│   └── ui/                        # shadcn/ui components
│
└── lib/
    └── utils.ts                   # cn() helper của shadcn
```

---

## 2. Axios — Interceptor & Instance

### 2.1 Tạo Axios Instance

File `src/api/axios.instance.ts` — đây là file **dùng chung toàn app**, không tạo axios mới ở nơi khác.

```typescript
// src/api/axios.instance.ts
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ví dụ: http://localhost:8000/api
  timeout: 30000, // 30 giây — quan trọng cho file upload
  headers: {
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ───
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ localStorage (hoặc từ Zustand store nếu cần)
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Không set Content-Type ở đây — để Axios tự xác định (quan trọng với FormData)
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ─── Response Interceptor ───
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về thẳng data nếu muốn
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Xử lý 401 — token hết hạn, thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        localStorage.setItem('access_token', data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;

        return axiosInstance(originalRequest); // Retry request ban đầu
      } catch {
        // Refresh thất bại — logout
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    // Chuẩn hoá lỗi trả về
    const message =
      (error.response?.data as any)?.detail ||
      (error.response?.data as any)?.message ||
      error.message ||
      'Có lỗi xảy ra';

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
```

### 2.2 Lưu Ý Quan Trọng Khi Upload File

```typescript
// ✅ ĐÚNG — Không set Content-Type thủ công với FormData
// Axios sẽ tự thêm boundary đúng chuẩn: multipart/form-data; boundary=...
formData.append('file', file);
await axiosInstance.post('/upload_voice/', formData);

// ❌ SAI — Set cứng sẽ thiếu boundary, backend không parse được
await axiosInstance.post('/upload_voice/', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }, // BỎ dòng này đi
});
```

---

## 3. API Layer

File `src/features/voice/api/voice.api.ts`

```typescript
import axiosInstance from '@/api/axios.instance';
import { UploadVoiceResponse, IdentifyVoiceResponse, CompareVoiceResponse } from '../types';

export const voiceApi = {
  /**
   * Upload giọng nói của user để đăng ký.
   * POST /upload_voice/
   */
  upload: async (file: File): Promise<UploadVoiceResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await axiosInstance.post<UploadVoiceResponse>('/upload_voice/', formData);
    return data;
  },

  /**
   * Nhận dạng giọng nói từ file ghi âm.
   * POST /identify_voice/
   */
  identify: async (file: File): Promise<IdentifyVoiceResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await axiosInstance.post<IdentifyVoiceResponse>('/identify_voice/', formData);
    return data;
  },

  /**
   * So sánh 2 file giọng nói xem có phải cùng người không.
   * POST /identify_2_voice/
   */
  compare: async (file1: File, file2: File): Promise<CompareVoiceResponse> => {
    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);
    const { data } = await axiosInstance.post<CompareVoiceResponse>('/identify_2_voice/', formData);
    return data;
  },
};
```

### Types — `src/features/voice/types/index.ts`

```typescript
export interface UploadVoiceResponse {
  id: string;
  message: string;
  user_id?: string;
}

export interface IdentifyVoiceResponse {
  matched: boolean;
  user_id: string | null;
  confidence: number; // 0.0 → 1.0
  message: string;
}

export interface CompareVoiceResponse {
  same_person: boolean;
  similarity_score: number;
  message: string;
}
```

---

## 4. TanStack React Query

### 4.1 Cài Đặt & Provider

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

```typescript
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 phút
      retry: 1,
    },
    mutations: {
      retry: 0, // Mutation thất bại không tự retry
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

### 4.2 Query Keys

```typescript
// src/features/voice/hooks/voice.keys.ts
export const voiceKeys = {
  all: ['voice'] as const,
  upload: () => [...voiceKeys.all, 'upload'] as const,
  identify: () => [...voiceKeys.all, 'identify'] as const,
  compare: () => [...voiceKeys.all, 'compare'] as const,
};
```

### 4.3 Modular Hook — `useVoice.ts`

> **Quy tắc:** Không gọi `useMutation` bên ngoài hook. Mọi side-effect network đều đi qua hook.

```typescript
// src/features/voice/hooks/useVoice.ts
import { useMutation } from '@tanstack/react-query';
import { voiceApi } from '../api/voice.api';
import { useVoiceStore } from '../store/voice.store';
import { toast } from 'sonner';

export function useVoice() {
  const { setResult, setLoading } = useVoiceStore();

  // ─── Upload Voice ───
  const uploadVoiceMutation = useMutation({
    mutationFn: voiceApi.upload,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      toast.success('Upload giọng nói thành công!');
      setResult({ type: 'upload', data });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => setLoading(false),
  });

  // ─── Identify Voice ───
  const identifyVoiceMutation = useMutation({
    mutationFn: voiceApi.identify,
    onSuccess: (data) => {
      if (data.matched) {
        toast.success(`Nhận dạng thành công! Độ chính xác: ${(data.confidence * 100).toFixed(1)}%`);
      } else {
        toast.warning('Không tìm thấy giọng nói khớp trong hệ thống.');
      }
      setResult({ type: 'identify', data });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // ─── Compare Voice ───
  const compareVoiceMutation = useMutation({
    mutationFn: ({ file1, file2 }: { file1: File; file2: File }) => voiceApi.compare(file1, file2),
    onSuccess: (data) => {
      toast.success(
        data.same_person
          ? `Cùng một người — điểm tương đồng: ${(data.similarity_score * 100).toFixed(1)}%`
          : 'Hai giọng nói KHÔNG phải cùng một người.'
      );
      setResult({ type: 'compare', data });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    // Mutations
    uploadVoice: uploadVoiceMutation.mutate,
    identifyVoice: identifyVoiceMutation.mutate,
    compareVoice: compareVoiceMutation.mutate,

    // States
    isUploading: uploadVoiceMutation.isPending,
    isIdentifying: identifyVoiceMutation.isPending,
    isComparing: compareVoiceMutation.isPending,

    // Data
    uploadData: uploadVoiceMutation.data,
    identifyData: identifyVoiceMutation.data,
    compareData: compareVoiceMutation.data,
  };
}
```

### 4.4 Các Trạng Thái Mutation Hay Dùng

| State       | Ý nghĩa                    |
| ----------- | -------------------------- |
| `isPending` | Đang chờ response          |
| `isSuccess` | Thành công                 |
| `isError`   | Lỗi                        |
| `data`      | Kết quả trả về khi success |
| `error`     | Object lỗi khi isError     |
| `reset()`   | Reset mutation về idle     |

---

## 5. Zod — Validation Schema

### 5.1 Cài Đặt

```bash
npm install zod
```

### 5.2 Voice File Schema

```typescript
// src/features/voice/schemas/voice.schema.ts
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp3'];

// ─── Schema cho 1 file audio ───
export const audioFileSchema = z
  .instanceof(File, { message: 'Vui lòng chọn một file.' })
  .refine((file) => file.size <= MAX_FILE_SIZE, { message: 'File không được vượt quá 5MB.' })
  .refine((file) => ACCEPTED_AUDIO_TYPES.includes(file.type), {
    message: 'Chỉ chấp nhận định dạng .mp3 và .wav.',
  });

// ─── Schema cho form Upload ───
export const uploadVoiceSchema = z.object({
  file: audioFileSchema,
});

// ─── Schema cho form Identify ───
export const identifyVoiceSchema = z.object({
  file: audioFileSchema,
});

// ─── Schema cho form Compare (2 file) ───
export const compareVoiceSchema = z
  .object({
    file1: audioFileSchema,
    file2: audioFileSchema,
  })
  .refine((data) => data.file1.name !== data.file2.name, {
    message: 'Hai file không được trùng tên nhau.',
    path: ['file2'], // Lỗi sẽ hiển thị ở field file2
  });

// ─── Infer TypeScript types từ schema ───
export type UploadVoiceSchema = z.infer<typeof uploadVoiceSchema>;
export type IdentifyVoiceSchema = z.infer<typeof identifyVoiceSchema>;
export type CompareVoiceSchema = z.infer<typeof compareVoiceSchema>;
```

### 5.3 Validate Thủ Công (Ngoài Form)

```typescript
// Dùng khi không có react-hook-form
const result = audioFileSchema.safeParse(file);

if (!result.success) {
  // result.error.issues[0].message — lấy message lỗi đầu tiên
  toast.error(result.error.issues[0].message);
  return;
}

// result.data — file đã được validate
const validatedFile = result.data;
```

---

## 6. React Hook Form + Zod

### 6.1 Cài Đặt

```bash
npm install react-hook-form @hookform/resolvers
```

### 6.2 Pattern Chuẩn: Controller + FileInput

> **Lưu ý:** `<input type="file">` không dùng `register` được như các input text thông thường — phải dùng `Controller`.

```tsx
// src/features/voice/components/VoiceIdentifyForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { identifyVoiceSchema, IdentifyVoiceSchema } from '../schemas/voice.schema';
import { useVoice } from '../hooks/useVoice';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function VoiceIdentifyForm() {
  const { identifyVoice, isIdentifying, identifyData } = useVoice();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IdentifyVoiceSchema>({
    resolver: zodResolver(identifyVoiceSchema),
  });

  const onSubmit = (values: IdentifyVoiceSchema) => {
    identifyVoice(values.file, {
      onSuccess: () => reset(), // Reset form sau khi thành công
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="identify-file">File giọng nói (.mp3, .wav)</Label>

        <Controller
          name="file"
          control={control}
          render={({ field: { onChange, ref } }) => (
            <Input
              id="identify-file"
              type="file"
              accept=".mp3,.wav"
              ref={ref}
              disabled={isIdentifying}
              onChange={(e) => {
                // Truyền File object (không phải FileList) vào RHF
                onChange(e.target.files?.[0] ?? undefined);
              }}
            />
          )}
        />

        {/* Hiển thị lỗi Zod */}
        {errors.file && <p className="text-sm text-destructive">{errors.file.message}</p>}
      </div>

      <Button type="submit" disabled={isIdentifying} className="w-full">
        {isIdentifying ? 'Đang nhận dạng...' : 'Nhận Dạng Giọng Nói'}
      </Button>

      {/* Hiển thị kết quả */}
      {identifyData && (
        <div
          className={`rounded-lg p-4 text-sm ${
            identifyData.matched ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
          }`}
        >
          {identifyData.matched
            ? `✅ Khớp với user: ${identifyData.user_id} — Độ tin cậy: ${(identifyData.confidence * 100).toFixed(1)}%`
            : '❌ Không tìm thấy giọng nói phù hợp'}
        </div>
      )}
    </form>
  );
}
```

### 6.3 Form So Sánh 2 File

```tsx
// src/features/voice/components/VoiceCompareForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { compareVoiceSchema, CompareVoiceSchema } from '../schemas/voice.schema';
import { useVoice } from '../hooks/useVoice';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function VoiceCompareForm() {
  const { compareVoice, isComparing, compareData } = useVoice();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CompareVoiceSchema>({
    resolver: zodResolver(compareVoiceSchema),
  });

  const onSubmit = (values: CompareVoiceSchema) => {
    compareVoice({ file1: values.file1, file2: values.file2 });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {(['file1', 'file2'] as const).map((fieldName, index) => (
        <div key={fieldName} className="space-y-2">
          <Label>File giọng nói {index + 1}</Label>
          <Controller
            name={fieldName}
            control={control}
            render={({ field: { onChange, ref } }) => (
              <Input
                type="file"
                accept=".mp3,.wav"
                ref={ref}
                disabled={isComparing}
                onChange={(e) => onChange(e.target.files?.[0] ?? undefined)}
              />
            )}
          />
          {errors[fieldName] && (
            <p className="text-sm text-destructive">{errors[fieldName]?.message}</p>
          )}
        </div>
      ))}

      <Button type="submit" disabled={isComparing} className="w-full">
        {isComparing ? 'Đang so sánh...' : 'So Sánh Giọng Nói'}
      </Button>

      {compareData && (
        <div
          className={`rounded-lg p-4 text-sm ${
            compareData.same_person ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {compareData.same_person
            ? `✅ Cùng một người — Độ tương đồng: ${(compareData.similarity_score * 100).toFixed(1)}%`
            : `❌ Khác người — Điểm tương đồng: ${(compareData.similarity_score * 100).toFixed(1)}%`}
        </div>
      )}
    </form>
  );
}
```

### 6.4 Bảng Các API Hay Dùng Của RHF

| API                      | Mục đích                                        |
| ------------------------ | ----------------------------------------------- |
| `useForm({ resolver })`  | Khởi tạo form với Zod resolver                  |
| `handleSubmit(fn)`       | Wrap submit handler, chỉ gọi fn khi valid       |
| `formState.errors`       | Object chứa lỗi validation                      |
| `formState.isSubmitting` | True khi submit đang xử lý                      |
| `reset()`                | Reset toàn bộ form về giá trị mặc định          |
| `setValue(name, value)`  | Set giá trị field thủ công                      |
| `watch(name)`            | Theo dõi giá trị field realtime                 |
| `Controller`             | Wrap controlled inputs (file, select custom...) |

---

## 7. Zustand — State Management

### 7.1 Cài Đặt

```bash
npm install zustand
```

### 7.2 Voice Store

```typescript
// src/features/voice/store/voice.store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UploadVoiceResponse, IdentifyVoiceResponse, CompareVoiceResponse } from '../types';

type VoiceResult =
  | { type: 'upload'; data: UploadVoiceResponse }
  | { type: 'identify'; data: IdentifyVoiceResponse }
  | { type: 'compare'; data: CompareVoiceResponse }
  | null;

interface VoiceState {
  // State
  isLoading: boolean;
  result: VoiceResult;
  history: VoiceResult[]; // Lưu lịch sử các lần nhận dạng

  // Actions
  setLoading: (loading: boolean) => void;
  setResult: (result: NonNullable<VoiceResult>) => void;
  clearResult: () => void;
  clearHistory: () => void;
}

export const useVoiceStore = create<VoiceState>()(
  devtools(
    (set) => ({
      // ─── Initial State ───
      isLoading: false,
      result: null,
      history: [],

      // ─── Actions ───
      setLoading: (loading) => set({ isLoading: loading }, false, 'voice/setLoading'),

      setResult: (result) =>
        set(
          (state) => ({
            result,
            history: [result, ...state.history].slice(0, 10), // Giữ tối đa 10 kết quả
          }),
          false,
          'voice/setResult'
        ),

      clearResult: () => set({ result: null }, false, 'voice/clearResult'),

      clearHistory: () => set({ history: [] }, false, 'voice/clearHistory'),
    }),
    { name: 'VoiceStore' } // Tên hiển thị trong Redux DevTools
  )
);
```

### 7.3 Cách Dùng Zustand Trong Component

```tsx
import { useVoiceStore } from '../store/voice.store';

function VoiceHistory() {
  // ✅ ĐÚNG — Chỉ subscribe field cần thiết, tránh re-render thừa
  const history = useVoiceStore((state) => state.history);
  const clearHistory = useVoiceStore((state) => state.clearHistory);

  // ❌ SAI — Lấy cả store sẽ re-render mỗi khi bất kỳ state nào thay đổi
  // const store = useVoiceStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Lịch sử nhận dạng</h3>
        <button onClick={clearHistory} className="text-sm text-muted-foreground">
          Xoá lịch sử
        </button>
      </div>
      <ul className="space-y-2">
        {history.map((item, index) => (
          <li key={index} className="text-sm border rounded p-2">
            {item?.type === 'identify' && (
              <span>
                {item.data.matched ? '✅' : '❌'} Nhận dạng #{index + 1}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 7.4 Zustand vs useState — Khi Nào Dùng Cái Nào?

| Tình huống                         | Dùng              |
| ---------------------------------- | ----------------- |
| State chỉ dùng trong 1 component   | `useState`        |
| State chia sẻ giữa nhiều component | `Zustand`         |
| State liên quan đến server/network | `TanStack Query`  |
| State form                         | `React Hook Form` |
| Cache/server state                 | `TanStack Query`  |

---

## 8. shadcn/ui & Tailwind CSS

### 8.1 Cài Đặt shadcn/ui

```bash
# Init shadcn vào project Vite + React
npx shadcn-ui@latest init

# Cài các component cần dùng
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add skeleton
```

### 8.2 Helper `cn()` — Merge Tailwind Classes

```typescript
// src/lib/utils.ts — được tạo tự động bởi shadcn
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Dùng cn() để merge class có điều kiện, tránh conflict
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```tsx
// Ví dụ sử dụng cn()
import { cn } from '@/lib/utils';

function StatusBadge({ matched }: { matched: boolean }) {
  return (
    <span
      className={cn(
        'rounded-full px-3 py-1 text-sm font-medium',
        matched ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      )}
    >
      {matched ? 'Khớp' : 'Không khớp'}
    </span>
  );
}
```

### 8.3 Component Wrapper Tổng Thể

```tsx
// src/features/voice/components/VoiceIdentifyPage.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { VoiceUploadForm } from './VoiceUploadForm';
import { VoiceIdentifyForm } from './VoiceIdentifyForm';
import { VoiceCompareForm } from './VoiceCompareForm';

export function VoiceIdentifyPage() {
  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Voice Identify</h1>
        <p className="text-muted-foreground">Hệ thống nhận dạng và xác thực giọng nói</p>
      </div>

      <Separator className="mb-8" />

      <Tabs defaultValue="identify">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="upload">Đăng Ký</TabsTrigger>
          <TabsTrigger value="identify">Nhận Dạng</TabsTrigger>
          <TabsTrigger value="compare">So Sánh</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Đăng Ký Giọng Nói</CardTitle>
              <CardDescription>Upload file để đăng ký giọng nói vào hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <VoiceUploadForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="identify">
          <Card>
            <CardHeader>
              <CardTitle>Nhận Dạng Giọng Nói</CardTitle>
              <CardDescription>Upload file để nhận dạng danh tính qua giọng nói</CardDescription>
            </CardHeader>
            <CardContent>
              <VoiceIdentifyForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare">
          <Card>
            <CardHeader>
              <CardTitle>So Sánh Giọng Nói</CardTitle>
              <CardDescription>
                So sánh 2 file giọng nói xem có phải cùng người không
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VoiceCompareForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### 8.4 Loading Skeleton (Dùng Khi Đang Fetch)

```tsx
import { Skeleton } from '@/components/ui/skeleton';

function ResultSkeleton() {
  return (
    <div className="space-y-2 mt-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

// Dùng trong component
{
  isIdentifying && <ResultSkeleton />;
}
```

### 8.5 Tailwind CSS — Các Class Hay Dùng Trong Project

```tsx
// Layout
'container max-w-2xl mx-auto py-10 px-4'; // Căn giữa, max width
'flex items-center justify-between gap-4'; // Flex row
'grid grid-cols-2 gap-4'; // Grid 2 cột

// Spacing
'space-y-4'; // Vertical gap giữa children
'p-4'; // Padding 1rem
'mt-4 mb-2'; // Margin top/bottom

// Typography
'text-sm text-muted-foreground'; // Text phụ, màu mờ
'font-semibold tracking-tight'; // Text đậm, hẹp hơn
'text-destructive'; // Text lỗi (đỏ theo theme)

// Màu sắc theo semantic (tuân theo theme shadcn)
'bg-green-50 text-green-700'; // Success
'bg-amber-50 text-amber-700'; // Warning
'bg-red-50 text-red-700'; // Error

// Border & Rounded
'rounded-lg border border-border'; // Card border
'rounded-full'; // Badge, pill

// States
'disabled:opacity-50 disabled:cursor-not-allowed';
'hover:bg-accent transition-colors';
```

---

## 9. Luồng Hoạt Động Tổng Thể

```
User chọn file
      │
      ▼
React Hook Form (Controller)
      │  onChange → setValue vào RHF
      ▼
handleSubmit → Zod validate
      │  Lỗi? → hiển thị errors.file.message
      │  OK? → gọi mutation
      ▼
useVoice hook (TanStack Mutation)
      │  onMutate → Zustand setLoading(true)
      ▼
voiceApi.identify(file)
      │  axios.instance.ts → gắn Bearer token
      ▼
POST /identify_voice/ (FormData)
      │
      ▼
onSuccess → toast.success + Zustand setResult + RHF reset
onError   → toast.error
onSettled → Zustand setLoading(false)
      │
      ▼
Component re-render với kết quả mới từ Zustand
```

---

## Tóm Tắt Nguyên Tắc

| Nguyên tắc                                    | Mô tả                                         |
| --------------------------------------------- | --------------------------------------------- |
| **Không gọi axios trực tiếp trong component** | Component → Hook → API Layer                  |
| **Không set Content-Type với FormData**       | Để Axios tự xử lý boundary                    |
| **Zod validate trước khi mutate**             | Dùng zodResolver trong RHF                    |
| **File input dùng Controller**                | Không dùng register cho `<input type="file">` |
| **Subscribe Zustand theo selector**           | Tránh re-render không cần thiết               |
| **Server state dùng TanStack Query**          | Zustand chỉ cho UI state                      |
| **Dùng `cn()` khi merge class có điều kiện**  | Tránh conflict Tailwind                       |
