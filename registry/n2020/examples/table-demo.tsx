import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/n2020/ui/table";

const invoices = [
  { id: "INV-0041", status: "Paid", method: "Card", amount: 250 },
  { id: "INV-0042", status: "Pending", method: "Bank transfer", amount: 1200 },
  { id: "INV-0043", status: "Paid", method: "Card", amount: 80 },
  { id: "INV-0044", status: "Overdue", method: "Bank transfer", amount: 430 },
];

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function TableDemo() {
  const total = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <Table>
      <TableCaption>Invoices issued in March.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right">
              {usd.format(invoice.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">{usd.format(total)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
