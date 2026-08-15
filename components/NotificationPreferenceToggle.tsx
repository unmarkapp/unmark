"use client";

type NotificationPreferenceToggleProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
};

export default function NotificationPreferenceToggle({
  enabled,
  onChange,
  disabled = false,
}: NotificationPreferenceToggleProps) {
  return (
    <label
      className={`flex items-center justify-between gap-3 ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
    >
      <span className="text-sm text-foreground">
        Email me when videos are ready
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="Email me when videos are ready"
        disabled={disabled}
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition ${
          enabled
            ? "border-brand bg-brand"
            : "border-border bg-surface"
        } disabled:cursor-not-allowed`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition ${
            enabled ? "translate-x-[1.35rem]" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );
}
