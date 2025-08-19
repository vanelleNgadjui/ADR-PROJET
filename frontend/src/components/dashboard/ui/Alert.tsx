import { Link } from "react-router-dom";
import { CheckCircleIcon, AlertTriangleIcon, InfoIcon, XCircleIcon } from "lucide-react";

interface AlertProps {
  variant: "success" | "error" | "warning" | "info" | "gray"; // Alert type
  title: string; // Title of the alert
  message: string; // Message of the alert
  showLink?: boolean; // Whether to show the "Learn More" link
  linkHref?: string; // Link URL
  linkText?: string; // Link text
  onClose?: () => void; // Close handler
  className?: string; // Additional classes
}

const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  message,
  showLink = false,
  linkHref = "#",
  linkText = "En savoir plus",
  onClose,
  className = "",
}) => {
  // Tailwind classes for each variant
  const variantClasses = {
    success: {
      container:
        "border-secondary-mint bg-secondary-mint/10 dark:border-secondary-mint/30 dark:bg-secondary-mint/15",
      icon: "text-secondary-mint",
    },
    error: {
      container:
        "border-secondary-coral bg-secondary-coral/10 dark:border-secondary-coral/30 dark:bg-secondary-coral/15",
      icon: "text-secondary-coral",
    },
    warning: {
      container:
        "border-yellow-500 bg-yellow-500/10 dark:border-yellow-500/30 dark:bg-yellow-500/15",
      icon: "text-yellow-500",
    },
    info: {
      container:
        "border-primary-blue bg-primary-blue/10 dark:border-primary-blue/30 dark:bg-primary-blue/15",
      icon: "text-primary-blue",
    },
    gray: {
      container:
        "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50",
      icon: "text-gray-500 dark:text-gray-400",
    },
  };

  // Icon for each variant
  const icons = {
    success: <CheckCircleIcon className="w-5 h-5" />,
    error: <XCircleIcon className="w-5 h-5" />,
    warning: <AlertTriangleIcon className="w-5 h-5" />,
    info: <InfoIcon className="w-5 h-5" />,
    gray: <InfoIcon className="w-5 h-5" />,
  };

  return (
    <div
      className={`rounded-xl border p-4 ${variantClasses[variant].container} ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className={`-mt-0.5 ${variantClasses[variant].icon}`}>
          {icons[variant]}
        </div>

        <div className="flex-1">
          <h4 className="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h4>

          <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>

          {showLink && (
            <Link
              to={linkHref}
              className="inline-block mt-3 text-sm font-medium text-gray-500 underline hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {linkText}
            </Link>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <XCircleIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
