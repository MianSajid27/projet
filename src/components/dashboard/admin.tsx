import { CartIconBig } from '@/components/icons/cart-icon-bag';
import { CoinIcon } from '@/components/icons/coin-icon';
import ColumnChart from '@/components/widgets/column-chart';
import StickerCard from '@/components/widgets/sticker-card';
import { useTranslation } from 'next-i18next';
import { ShopIcon } from '@/components/icons/sidebar';
import { DollarIcon } from '@/components/icons/shops/dollar';
import DashboardSetUp from '../widgets/DashboardSetUp';
import { useState } from 'react';
import React from 'react';
import { DashboardGetFun, GetFunction } from '@/services/Service';
import Loader from '@/components/ui/loader/loader';
import cn from 'classnames';
import Label from '../ui/label';
import Select from 'react-select';
import { selectStyles } from '../../components/ui/select/select.styles';
import Button from '@/components/ui/button';
import NewButton from '../ui/NewButton';
import Router from 'next/router';
import { Routes } from '@/config/routes';

export default function Dashboard() {
  const { t } = useTranslation('common');
  const [data, SetData] = useState<any>();
  const [loadingData, setloadingData] = useState(false);
  const [loadingData2, setloadingData2] = useState(false);
  const [BtnActiveState, setBtnActiveState] = useState(true);
  const [RenderData, setRenderData] = useState<any>();
  const [GraphData, setGraphData] = useState<any>([]);
  const [BusinessDetails, setBusinesDetails] = useState<any>([]);
  const [locationDataArray, setLocationDataArray] = React.useState<any>([]);
  const [locationID, setLocationID] = useState<any>();

  React.useEffect(() => {
    callinggAPI();
  }, []);

  const callinggAPI = () => {
    setloadingData(true);
    GetFunction('/business-location').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });
      setLocationDataArray(ordersData);
      let businessDetails: any = localStorage.getItem('business_details');
      setBusinesDetails(JSON.parse(businessDetails));
      DashboardGetFun(
        '/dashboard-mobile?location_id=' + ordersData[0]?.id
      ).then((result) => {
        setloadingData(true);
        if (result.success) {
          setloadingData(true);
          SetData(result?.date);
          setRenderData(result?.date?.today);

          let salesByYear: any = [];
          let val1: any = result?.date?.sale_report;
          let newlwt: any = Object.assign({}, val1);
          salesByYear.push(
            newlwt[0]?.Mon?.toFixed(2),
            newlwt[1]?.Tue?.toFixed(2),
            newlwt[2]?.Wed?.toFixed(2),
            newlwt[3]?.Thu?.toFixed(2),
            newlwt[4]?.Fri?.toFixed(2),
            newlwt[5]?.Sat?.toFixed(2),
            newlwt[6]?.Sun?.toFixed(2)
          );
          console.log(val1);

          setGraphData(salesByYear);
        }
        setloadingData(false);
      });
    });
  };

  const concernedElement: any = document.querySelector('.click-text');

  document.addEventListener('mousedown', (event) => {
    if (concernedElement?.contains(event.target)) {
    } else {
      setBtnActiveState(true);
      setRenderData(data && data?.today);
    }
  });

  const onChangeFilter = (e) => {
    setBtnActiveState(false);
    if (e === 'today') {
      setRenderData(data.today);
    }
    if (e === 'yesterday') {
      setRenderData(data.yesterday);
    }
    if (e === 'this_week') {
      setRenderData(data.this_week);
    }
    if (e === 'this_month') {
      setRenderData(data.this_month);
    }
  };

  const OnChangeLocation = (e) => {
    setLocationID(e.id);
    setloadingData2(true);
    DashboardGetFun('/dashboard-mobile?location_id=' + e.id).then((result) => {
      if (result.success) {
        setloadingData2(true);
        SetData(result?.date);
        setRenderData(result?.date?.today);

        let salesByYear: any = [];
        let val1: any = result?.date?.sale_report;
        let newlwt: any = Object.assign({}, val1);

        salesByYear.push(
          newlwt[0]?.Mon,
          newlwt[1]?.Tue,
          newlwt[2]?.Wed,
          newlwt[3]?.Thu,
          newlwt[4]?.Fri,
          newlwt[5]?.Sat,
          newlwt[6]?.Sun
        );
        setGraphData(salesByYear);
      }
      setloadingData2(false);
    });
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      {
        <div className="mb-6 flex w-full flex-wrap md:flex-nowrap">
          <DashboardSetUp
            data={data}
            titleTransKey={t('common:dashboard-title')}
            setloadingData={setloadingData}
            callinggAPI={() => callinggAPI()}
          />
        </div>
      }

      <div className="mb-6 w-full flex-wrap rounded bg-light p-5 md:flex-nowrap">
        <div className="flex justify-end">
          <div className="w-4/12 pb-3">
            <Label>{t('common:title-select-Location')}</Label>
            <Select
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.key}
              styles={selectStyles}
              options={locationDataArray}
              onChange={OnChangeLocation}
              defaultValue={locationDataArray[0]}
            />
          </div>
        </div>
        {loadingData2 ? (
          <Loader text={t('common:text-loading')} />
        ) : (
          <div>
            <div className="grid-inherit mb-4 grid gap-4 md:grid-cols-12 lg:grid-cols-12">
              <div className="col-span-3 ">
                <NewButton
                  className={`${
                    BtnActiveState
                      ? 'w-full bg-accent'
                      : 'w-full border border-border-400 bg-transparent text-body text-[#6B7280] hover:border-accent hover:bg-accent hover:text-light'
                  }`}
                  onClick={() => onChangeFilter('today')}
                >
                  {t('text-today')}
                </NewButton>
              </div>
              <div className="col-span-3 w-full">
                <NewButton
                  variant="outline"
                  onClick={() => onChangeFilter('yesterday')}
                  className="w-full"
                >
                  {t('text-yesterday')}
                </NewButton>
              </div>
              <div className="col-span-3">
                <NewButton
                  variant="outline"
                  onClick={() => onChangeFilter('this_week')}
                  className="w-full"
                >
                  {t('text-this-week')}
                </NewButton>
              </div>
              <div className="col-span-3">
                <NewButton
                  variant="outline"
                  onClick={() => onChangeFilter('this_month')}
                  className="w-full"
                >
                  {t('text-this-month')}
                </NewButton>
              </div>
            </div>
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="w-full ">
                <StickerCard
                  titleTransKey={t('text-gross-sales')}
                  // subtitleTransKey="sticker-card-subtitle-rev"
                  icon={<DollarIcon className="h-7 w-7" color="#047857" />}
                  iconBgStyle={{ backgroundColor: '#A7F3D0' }}
                  price={
                    BusinessDetails?.symbol +
                    ' ' +
                    RenderData?.grossSales.toLocaleString()
                  }
                />
              </div>
              <div className="w-full ">
                <StickerCard
                  titleTransKey={t('text-net-sales')}
                  // subtitleTransKey="sticker-card-subtitle-order"
                  icon={<CartIconBig />}
                  price={
                    BusinessDetails?.symbol +
                    ' ' +
                    RenderData?.netSales.toLocaleString()
                  }
                />
              </div>
              <div className="w-full ">
                <StickerCard
                  titleTransKey={t('text-sold-item')}
                  icon={<CoinIcon color="#1D4ED8" />}
                  price={RenderData?.soldItems}
                />
              </div>
              <div className="w-full ">
                <StickerCard
                  titleTransKey={t('text-order')}
                  icon={<ShopIcon className="w-6" color="#1D4ED8" />}
                  iconBgStyle={{ backgroundColor: '#93C5FD' }}
                  price={RenderData?.ordersReceived}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {loadingData2 ? (
        <Loader text={t('common:text-loading')} />
      ) : (
        <div className="mb-6 flex w-full flex-wrap md:flex-nowrap">
          {GraphData && (
            <ColumnChart
              widgetTitle={t('common:sale-history')}
              colors={['#212121']}
              series={GraphData}
              categories={[
                t('common:monday'),
                t('common:tuesday'),
                t('common:wednesday'),
                t('common:thursday'),
                t('common:friday'),
                t('common:saturday'),
                t('common:sunday'),
              ]}
            />
          )}
        </div>
      )}
    </>
  );
}
