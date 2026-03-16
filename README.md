# Wedding App (Vite + React + Supabase + Coolify)

## Bước 1: Tạo Supabase project
1. Vào supabase.com → New project
2. Vào SQL Editor → chạy toàn bộ file `supabase/schema.sql`
3. Vào Project Settings → API → copy URL và anon key

## Bước 2: Push lên GitHub
git init && git add . && git commit -m "init" && git remote add origin <url> && git push -u origin main

## Bước 3: Deploy Coolify
1. Coolify → New Resource → Git Repository
2. Chọn repo, branch: main
3. Build Pack: Dockerfile
4. Port: 80
5. Tab Environment Variables → thêm:
   - VITE_SUPABASE_URL=https://xxxx.supabase.co
   - VITE_SUPABASE_ANON_KEY=eyJhbGci...
   - (tuỳ chọn) VITE_ANTHROPIC_API_KEY=sk-ant-...
6. Deploy!

## Edge Function AI (tuỳ chọn)
Vào `supabase/functions/ai-analyze/index.ts` rồi deploy với Supabase CLI.
