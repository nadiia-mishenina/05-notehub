import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  page: number; // 1-based
  totalPages: number;
  onPageChange: (page: number) => void; // 1-based
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const handlePageChange = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1);
  };

  return (
    <ReactPaginate
      pageCount={totalPages}
      forcePage={page - 1}
      onPageChange={handlePageChange}
      containerClassName={css.pagination}
      pageClassName={css.page}
      pageLinkClassName={css.pageLink}
      previousClassName={css.prev}
      nextClassName={css.next}
      breakClassName={css.break}
      activeClassName={css.active}
      disabledClassName={css.disabled}
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
    />
  );
}