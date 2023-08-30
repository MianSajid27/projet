import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Badge from '@/components/ui/badge/badge';
import Pagination from '@/components/ui/pagination';
import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { UpdateIsActive } from '@/services/Service';
import { toast } from 'react-toastify';
import { DotsIcons } from '../icons/sidebar';

export type IProps = {
  listOfBrands: BrandList[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const ProductList = (list: any) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);

  const columns = [
    {
      title:<span  style={{fontFamily:"poppins"}}>{t('common:code')}</span> ,
      dataIndex: 'code',
      key: 'image',
      align: alignLeft,
      render: (code: any) => <span className="whitespace-nowrap" style={{fontFamily:"poppins"}}>{code}</span>,
    },
    {
      title:<span style={{fontFamily:"poppins"}}>{t('common:amount')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'amount',
      key: 'name',
      align: alignLeft,
      render: (amount: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:"poppins"}}>{amount}</span>
      ),
    },

    // {
    //   title: t('common:radio'),
    //   className: 'cursor-pointer',
    //   dataIndex: 'radio',
    //   key: 'name',
    //   align: alignLeft,
    //   render: (radio: any) => (
    //     <span className="whitespace-nowrap">{radio}</span>
    //   ),
    // },
    {
      title:<span style={{fontFamily:"poppins"}}>{t('common:qty')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'qty',
      key: 'name',
      align: alignLeft,
      render: (qty: any) => <span className="whitespace-nowrap" style={{fontFamily:"poppins"}}>{qty}</span>,
    },
    {
      title:<span style={{fontFamily:"poppins"}}>{t('common:account')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'account',
      key: 'name',
      align: alignLeft,
      render: (account: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:"poppins"}}>{account}</span>
      ),
    },
    {
      title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-start-date')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'start_date',
      key: 'name',
      align: alignLeft,
      render: (date: any) => <span className="whitespace-nowrap " style={{fontFamily:"poppins"}}>{date}</span>,
    },
    {
      title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-end-date')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'expire_date',
      key: 'name',
      align: alignLeft,
      render: (date: any) => <span className="whitespace-nowrap" style={{fontFamily:"poppins"}}>{date}</span>,
    },
    {
      title:<span style={{fontFamily:"poppins"}}>{t('common:used-code')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'used_count',
      key: 'name',
      align: alignLeft,
      render: (used_count: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:"poppins"}}>{used_count}</span>
      ),
    },
    {
      title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-actions')}</span> ,
      dataIndex: 'id',
      key: 'id',
      align: alignRight,
      render: (slug: string, record: any) => (
        <LanguageSwitcher
          isProductList={false}
          slug={slug}
          record={record}
          deleteModalView="DELETE_TAG"
          routes={Routes?.coupons}
          isUpdate={true}
          isView={false}
          isDelete={true}
          deleteAPIendPoint="/del-coupon"
        />
      ),
    },
  ];


  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;
  const currentList = list?.list?.data?.slice(firstItemIndex, lastItemIndex);
  const handlePageSizeChange = (event) => { 
    if(event.target.value=="All"){
      setListPerPage(list?.list?.data.length);
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
    </>
  );
};

export default ProductList;
