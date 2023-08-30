import { Table, AlignType } from '@/components/ui/table';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Author, MappedPaginatorInfo } from '@/types';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';

const AuthorList = (list: any) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);

  let columns = [
    {
      title:<span style={{fontFamily:"poppins"}}>{ t('common:variant-type')}</span>,
      dataIndex: 'name',
      key: 'name',
      width: 200,
      align: 'center' as AlignType,
      ellipsis: true,
      render: (name: any) => (
        <span className="truncate whitespace-nowrap" style={{fontFamily:"poppins"}}>{name}</span>
      ),
    },
    {
      title: <span style={{fontFamily:"poppins"}}>{t('common:variant-value')}</span>,
      dataIndex: 'values',
      key: 'name',
      align: 'left' as AlignType,

      ellipsis: true,
      render: (row: any) => (
        <ul style={{ columnCount: 8, fontFamily:"poppins" }}>
          {row.map((resss: any, index: number) => (
            <li key={index}>{resss.name},</li>
          ))}
        </ul>
      ),
    },
    {
      title: <span style={{fontFamily:"poppins"}}>{ t('table:table-item-actions')}</span>,
      dataIndex: 'id',
      key: 'actions',
      width: 300,
      align: 'right' as AlignType,
      render: (id: string, record: Author) => (
        <LanguageSwitcher
          isProductList={false}
          slug={id}
          record={record}
          deleteModalView="DELETE_AUTHOR"
          routes={Routes?.variant}
          isUpdate={list.isUpdate}
          isView={list.isView}
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

export default AuthorList;
