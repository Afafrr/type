"use client";
//AI generated
import { buildLeaderboardRows, type LeaderboardRow } from "@/lib/leaderboard";
import type { RoundStartBroadcastPayload } from "@/lib/types";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

export default function Leaderboard({
  roundInfo,
  progressByPlayer,
  roundStartsAt,
  roundEndsAt,
  className,
}: {
  roundInfo: RoundStartBroadcastPayload | null;
  progressByPlayer: Record<string, string>;
  roundStartsAt: number | null;
  roundEndsAt: number | null;
  className?: string;
}) {
  const sentence = roundInfo?.sentence ?? "";
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!roundStartsAt) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [roundStartsAt]);

  const data = useMemo<LeaderboardRow[]>(() => {
    return buildLeaderboardRows({
      progressByPlayer,
      sentence,
      now,
      roundStartsAt,
      roundEndsAt,
    });
  }, [progressByPlayer, sentence, now, roundStartsAt, roundEndsAt]);

  const columns = useMemo<ColumnDef<LeaderboardRow>[]>(
    () => [
      {
        header: "Player",
        accessorKey: "playerId",
        cell: (info) => <span className="font-semibold">{info.getValue<string>()}</span>,
      },
      {
        header: "Status",
        accessorKey: "isComplete",
        cell: (info) => (info.getValue<boolean>() ? "Completed" : "In progress"),
        sortingFn: "basic",
      },
      {
        header: "Progress (%)",
        accessorKey: "progressPct",
        cell: (info) => `${info.getValue<number>().toFixed(0)}%`,
        sortingFn: "basic",
      },
      {
        header: "Accuracy (%)",
        accessorKey: "accuracyPct",
        cell: (info) => `${info.getValue<number>().toFixed(0)}%`,
        sortingFn: "basic",
      },
      {
        header: "WPM",
        accessorKey: "wpm",
        cell: (info) => info.getValue<number>().toFixed(1),
        sortingFn: "basic",
      },
    ],
    [],
  );

  const [sorting, setSorting] = useState<SortingState>([{ id: "progressPct", desc: true }]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={className}>
      <h2 className="font-bold text-xl mb-3">Leaderboard</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-semibold">
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className="inline-flex items-center gap-2"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: "▲", desc: "▼" }[header.column.getIsSorted() as string] ?? ""}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                  Waiting for progress updates...
                </td>
              </tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
