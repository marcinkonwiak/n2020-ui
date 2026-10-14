"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import {
  DataTable,
  type dataTableFeatures,
} from "@/registry/n2020/components/data-table";
import { DataTablePagination } from "@/registry/n2020/components/data-table-pagination";
import { Badge } from "@/registry/n2020/ui/badge";

type Member = { name: string; email: string; role: "admin" | "member" };

const members: Member[] = [
  { name: "Ada Okafor", email: "ada@example.com", role: "admin" },
  { name: "Ben Lindqvist", email: "ben@example.com", role: "member" },
  { name: "Chloe Tanaka", email: "chloe@example.com", role: "member" },
  { name: "Dmitri Volkov", email: "dmitri@example.com", role: "member" },
  { name: "Elena Rossi", email: "elena@example.com", role: "admin" },
  { name: "Farid Haddad", email: "farid@example.com", role: "member" },
  { name: "Grace Mbeki", email: "grace@example.com", role: "member" },
  { name: "Hugo Lambert", email: "hugo@example.com", role: "member" },
  { name: "Ines Carvalho", email: "ines@example.com", role: "member" },
  { name: "Jonas Weber", email: "jonas@example.com", role: "member" },
  { name: "Keiko Arai", email: "keiko@example.com", role: "admin" },
  { name: "Liam Byrne", email: "liam@example.com", role: "member" },
];

const columnHelper = createColumnHelper<typeof dataTableFeatures, Member>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Name",
    enableHiding: false,
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
  }),
  columnHelper.accessor("email", { header: "Email" }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: ({ getValue }) => (
      <Badge variant={getValue() === "admin" ? "default" : "secondary"}>
        {getValue()}
      </Badge>
    ),
  }),
]);

export default function DataTableDemo() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={members.slice((page - 1) * pageSize, page * pageSize)}
        footer={
          <DataTablePagination
            page={page}
            pageSize={pageSize}
            total={members.length}
            itemName="members"
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        }
      />
    </div>
  );
}
