export const SplunkIcon = ({
  size = 16,
  className = '',
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 0V3.8L15.4286 8.86667L0 15.4584V19L18 11.4V6.33333L0 0Z"
      fill="currentColor"
    />
  </svg>
);
