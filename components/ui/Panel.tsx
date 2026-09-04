import { HTMLAttributes } from "react";

export type PanelPadding = "none" | "sm" | "md" | "lg";
export type PanelRadius = "md" | "lg";

const paddings: Record<PanelPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-4 sm:p-5",
  lg: "p-6 sm:p-8",
};

const radii: Record<PanelRadius, string> = {
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
};

export function panelClasses(
  padding: PanelPadding = "md",
  radius: PanelRadius = "lg",
  raised = false,
  className = "",
) {
  return `border border-border ${raised ? "bg-surface-raised" : "bg-surface"} ${radii[radius]} shadow-[0_1px_2px_rgb(var(--shadow-color)/0.03)] transition-shadow duration-200 hover:shadow-[0_2px_8px_rgb(var(--shadow-color)/0.04)] ${paddings[padding]} ${className}`.trim();
}

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  padding?: PanelPadding;
  radius?: PanelRadius;
  /** Use the slightly-lifted surface tone (e.g. panel-on-panel, popovers). */
  raised?: boolean;
}

export default function Panel({
  padding = "md",
  radius = "lg",
  raised = false,
  className = "",
  ...props
}: PanelProps) {
  return (
    <div
      className={panelClasses(padding, radius, raised, className)}
      {...props}
    />
  );
}
