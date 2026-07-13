"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { toast } from "sonner";
import { AudioLines, Camera, FileCheck2, FileUp, Mic, Square } from "lucide-react";
import { uploadToR2 } from "@/lib/upload";

// Long enough for a grandmother to talk through a recipe without being cut off,
// short enough that a phone on 3G can still upload it.
const MAX_RECORD_MS = 8 * 60 * 1000;
const MAX_AUDIO_BYTES = 32 * 1024 * 1024;
const MAX_IMAGE_BYTES = 24 * 1024 * 1024;

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export type MediaCaptureHandle = {
  /** Uploads whatever was picked or recorded, and returns the keys to save. */
  resolve: () => Promise<{ photoKey: string | null; audioKey: string | null }>;
  isRecording: () => boolean;
};

/**
 * Photo and voice-note capture. The voice note is the reason this whole feature
 * exists: a recipe written down is a recipe, a recipe in her own voice is her.
 * Bytes are held locally and only uploaded when the form is submitted, so an
 * abandoned draft costs nothing.
 */
export const MediaCapture = forwardRef<MediaCaptureHandle, { audioHint?: string }>(
  function MediaCapture({ audioHint }, ref) {
    const [photo, setPhoto] = useState<File | null>(null);
    const [audio, setAudio] = useState<File | null>(null);
    const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
    const [recording, setRecording] = useState(false);
    const [recordMs, setRecordMs] = useState(0);

    const cameraInput = useRef<HTMLInputElement>(null);
    const photoInput = useRef<HTMLInputElement>(null);
    const audioInput = useRef<HTMLInputElement>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const previewRef = useRef<string | null>(null);

    // Release the microphone and timers if the page is left mid-recording.
    useEffect(() => {
      return () => {
        releaseMic();
        if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      };
    }, []);

    function releaseMic() {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoStopRef.current) clearTimeout(autoStopRef.current);
      timerRef.current = null;
      autoStopRef.current = null;
    }

    function pickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
      const f = e.target.files?.[0] ?? null;
      e.target.value = ""; // let the same file be picked again after a retake
      if (!f) return;
      if (!f.type.startsWith("image/")) {
        toast.error("Choose a photo.");
        return;
      }
      if (f.size > MAX_IMAGE_BYTES) {
        toast.error("That photo is too large.");
        return;
      }
      setPhoto(f);
    }

    function setNewAudio(f: File) {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      const url = URL.createObjectURL(f);
      previewRef.current = url;
      setAudio(f);
      setAudioPreviewUrl(url);
    }

    function pickAudio(e: React.ChangeEvent<HTMLInputElement>) {
      const f = e.target.files?.[0] ?? null;
      e.target.value = "";
      if (!f) return;
      if (!f.type.startsWith("audio/")) {
        toast.error("Choose an audio file.");
        return;
      }
      if (f.size > MAX_AUDIO_BYTES) {
        toast.error("That recording is too long to upload.");
        return;
      }
      setNewAudio(f);
    }

    async function startRecording() {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
        toast.error("This browser cannot record. Upload an audio file instead.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const recorder = new MediaRecorder(stream);
        chunksRef.current = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        recorder.onstop = () => {
          const mimeType = (recorder.mimeType || "audio/webm").split(";")[0];
          const blob = new Blob(chunksRef.current, { type: mimeType });
          const ext = mimeType.split("/")[1] || "webm";
          setNewAudio(new File([blob], `voice-note.${ext}`, { type: mimeType }));
          releaseMic();
          setRecording(false);
        };
        recorderRef.current = recorder;
        recorder.start();
        setRecording(true);
        setRecordMs(0);
        const startedAt = Date.now();
        timerRef.current = setInterval(() => setRecordMs(Date.now() - startedAt), 250);
        autoStopRef.current = setTimeout(() => recorderRef.current?.stop(), MAX_RECORD_MS);
      } catch {
        toast.error("The microphone is blocked. Allow it in your browser settings.");
      }
    }

    useImperativeHandle(ref, () => ({
      isRecording: () => recording,
      resolve: async () => {
        if (recording) recorderRef.current?.stop();
        let photoKey: string | null = null;
        let audioKey: string | null = null;
        if (photo) {
          toast.loading("Uploading the photo...", { id: "up-photo" });
          try {
            photoKey = await uploadToR2(photo, "photo");
          } finally {
            toast.dismiss("up-photo");
          }
        }
        if (audio) {
          toast.loading("Uploading the voice note...", { id: "up-audio" });
          try {
            audioKey = await uploadToR2(audio, "audio");
          } finally {
            toast.dismiss("up-audio");
          }
        }
        return { photoKey, audioKey };
      },
    }));

    const tile =
      "flex flex-col items-center gap-1.5 rounded-md border border-dashed border-ink-200 bg-parchment px-4 py-5 text-sm text-ink-600 hover:border-accent-700 hover:text-accent-800 transition-colors";

    return (
      <>
        <div>
          <span className="text-xs uppercase tracking-[0.14em] text-ink-500">Photo</span>
          {photo ? (
            <div className="mt-2 flex items-center gap-3 rounded-md border border-ink-200 bg-parchment px-4 py-3 text-sm">
              <FileCheck2 size={18} className="shrink-0 text-accent-700" />
              <span className="min-w-0 flex-1 truncate text-ink-800">{photo.name}</span>
              <button
                type="button"
                onClick={() => setPhoto(null)}
                className="text-xs text-ink-500 hover:text-ink-900"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => cameraInput.current?.click()} className={tile}>
                <Camera size={18} /> Take photo
              </button>
              <button type="button" onClick={() => photoInput.current?.click()} className={tile}>
                <FileUp size={18} /> Upload photo
              </button>
            </div>
          )}
          <input
            ref={cameraInput}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={pickPhoto}
          />
          <input
            ref={photoInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={pickPhoto}
          />
        </div>

        <div className="mt-5">
          <span className="text-xs uppercase tracking-[0.14em] text-ink-500">
            In their own voice
          </span>
          {recording ? (
            <div className="mt-2 flex items-center gap-3 rounded-md border border-accent-700 bg-parchment-dark px-4 py-3 text-sm">
              <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-accent-700" />
              <span className="flex-1 text-ink-800">Recording {formatDuration(recordMs)}</span>
              <button
                type="button"
                onClick={() => recorderRef.current?.stop()}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-300 px-3 py-1.5 text-xs text-ink-900 hover:bg-parchment"
              >
                <Square size={12} /> Stop
              </button>
            </div>
          ) : audio ? (
            <div className="mt-2 space-y-2 rounded-md border border-ink-200 bg-parchment px-4 py-3 text-sm">
              <div className="flex items-center gap-3">
                <AudioLines size={18} className="shrink-0 text-accent-700" />
                <span className="min-w-0 flex-1 truncate text-ink-800">{audio.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
                    previewRef.current = null;
                    setAudio(null);
                    setAudioPreviewUrl(null);
                  }}
                  className="text-xs text-ink-500 hover:text-ink-900"
                >
                  Remove
                </button>
              </div>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio controls className="w-full" src={audioPreviewUrl ?? undefined} />
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button type="button" onClick={startRecording} className={tile}>
                <Mic size={18} /> Record
              </button>
              <button type="button" onClick={() => audioInput.current?.click()} className={tile}>
                <FileUp size={18} /> Upload audio
              </button>
            </div>
          )}
          <input
            ref={audioInput}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={pickAudio}
          />
          <p className="mt-2 text-xs text-ink-500">
            {audioHint ??
              "Sit next to them, press record, and let them talk. This is the part that cannot be recreated later."}
          </p>
        </div>
      </>
    );
  },
);
