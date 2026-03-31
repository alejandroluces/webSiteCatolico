ALTER TABLE daily_content
  ADD COLUMN IF NOT EXISTS gospel_audio_url text,
  ADD COLUMN IF NOT EXISTS reflection_audio_url text,
  ADD COLUMN IF NOT EXISTS prayer_audio_url text;
