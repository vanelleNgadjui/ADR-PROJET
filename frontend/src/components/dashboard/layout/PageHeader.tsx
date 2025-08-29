import type { ReactNode } from "react";
import { ChevronRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  children?: ReactNode;
}

export default function PageHeader({ 
  title, 
  subtitle, 
  breadcrumbs, 
  actions,
  children 
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumbs - Plus discret */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex mb-3" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && (
                  <ChevronRightIcon className="w-3 h-3 text-gray-300 dark:text-gray-600 mx-1.5" />
                )}
                {item.href ? (
                  <Link
                    to={item.href}
                    className="text-xs font-medium text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {item.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Header Content - Plus compact */}
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {subtitle}
            </p>
          )}
          {children}
        </div>
        
        {/* Actions - Plus subtil */}
        {actions && (
          <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
