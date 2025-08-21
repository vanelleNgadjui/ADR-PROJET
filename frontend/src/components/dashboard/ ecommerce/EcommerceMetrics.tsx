import { ArrowDownIcon, ArrowUpIcon, UsersIcon, PackageIcon } from "lucide-react";
import Badge from "../../ui/Badge";

export default function EcommerceMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <UsersIcon className="text-gray-800 w-6 h-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-lg dark:text-white/90">
              3,782
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon className="w-3 h-3" />
            11.01%
          </Badge>
        </div>
      </div>
      {/* Metric Item End */}

      {/* Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <PackageIcon className="text-gray-800 w-6 h-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-lg dark:text-white/90">
              5,359
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon className="w-3 h-3" />
            9.05%
          </Badge>
        </div>
      </div>
      {/* Metric Item End */}
    </div>
  );
}
