export default interface Pagination {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  offset: number;
}
