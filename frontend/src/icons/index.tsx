type IconProps = {
  className?: string;
};

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 5c-5.5 0-9.5 5-10 7 0.5 2 4.5 7 10 7s9.5-5 10-7c-0.5-2-4.5-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
    </svg>
  );
}

export function EyeCloseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.3 2.3L2 3.6l2.4 2.4C2.6 7.6 1.2 10.1 1 12c0.5 2 4.5 7 10 7 1.8 0 3.5-0.5 5-1.3l2.7 2.7 1.3-1.3L3.3 2.3zM12 17c-3.9 0-7.2-3.1-8.5-5 0.6-1 1.6-2.4 2.9-3.5l1.8 1.8A5 5 0 0012 17zm8.5-5c-0.7 1.4-2.2 3.4-4.2 4.8l1.5 1.5c2.5-1.8 4.3-4.2 5.2-6.3-0.5-2-4.5-7-10-7-1.1 0-2.1 0.2-3 0.5l1.7 1.7c0.4-0.1 0.9-0.2 1.3-0.2 5.5 0 9.5 5 10 7-0.3 1.2-1.2 2.8-2.5 4.3l1.5 1.5c1.7-1.9 2.9-4 3.3-5.3-0.5-2-4.5-7-10-7 0.3 0 0.7 0 1 0.1z" />
    </svg>
  );
}
