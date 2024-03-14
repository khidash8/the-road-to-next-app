'use client';

import { useQueryState, useQueryStates } from 'nuqs';
import { Pagination } from '@/components/pagination';
import {
  paginationParser,
  pagionationOptions,
  searchParser,
} from '../search-params';
import { useEffect, useRef } from 'react';

type TicketPaginationProps = {
  count: number;
  hasNextPage: boolean;
};

const TicketPagination = (props: TicketPaginationProps) => {
  const [pagination, setPagination] = useQueryStates(
    paginationParser,
    pagionationOptions
  );

  // reactive effects

  const [search] = useQueryState('search', searchParser);
  const prevSearch = useRef(search);

  useEffect(() => {
    if (search === prevSearch.current) return;
    prevSearch.current = search;

    setPagination({ ...pagination, page: 0 });
    // add more reactive effects here once needed ...
  }, [search, pagination, setPagination]);

  return (
    <Pagination
      pagination={pagination}
      onPagination={setPagination}
      {...props}
    />
  );
};

export { TicketPagination };