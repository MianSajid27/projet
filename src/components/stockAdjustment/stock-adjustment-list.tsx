import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { useState } from 'react';
import Pagination from '@/components/ui/pagination';

export type IProps = {
  listOfBrands: BrandList[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const UserList = (list: any) => {
  
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);

  let columns = [
    {
      title: t('table:table-item-date'),
      dataIndex: 'transaction_date',
      key: 'transaction_date',
      width: 120,
      align: 'center',
         render: (transaction_date: any) => (
        <span className="whitespace-nowrap">{transaction_date}</span>
      ),
    },
    {
      title: t('table:table-item-reference-no'),
      dataIndex: 'ref_no',
      key: 'ref_no',
      width: 120,
      align: 'center',
      render: (ref_no: string) => (
        <span className="truncate whitespace-nowrap">{ref_no}</span>
      ),
    },
    {
      title: t('table:table-item-location'),
      dataIndex: 'location_name',
      key: 'location_from',
      width: 120,
      align: 'center',
      render: (location_name: string) => (
        <span className="truncate whitespace-nowrap">{location_name}</span>
      ),
    },
    
    {
      title: t('table:table-item-adjustment-type'),
      dataIndex: 'adjustment_type',
      key: 'status',
      width: 120,
      align: 'center',
      render: (adjustment_type: string) => (
        <span className="truncate whitespace-nowrap">{adjustment_type}</span>
      ),
    },
    {
      title: t('table:table-item-total-amount'),
      dataIndex: 'final_total',
      key: 'final_total',
      width: 120,
      align: 'center',
      render: (final_total: string) => (
        <span className="truncate whitespace-nowrap">{final_total}</span>
      ),
    },
    {
      title: t('table:table-item-reason'),
      dataIndex: 'additional_notes',
      key: 'additional_notes',
      width: 120,
      align: 'center',
      render: (additional_notes: string) => (
        <span className="truncate whitespace-nowrap">{additional_notes}</span>
      ),
    },

    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      render: (slug: string, record: Type) => (
        <LanguageSwitcher
          isProductList={false}
          slug={slug}
          record={record}
          deleteModalView="DELETE_TYPE"
          routes={Routes?.stockAdjustment}
          isView={false}
          isUpdate={false}
        />
      ),
    },
  ];

  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;
  const currentList = list?.list?.slice(firstItemIndex, lastItemIndex);
  const handlePageSizeChange = (event) => { 
    if(event.target.value=="All"){
      setListPerPage(list?.list.length);
    }else{
      const newSize = parseInt(event.target.value);
      setListPerPage(newSize);
    }
 
    setCurrentPage(1); // Reset to the first page when changing page size
  };


  return (
    <>
      <div className="flex justify-end mb-3 mr-2">
        <label htmlFor="entries" className="text-sm pr-3 pt-1">
          Show
        </label>
        <select
          id="entries"
          // value={listPerPage}
          onChange={handlePageSizeChange}
          className="border rounded text-sm p-1"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="All">All</option>
        </select>
        <label htmlFor="entries" className="text-sm pl-3 pt-1">
          Entries
        </label>
      </div>
      <div className="mb-8 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={currentList}
          rowKey="id"
          scroll={{ x: 380 }}
        />
      </div>

      {list?.list.length > 10 && (
        <div className="flex items-center justify-end">
          <Pagination
            total={list?.list.length}
            current={currentPage}
            pageSize={listPerPage}
            onChange={(val) => setCurrentPage(val)}
            showLessItems
          />
        </div>
      )}
    </>
  );
};

export default UserList;
