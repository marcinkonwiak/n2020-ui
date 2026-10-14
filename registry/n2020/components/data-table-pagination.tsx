"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { useId } from "react";
import { cn } from "@/registry/n2020/lib/utils";
import { Button } from "@/registry/n2020/ui/button";
import { Label } from "@/registry/n2020/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/n2020/ui/select";

const pageSizes = [10, 20, 30, 40, 50] as const;

export function DataTablePagination({
  page,
  pageSize,
  total,
  itemName,
  onPageChange,
  onPageSizeChange,
  className,
}: {
  page: number;
  pageSize: number;
  total: number;
  itemName: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: (typeof pageSizes)[number]) => void;
  className?: string;
}) {
  const rowsPerPageId = useId();
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const firstRow = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastRow = Math.min(page * pageSize, total);

  return (
    <div
      data-slot="data-table-pagination"
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 text-sm",
        className,
      )}
    >
      <span className="text-muted-foreground">
        {firstRow}–{lastRow} of {total} {itemName}
      </span>
      <div className="flex flex-wrap items-center gap-4 lg:gap-8">
        <div className="flex items-center gap-2">
          <Label htmlFor={rowsPerPageId}>Rows per page</Label>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              const selectedSize = pageSizes.find(
                (size) => size === Number(value),
              );
              if (selectedSize) onPageSizeChange(selectedSize);
            }}
          >
            <SelectTrigger id={rowsPerPageId} size="sm" className="w-20">
              <SelectValue>{pageSize}</SelectValue>
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                {pageSizes.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <span className="font-medium">
          Page {page} of {pageCount}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pageCount}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(pageCount)}
            disabled={page >= pageCount}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
