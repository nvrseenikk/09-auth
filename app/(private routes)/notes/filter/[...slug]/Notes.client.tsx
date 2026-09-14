"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { Toaster } from "react-hot-toast";
import Link from "next/link";

import SearchBox from "../../../../../components/SearchBox/SearchBox";
import Pagination from "../../../../../components/Pagination/Pagination";
import NoteList from "../../../../../components/NoteList/NoteList";
import Loader from "../../../../../components/Loader/Loader";
import ErrorMessage from "../../../../../components/ErrorMessage/ErrorMessage";
import { fetchNotes } from "../../../../../lib/api/clientApi";

import styles from "./NotesPage.module.css";

const PER_PAGE = 12;

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", page, searchTerm, tag],
    queryFn: () =>
      fetchNotes({ page, perPage: PER_PAGE, search: searchTerm, tag }),
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = useDebouncedCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, 500);

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    handleSearchChange(value);
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={styles.app}>
      <Toaster position="top-right" />

      <header className={styles.toolbar}>
        <SearchBox value={searchValue} onChange={handleInputChange} />

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        <Link href="/notes/action/create" className={styles.button}>
          Create note +
        </Link>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && notes.length > 0 && <NoteList notes={notes} />}
    </div>
  );
}
