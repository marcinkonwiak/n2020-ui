"use client";

import { useState } from "react";
import { DataTablePagination } from "@/registry/n2020/components/data-table-pagination";

export default function DataTablePaginationDemo() {
  const [page, setPage] = useState(3);
  const [pageSize, setPageSize] = useState(20);

  return (
    <div className="w-full">
      <DataTablePagination
        page={page}
        pageSize={pageSize}
        total={128}
        itemName="invoices"
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
}
