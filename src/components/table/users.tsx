import { useQuery } from "@tanstack/react-query";
import { authClient } from "#/lib/auth-client";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
	type PaginationState,
	type SortingState,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import {
	ArrowDownAzIcon,
	ArrowUpZaIcon,
	EditIcon,
	InfoIcon,
	MonitorDotIcon,
} from "lucide-react";
import { CreateUserSheet } from "../actions/create-user.sheet";
import { DeleteUserDialog } from "../actions/delete-user.alert";
import { Badge } from "../ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { BannedUserDialog } from "../actions/banned-user.dialog";
import { UnbannedUserAlert } from "../actions/unbanned-user.alert";
import { UserInformationDialog } from "../actions/user-information.dialog";

type User = {
	id: string;
	name: string;
	username: string;
	role: string;
	email: string;
	banned: boolean | null;
	banReason: string | undefined | null;
	banExpires: Date | undefined | null;
	updatedAt: Date;
	createdAt: Date;
};

const columnHelper = createColumnHelper<User>();

const columns = [
	columnHelper.display({
		id: "rowNumber",
		header: "No",
		cell: (info) => {
			const { pageIndex, pageSize } = info.table.getState().pagination;
			return pageIndex * pageSize + info.row.index + 1;
		},
		enableSorting: false,
	}),
	columnHelper.accessor("username", {
		header: "Username",
		cell: (info) => info.getValue() || "-",
	}),
	columnHelper.accessor("name", {
		header: "Name",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("email", {
		header: "Email",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("role", {
		header: "Role",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("banned", {
		header: "Status",
		cell: (info) => {
			const status = info.getValue();
			const data = info.row.original;

			return (
				<Tooltip>
					<TooltipTrigger asChild>
						<Badge variant={status ? "destructive" : "default"}>
							{status ? "Banned" : "Active"}
						</Badge>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						{status ? (
							<>
								<h2>Di Blokir Sampai</h2>
								<p>
									{data.banExpires
										? data.banExpires.toLocaleDateString("id-ID", {
											day: "numeric",
											month: "short",
											year: "numeric",
										})
										: "-"}
								</p>
								<br />
								<h2>Alasan Pembelokiran</h2>
								<p>{data.banReason ?? "-"}</p>
							</>
						) : (
							"Pengguna Aktif"
						)}
					</TooltipContent>
				</Tooltip>
			);
		},
		enableSorting: false,
	}),
	columnHelper.accessor("createdAt", {
		header: "Tanggal Dibuat",
		cell: (info) => {
			const date = info.getValue();
			return date
				? date.toLocaleDateString("id-ID", {
					day: "numeric",
					month: "short",
					year: "numeric",
				})
				: "-";
		},
	}),
	columnHelper.accessor("updatedAt", {
		header: "Perubahan Terakhir",
		cell: (info) => {
			const date = info.getValue();
			return date
				? date.toLocaleDateString("id-ID", {
					day: "numeric",
					month: "short",
					year: "numeric",
				})
				: "-";
		},
	}),
	columnHelper.display({
		id: "action",
		header: "Action",
		cell: (info) => {
			const data = info.row.original;

			return (
				<span className="space-x-0.5">
					<UserInformationDialog userId={data.id} />
					{data.role !== "admin" && (
						<>
							{data.banned ? (
								<UnbannedUserAlert userId={data.id} />
							) : (
								<BannedUserDialog userId={data.id} />
							)}
							<DeleteUserDialog userId={data.id} />
						</>
					)}
				</span>
			);
		},
	}),
];

export const UserTable = () => {
	const [search, setSearch] = useState<string>("");
	const [sorting, setSorting] = useState<SortingState>([]);
	const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	const pagination = { pageIndex, pageSize };

	const { data, isLoading } = useQuery({
		queryKey: ["users", pagination, sorting, search],
		queryFn: async () => {
			const currentSort = sorting[0];
			const sortBy = currentSort ? currentSort.id : "name";
			const sortDirection = currentSort
				? currentSort.desc
					? "desc"
					: "asc"
				: "desc";

			const { data, error } = await authClient.admin.listUsers({
				query: {
					limit: pageSize,
					offset: pageIndex * pageSize,
					sortBy: sortBy,
					sortDirection: sortDirection,
					...(search && {
						searchField: "name",
						searchValue: search,
						searchOperator: "contains",
					}),
				},
			});

			if (error) throw new Error(error.message);
			return data;
		},
		select: (rawData) => {
			return {
				users: rawData.users.map((user) => ({
					id: user.id,
					username: user.username,
					name: user.name,
					email: user.email,
					role: user.role as string,
					banned: user.banned,
					banReason: user.banReason,
					banExpires: user.banExpires,
					updatedAt: new Date(user.updatedAt),
					createdAt: new Date(user.createdAt),
				})),
				total: rawData.total,
			};
		},
	});

	const table = useReactTable({
		data: data?.users ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		rowCount: data?.total ?? 0,
		state: {
			pagination,
			sorting,
		},
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		manualPagination: true,
		manualSorting: true,
	});

	return (
		<div>
			<div className="flex items-center justify-between py-4">
				<Input
					placeholder="Filter Name..."
					value={search}
					onChange={(event) => {
						setSearch(event.target.value);
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
					className="max-w-sm"
				/>
				<CreateUserSheet />
			</div>

			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											onClick={header.column.getToggleSortingHandler()}
										>
											{header.isPlaceholder ? null : (
												<div
													className={
														header.column.getCanSort()
															? "cursor-pointer select-none flex items-center gap-2 hover:text-foreground"
															: ""
													}
												>
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
													{{
														asc: <ArrowUpZaIcon className="h-4 w-4" />,
														desc: <ArrowDownAzIcon className="h-4 w-4" />,
													}[header.column.getIsSorted() as string] ?? null}
												</div>
											)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Memuat data...
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Tidak ada hasil.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between py-4">
				<div className="text-sm text-muted-foreground">
					Total <strong>{data?.total ?? 0}</strong> baris data.
				</div>

				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<span className="text-sm">
						Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
						{table.getPageCount() || 1}
					</span>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
};
