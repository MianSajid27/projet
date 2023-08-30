import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useEffect, useState } from 'react';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';

export type IProps = {
  listOfBrands: BrandList[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const UnitList = (list: any) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);

  const columns = [
    // {
    //   title: t('table:table-item-id'),
    //   dataIndex: 'id',
    //   key: 'id',
    //   align: 'center',
    //   width: 60,
    // },
    // {
    //   title: t('table:table-item-image'),
    //   dataIndex: 'image',
    //   key: 'image',
    //   align: alignLeft,
    //   width: 74,
    //   render: (image: any, { name }: { name: string }) => (
    //     <Image
    //       src="http://localhost:3002/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2Fconversions%2FApples-thumbnail.jpg&w=48&q=75"
    //       alt={name}
    //       layout="fixed"
    //       width={42}
    //       height={42}
    //       className="overflow-hidden rounded"
    //     />
    //   ),
    // },
    {
      title: t('table:table-item-unit'),
      className: 'cursor-pointer',
      dataIndex: 'actual_name',
      key: 'name',
      align: alignLeft,
      // onHeaderCell: () => onHeaderClick('name'),
      render: (actual_name: any) => (
        <span className="whitespace-nowrap">{actual_name}</span>
      ),
    },
    {
      title: t('table:table-item-short-name'),
      className: 'cursor-pointer',
      dataIndex: 'short_name',
      key: 'name',
      align: alignLeft,
      // onHeaderCell: () => onHeaderClick('name'),
      render: (short_name: any) => (
        <span className="whitespace-nowrap">{short_name}</span>
      ),
    },
    {
      title:  t('table:table-item-allow-decimal'),
      className: 'cursor-pointer',
      dataIndex: 'allow_decimal',
      key: 'name',
      // align: "center",
      align: alignRight,

      // onHeaderCell: () => onHeaderClick('name'),
      render: (allow_decimal: any) => (
        <span className="whitespace-nowrap">{allow_decimal}</span>
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
          routes={Routes?.units}
          isView={list.isView}
          isUpdate={list.isUpdate}
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
          columns={columns.map((column:any) => {
            if (column.title === 'Actions') {
              return {
                ...column,
                title: (
                  <span style={{ fontFamily: 'poppins' }}>
                    {column.title}
                  </span>
                ),
                render: (text, record) => (
                  
                  <span style={{ fontFamily: 'poppins' }}>
                    {column.render && typeof column.render === 'function' ? column.render(text, record) : ''}
                  </span>
                ),
              };
            } else {
              return {
                ...column,
                title: (
                  <span style={{ fontFamily: 'poppins' }}>
                    {column.title.props ? column.title.props.children : column.title}
                  </span>
                ),
                render: (text, record) => {
                  const dataIndex = column.dataIndex;
                  const value = record[dataIndex];
          
                  if (typeof value === 'object' && value !== null) {
                    if (Array.isArray(value)) {
                      // Handle array data
                      return (
                        <span style={{ fontFamily: 'poppins' }}>
                          {value.map((item) => (
                            <span key={item}>{item.toString()}</span>
                          ))}
                        </span>
                      );
                    } else {
                      // Handle object data
                      return (
                        <span style={{ fontFamily: 'poppins' }}>
                          {Object.keys(value).map((key) => (
                            <span key={key}>{value[key]?.toString()}</span>
                          ))}
                        </span>
                      );
                    }
                  } else {
                    return (
                      <span style={{ fontFamily: 'poppins' }}>
                        {typeof text === 'undefined' ? '' : text?.toString()}
                      </span>
                    );
                  }
                },
              };
            }
          })}
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

export default UnitList;
