/**
 * A recording, presented as the primary artefact rather than an attachment.
 * When a person is gone, this is the only part of an entry that still sounds
 * like them, so it sits above the text, not below it.
 */
export function VoiceNote({
  src,
  toldBy,
  transcript,
}: {
  src: string;
  toldBy?: string | null;
  transcript?: string | null;
}) {
  return (
    <section className="my-8 rounded-md border border-ink-100 bg-parchment-dark p-5 not-prose">
      <p className="text-xs uppercase tracking-[0.16em] text-accent-700">
        {toldBy ? `In ${toldBy}'s own voice` : "In their own voice"}
      </p>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio controls preload="none" src={src} className="mt-3 w-full" />
      {transcript ? (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs uppercase tracking-[0.12em] text-accent-700">
            What they said
          </summary>
          <p className="mt-2 whitespace-pre-wrap text-sm text-ink-700">{transcript}</p>
        </details>
      ) : null}
    </section>
  );
}
