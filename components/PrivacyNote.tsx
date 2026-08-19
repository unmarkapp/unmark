export default function PrivacyNote({
  className = "mt-4 text-center text-xs leading-relaxed text-muted",
}: {
  className?: string;
}) {
  return (
    <p className={className}>
      Instant stills are processed in your browser — the file never leaves your
      device. Cloud jobs (video, Library, cutouts) use your Unmark account.
    </p>
  );
}
