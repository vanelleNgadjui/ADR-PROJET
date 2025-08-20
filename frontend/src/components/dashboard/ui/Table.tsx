import React from "react";
import type { ReactNode } from "react";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
  striped?: boolean; // Add striped rows
  hover?: boolean; // Add hover effects
  bordered?: boolean; // Add borders
  variant?: "default" | "card"; // Table variants
  title?: string; // Title for card variant
  actions?: ReactNode; // Actions for card variant
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
  onClick?: () => void; // Click handler for row
  selected?: boolean; // Selected state
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
  align?: "left" | "center" | "right"; // Text alignment
}

// Table Component
const Table: React.FC<TableProps> = ({ 
  children, 
  className = "",
  striped = false,
  hover = false,
  bordered = false,
  variant = "default",
  title,
  actions
}) => {
  if (variant === "card") {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        {(title || actions) && (
          <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
            {title && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  {title}
                </h3>
              </div>
            )}
            {actions && (
              <div className="flex items-center gap-3">
                {actions}
              </div>
            )}
          </div>
        )}
        <div className="max-w-full overflow-x-auto">
          <table className={`min-w-full ${className}`}>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { striped, hover, bordered, variant } as any);
              }
              return child;
            })}
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <table className={`min-w-full ${className}`}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { striped, hover, bordered, variant } as any);
            }
            return child;
          })}
        </table>
      </div>
    </div>
  );
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className = "" }) => {
  return (
    <thead className={`border-b border-gray-100 dark:border-white/[0.05] ${className}`}>
      {children}
    </thead>
  );
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className = "" }) => {
  return <tbody className={`divide-y divide-gray-100 dark:divide-white/[0.05] ${className}`}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ 
  children, 
  className = "",
  onClick,
  selected = false
}) => {
  const rowClasses = `
    ${onClick ? 'cursor-pointer' : ''}
    ${selected ? 'bg-primary-blue/10 dark:bg-primary-blue/20' : ''}
    ${className}
  `.trim();
  
  return (
    <tr 
      className={rowClasses}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className = "",
  align = "left"
}) => {
  const CellTag = isHeader ? "th" : "td";
  const alignClasses = {
    left: "text-start",
    center: "text-center", 
    right: "text-end"
  };
  
  const cellClasses = `
    ${isHeader ? 'px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400' : 'px-5 py-4 sm:px-6 text-gray-500 text-theme-sm dark:text-gray-400'}
    ${alignClasses[align]}
    ${className}
  `.trim();
  
  return <CellTag className={cellClasses}>{children}</CellTag>;
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
