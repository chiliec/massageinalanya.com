export default function Star({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 21 21"
      fill="currentColor"
      className={className}
    >
      <path d="M10.5 0L13.09 7.91L21 10.5L13.09 13.09L10.5 21L7.91 13.09L0 10.5L7.91 7.91L10.5 0Z" />
    </svg>
  );
}
