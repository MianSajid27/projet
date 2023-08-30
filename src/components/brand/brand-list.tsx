import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useEffect, useState } from 'react';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import Badge from '../ui/badge/badge';
// import { site_url } from '@/services/Service';
import defaultImg from '@/assets/images/default.png'
export type IProps = {
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const TypeList = (list: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const columns = [
    {
      title:<span style={{fontFamily:"poppins"}}>{ t('table:table-item-image')}</span>,
      dataIndex: 'image',
      key: 'image',
      align: alignLeft,
      width: 74,
      render: (image: any, { name }: { name: string }) => (
        <>
        {image? 
          <Image
          src={
            image 
          }
          alt={name}
          loader={()=>image}
          layout="fixed"
          width={42}
          height={42}
          className="overflow-hidden rounded object-contain"
        />
      :
      <Image
      src={
        defaultImg
      }
      alt={name}
      // loader={()=>cat_image}
      layout="fixed"
      width={42}
      height={42}
      className="overflow-hidden rounded object-contain"
    />}
        
        </>
     
      ),
    },
    {
      title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-brand')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      render: (name: any) => <span className="whitespace-nowrap" style={{fontFamily:"poppins"}}>{name}</span>,
    },
    {
      title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-status')}</span> ,
      dataIndex: 'name',
      key: 'status',
      align: 'left',
      width: 80,
      render: (status: string, record: any) => (
        <div
          className={`flex justify-start ${
            record?.quantity > 0 && record?.quantity < 10
              ? 'flex-col items-baseline space-y-3 3xl:flex-row 3xl:space-x-3 3xl:space-y-0 rtl:3xl:space-x-reverse'
              : 'items-center space-x-3 rtl:space-x-reverse'
          }`}
          style={{fontFamily:"poppins"}}
        >
          <Badge
            text="Active"
            color={
              status.toLocaleLowerCase() === 'draft'
                ? 'bg-yellow-400'
                : 'bg-accent'
            }
          />
          {record?.quantity > 0 && record?.quantity < 10 && (
            <Badge
              text={t('common:text-low-quantity')}
              color="bg-red-600"
              animate={true}
            />
          )}
        </div>
      ),
    },
    {
      title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-actions')}</span> ,
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      render: (slug: string, record: Type) => (
        <LanguageSwitcher
          isProductList={false}
          slug={slug}
          record={record}
          deleteModalView="DELETE_TYPE"
          routes={Routes?.brands}
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

export default TypeList;
