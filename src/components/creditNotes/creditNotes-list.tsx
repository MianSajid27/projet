import { Table } from '@/components/ui/table';
import { BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import Pagination from '@/components/ui/pagination';
import Link from 'next/link';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import ActionButtons from '../common/action-buttons';

export type IProps = {
  listOfBrands: BrandList[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const TypeList = (list: any) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);
  const router = useRouter();


  const columns = [
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-customer-name')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'contact',
      key: 'name',
      align: 'center',
      render: (contact: any) => <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{contact.name}</span>,
    },
    {
      title: <span style={{fontFamily:'poppins'}}>{ t('table:table-item-parent-sale')}</span>,
      className: 'cursor-pointer',
      dataIndex: 'return_parent_sell',
      key: 'id',
      align: 'center',
      render: (row: any) => (
        <Link passHref href={`/sales/invoice/${row.id}`}>
          <span
            style={{ color: 'blue', cursor: 'pointer', fontFamily:'poppins' }}
            className="whitespace-nowrap"
          >
            {row.invoice_no}
          </span>
        </Link>
      ),
    },

    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-credit-note-no')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'invoice_no',
      key: 'name',
      align: 'center',
      render: (invoice_no: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{invoice_no}</span>
      ),
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-date')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'transaction_date',
      key: 'name',
      align: 'center',
      render: (transaction_date: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{transaction_date}</span>
      ),
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-total-amount')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'final_total',
      key: 'name',
      align: 'center',
      render: (final_total: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{final_total}</span>
      ),
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-actions')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'id',
      key: 'name',
      align: 'center',
      render: (slug: any) => (
        <ActionButtons
          id={slug}
          detailsUrl={`/sales/creditNotes/${slug}`}
          isView={true}
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

export default TypeList;
