import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import { fetchNotes } from "../../services/noteService";

const PER_PAGE = 12;

export default function App() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setPage(1);
    setSearch(value.trim());
  }, 400);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}

      {isError && <ErrorMessage message={(error as Error).message} />}

      {notes.length > 0 && <NoteList notes={notes} />}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} />
        </Modal>
      )}
    </div>
  );
}
