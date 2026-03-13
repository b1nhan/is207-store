export const getPagination = (page, limit) => {
  const currentPage = Math.max(1, parseInt(page) || 1);
  const itemsPerPage = Math.max(1, Math.min(48, parseInt(limit) || 12));
  const offset = (currentPage - 1) * itemsPerPage;

  return {
    limit: itemsPerPage,
    offset,
    currentPage,
  };
};

export const getPaginationData = (totalItems, currentPage, limit) => {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    currentPage,
    totalPages,
    totalItems,
    limit,
  };
};
