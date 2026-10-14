"use client";

import {
  type ColumnDef,
  type ColumnVisibilityState,
  columnVisibilityFeature,
  functionalUpdate,
  type RowData,
  tableFeatures,
  type Updater,
  useTable,
} from "@tanstack/react-table";
import { Columns3Icon } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

import { cn } from "@/registry/n2020/lib/utils";
import { Button } from "@/registry/n2020/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/registry/n2020/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/n2020/ui/table";

export const dataTableFeatures = tableFeatures({ columnVisibilityFeature });

type DataTableProps<TData extends RowData> = {
  columns: ColumnDef<typeof dataTableFeatures, TData>[];
  data: TData[];
  columnWidths?: Record<string, number>;
  fillColumnId?: string;
  toolbar?: ReactNode;
  footer?: ReactNode;
  storageKey?: string;
  className?: string;
};

export function DataTable<TData extends RowData>({
  columns,
  data,
  columnWidths,
  fillColumnId,
  toolbar,
  footer,
  storageKey,
  className,
}: DataTableProps<TData>) {
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({});

  function handleColumnVisibilityChange(
    updater: Updater<ColumnVisibilityState>,
  ) {
    const next = functionalUpdate(updater, columnVisibility);
    setColumnVisibility(next);
    if (!storageKey) return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(Object.keys(next).filter((id) => next[id] === false)),
      );
    } catch {
      // Keep the current selection if storage is unavailable.
    }
  }

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    state: { columnVisibility },
    onColumnVisibilityChange: handleColumnVisibilityChange,
  });
  const getAllLeafColumns = table.getAllLeafColumns;

  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(saved)) {
        const hidden = new Set(saved);
        setColumnVisibility(
          Object.fromEntries(
            getAllLeafColumns()
              .filter((column) => column.getCanHide() && hidden.has(column.id))
              .map((column) => [column.id, false]),
          ),
        );
      }
    } catch {
      // Storage may be unavailable or contain invalid data.
    }
  }, [storageKey, getAllLeafColumns]);

  const visibleColumns = table.getVisibleLeafColumns();
  const fillColumn =
    visibleColumns.find((column) => column.id === fillColumnId) ??
    visibleColumns[0];

  return (
    <div
      data-slot="data-table"
      className={cn("flex min-w-0 flex-col gap-4", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        {toolbar}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
            <Columns3Icon data-icon="inline-start" />
            Columns
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {table
              .getAllLeafColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(visible) =>
                    column.toggleVisibility(visible)
                  }
                >
                  {typeof column.columnDef.header === "string"
                    ? column.columnDef.header
                    : column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="min-w-0 overflow-hidden border">
        <Table
          className={columnWidths ? "table-fixed" : undefined}
          style={
            columnWidths
              ? {
                  minWidth: visibleColumns.reduce(
                    (total, column) => total + columnWidths[column.id],
                    0,
                  ),
                  width: "100%",
                }
              : undefined
          }
        >
          {columnWidths && (
            <colgroup>
              {visibleColumns.map((column) => (
                <col
                  key={column.id}
                  style={
                    column.id === fillColumn?.id
                      ? undefined
                      : { width: columnWidths[column.id] }
                  }
                />
              ))}
            </colgroup>
          )}
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        columnWidths
                          ? "overflow-hidden text-ellipsis"
                          : undefined
                      }
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {footer}
    </div>
  );
}
