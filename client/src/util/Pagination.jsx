import React from 'react';
import { Pagination } from 'react-bootstrap';

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Pagination>
      <Pagination.Prev
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
      {[...Array(totalPages).keys()].map((page) => (
        <Pagination.Item
          key={page + 1}
          active={page + 1 === currentPage}
          onClick={() => onPageChange(page + 1)}
        >
          {page + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </Pagination>
  );
};

export default CustomPagination
