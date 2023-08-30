import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/Newearch';
import TypeList from '@/components/group/group-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useTypesQuery } from '@/data/brand';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { adminOnly } from '@/utils/auth-utils';
import { Config } from '@/config';
//import SalesReportList from '@/components/reportSales/reportSale-list';
import StockReport from '@/components/stockReport/stockReport-list';
import React from 'react';
import { GetFunction } from '@/services/Service';
import Label from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import moment from 'moment';
import cn from 'classnames';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Input from '@/components/ui/input';
import { Menu, Transition } from '@headlessui/react';
import { DownloadIcon } from '@/components/icons/download-icon';
import classNames from 'classnames';
import {
  DownloadTableExcel,
  useDownloadExcel,
} from 'react-export-table-to-excel';
import CsvDownloader from 'react-csv-downloader';
import ReactToPrint from 'react-to-print';
import { MoreIcon } from '@/components/icons/more-icon';
import Pdf from 'react-to-pdf';
import { ExportCSV } from '@/components/stockSaleReport/export';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import { Select } from '@/components/ui/select/select';
import { selectStyles } from '@/components/ui/select/select.styles';
import Button from '@/components/ui/button';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function TypesPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [BusinesDetails, setBusinesDetails] = useState<any>('');
  const [loadingData, setloadingData] = useState(true);
  const [ListData, setListData] = useState([]);
  const [newArr, setNewArr] = useState<any>([]);

  const [startDate, setStartDate] = useState<any>('');
  const [endDate, setEndDate] = useState<any>('');
  const [TableLoader, setTableLoader] = useState(false);
  const [dummyArr, setDummyArr] = useState([]);
  const [showCalander, setShowCalander] = useState(false);
  const [metaData, setMetaData] = useState<any>();
  const [downloadExcel, setDownExcel] = useState<any>([]);
  const [downloadPdf, setDownPdf] = useState<any>([]);
  const [visible, setVisible] = useState(false);
  const [locationArray, setLocationArray] = useState([]);
  const [productArray, setProductArray] = useState([]);
  const [locatiioinId, setLocatiioinId] = useState('');
  const [listPerPage, setListPerPage] = useState(20);
  const inputRef = useRef<HTMLInputElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let businessDetails: any = localStorage.getItem('business_details');
    setBusinesDetails(JSON.parse(businessDetails));
    GetFunction('/product-stock').then((result) => {
      console.log(result);
      setMetaData(result?.tableData);
    });
  }, []);

  React.useEffect(() => {
    GetFunction( '/product-stock?per_page=' + listPerPage ).then((result) => {
      if (result) {
        setListData(result?.tableData.data);
        setNewArr(result?.tableData.data);
      }
    });
  }, [listPerPage]);

  React.useEffect(() => {
    let sDate = moment(new Date()).format('YYYY-MM-DD');
    let eDate = moment(new Date()).format('YYYY-MM-DD');
    setStartDate(sDate);
    setEndDate(eDate);
    GetFunction('/product-stock?per_page=' + listPerPage).then((result) => {
      setListData(result?.tableData.data);
      setNewArr(result?.tableData.data);
    });
    GetFunction('/business-location').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });
      setLocationArray(ordersData);
      setloadingData(false);
    });
    GetFunction('/product').then((result) => {
      console.log(result);

      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.sku,
          label: data.sku,
        };
      });
      setProductArray(ordersData);
      setloadingData(false);
    });
  }, []);

  //   const excelExportData = (NewStart, NewEend, total) => {
  //     GetFunction(
  //       '/stock-sales-report?start_date=' +
  //         NewStart +
  //         '&end_date=' +
  //         NewEend +
  //         '&per_page=' +
  //         total
  //     ).then((result) => {
  //       setDownPdf(result?.data?.products?.data);
  //       let newProductList = result?.data?.products?.data.map((item: any) => {
  //         return {
  //           Sku: item?.sku,
  //           Product: item?.product,
  //           Location: item?.location_name,
  //           Stock: item?.stock,
  //           Unit: item?.total_sold,
  //           Total: Number(item?.total_unit_sold_amount).toFixed(2),
  //         };
  //       });
  //       setDownExcel(newProductList);
  //     });
  //   };

  //   const onhowCalannder = () => {
  //     setShowCalander(!showCalander);
  //     setState([
  //       {
  //         startDate: new Date(),
  //         endDate: new Date(),
  //         key: 'selection',
  //       },
  //     ]);
  //   };

  const onChangeCustomerFilter = (e) => {
    setLocatiioinId(e.id);
    setTableLoader(true);
    GetFunction('/product-stock?location_id=' + e.id).then((result) => {
      setListData(result?.tableData.data);
      setNewArr(result?.tableData.data);
      setTableLoader(false);
    });
  };
  const onChangeCustomerFilterSKU = (e) => {
    setLocatiioinId(e.id);
    setTableLoader(true);
    GetFunction('/product-stock?sku=' + e.value).then((result) => {
      setListData(result?.tableData.data);
      setNewArr(result?.tableData.data);
      setTableLoader(false);
    });
  };
  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  const ChangePagination = (current) => {
    setTableLoader(true);

    GetFunction(
      '/product-stock?page=' + current + '&per_page=' + listPerPage
    ).then((result) => {
      setListData(result?.tableData.data);
      setNewArr(result?.tableData.data);
      setMetaData(result.tableData);
      setTableLoader(false);
    });
  };
  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value);
    setListPerPage(newSize);
    // setCurrentPage(1); // Reset to the first page when changing page size
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;
  console.log(newArr);

  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:w-1/4 xl:mb-0">
            <h1 className="text-xl font-semibold text-heading">
              {t('Stock Report')}
            </h1>
          </div>
          <button
            className="mt-5 flex w-full justify-end text-base font-semibold text-accent md:mt-0 md:ms-5"
            onClick={toggleVisible}
          >
            {t('common:text-filter')}{' '}
            {visible ? (
              <ArrowUp className="mt-1 ms-2" />
            ) : (
              <ArrowDown className="mt-1 ms-2" />
            )}
          </button>
        </div>
        <div
          className={cn(' w-full transition', {
            'visible h-auto': visible,
            'invisible h-0': !visible,
          })}
        >
          <div className="mt-5 flex w-full flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
            <div
              className={cn(
                'flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0'
              )}
            >
              <div className="w-full">
                <Label>{t('Filter by Locatiion')}</Label>
                <Select
                  styles={selectStyles}
                  options={locationArray}
                  onChange={(e) => onChangeCustomerFilter(e)}
                />
              </div>
              <div className="w-full">
                <Label>{t('Filter by SKU')}</Label>
                <Select
                  styles={selectStyles}
                  options={productArray}
                  onChange={(e) => onChangeCustomerFilterSKU(e)}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
      <div className="mb-3 mr-2 flex justify-end">
        <label htmlFor="entries" className="pr-3 pt-1 text-sm">
          Show
        </label>
        <select
          id="entries"
          value={listPerPage}
          onChange={handlePageSizeChange}
          className="rounded border p-1 text-sm"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="-1">All</option>
        </select>
        <label htmlFor="entries" className="pl-3 pt-1 text-sm">
          Entries
        </label>
      </div>
      {/* <div className="mb-3 mr-2 flex justify-end">
        <label htmlFor="entries" className="pr-3 pt-1 text-sm">
          Show
        </label>
        <select
          id="entries"
          value={listPerPage}
          onChange={handlePageSizeChange}
          className="rounded border p-1 text-sm"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="-1">All</option>
        </select>
        <label htmlFor="entries" className="pl-3 pt-1 text-sm">
          Entries
        </label>
      </div> */}
      <StockReport
        tbId="tableId"
        loading={TableLoader}
        list={newArr}
        BusinesDetails={BusinesDetails}
        metaData={metaData}
        paginationChange={(current) => ChangePagination(current)}
      />
    </>
  );
}

TypesPage.authenticate = {
  permissions: adminOnly,
};

TypesPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['table', 'common', 'form'])),
  },
});
