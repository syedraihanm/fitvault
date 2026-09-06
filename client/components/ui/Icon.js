const paths = {
  chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="m7 15 3-4 3 2 5-7" /></>,
  dumbbell: <><path d="M6 7v10" /><path d="M18 7v10" /><path d="M3 9v6" /><path d="M21 9v6" /><path d="M6 12h12" /></>,
  list: <><path d="M8 6h12" /><path d="M8 12h12" /><path d="M8 18h12" /><path d="M4 6h.01" /><path d="M4 12h.01" /><path d="M4 18h.01" /></>,
  nutrition: <><path d="M12 20c-4-2-6-5.4-6-9.2C6 8 8 6 10.5 6c.9 0 1.7.3 2.5.9.8-.6 1.6-.9 2.5-.9C18 6 20 8 20 10.8 20 14.6 18 18 12 20Z" /><path d="M12 7c0-2 1-3.5 3-4" /></>,
  trend: <><path d="M4 18 9 13l3 3 8-9" /><path d="M15 7h5v5" /></>,
  bot: <><rect x="5" y="7" width="14" height="12" rx="3" /><path d="M12 3v4" /><path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M9 16h6" /></>,
  settings: <><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" /><path d="m4.9 4.9 1.4 1.4M17.7 17.7l1.4 1.4M4 12H2M22 12h-2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4M12 4V2M12 22v-2" /></>,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.8-3.2 3.1-5 7-5s6.2 1.8 7 5" /></>,
  logout: <><path d="M10 5H5v14h5" /><path d="m14 8 4 4-4 4" /><path d="M18 12H9" /></>,
  menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
  close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
  flame: <><path d="M12 21c4 0 7-2.8 7-7 0-3.4-2.1-6.1-5.8-9.5.2 2.6-.7 4.1-2.2 5.1C10.7 7.4 9 6 9 3 6.2 5.2 5 8.1 5 11.5 5 17.2 8 21 12 21Z" /></>,
  water: <><path d="M12 3S6 10 6 14a6 6 0 0 0 12 0c0-4-6-11-6-11Z" /></>,
  footsteps: <><path d="M8.5 5.5c1.3 2 .8 4.5-.9 5.6-1.7 1.1-3.5-.1-3.7-2.4-.2-2.3 1.1-4.8 2.8-5.2.7-.2 1.3.5 1.8 2Z" /><path d="M16.5 18.5c-1.3-2-.8-4.5.9-5.6 1.7-1.1 3.5.1 3.7 2.4.2 2.3-1.1 4.8-2.8 5.2-.7.2-1.3-.5-1.8-2Z" /></>,
  trophy: <><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" /><path d="M8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M12 12v5M8 21h8M9 17h6" /></>
};

export function Icon({ name, size = 18, strokeWidth = 1.8, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
