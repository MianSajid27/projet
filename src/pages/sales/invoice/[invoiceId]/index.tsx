import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import ProgressBox from '@/components/ui/progress-box/progress-box';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import ErrorMessage from '@/components/ui/error-message';
import { siteSettings } from '@/settings/site.settings';
import usePrice from '@/utils/use-price';
import { formatAddress } from '@/utils/format-address';
import Loader from '@/components/ui/loader/loader';
import ValidationError from '@/components/ui/form-validation-error';
import { Attachment } from '@/types';
import { useDownloadInvoiceMutation, useOrderQuery } from '@/data/order';
import { useUpdateOrderMutation } from '@/data/order';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SelectInput from '@/components/ui/select-input';
import { useIsRTL } from '@/utils/locals';
import { DownloadIcon } from '@/components/icons/download-icon';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { clearCheckoutAtom } from '@/contexts/checkout';
import { useOrderStatusesQuery } from '@/data/order-status';
import { AddShipping, GetFunction } from '@/services/Service';
import React from 'react';
import Label from '@/components/ui/label';
import TextArea from '@/components/ui/text-area';
import { xor } from 'lodash';
import { toast } from 'react-toastify';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { FaShippingFast } from 'react-icons/fa';
import Input from '@/components/ui/input';
import Drawer from '@/components/ui/drawer';

export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { query, locale } = useRouter();
  const { alignLeft, alignRight, isRTL } = useIsRTL();
  const [DataArr, setDataArr] = useState([]);
  const [renderData, setRenderData] = useState<any>('');
  const [renderPaymentData, setRenderPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaderApproveIn, setLoaderApproveIn] = useState(false);
  const [currency, setCurrency] = React.useState<any>();
  const [DisVal, setDisVal] = React.useState<any>();
  const [logo, setLogo] = useState<any>('');
  const [BusinessDetail, setBusinessDetail] = useState<any>('');
  const [BusinessData, setBusinessData] = useState<any>('');
  const [businesslocationName, setLocationName] = useState('');
  const [isYetToPush, setIsYetToPush] = useState(false);
  const [shipLooader, setShipLooader] = useState(false);
  const [shipModal, setShipModal] = useState(false);
  const [deliveryStatusDiv, setDeliveryStatusDiv] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState('');
  const [doneBtnLoading, setDoneBtnLoading] = useState(false);
  const [shipLooaderReject, setShipLooaderReject] = useState(false);
  const [permissionData, setPermissionData] = useState([]);

  useEffect(() => {
    let businessDetail: any = localStorage.getItem('user_business_details');
    let logo = JSON.parse(businessDetail);
    console.log(logo);

    setLogo(logo?.logo);
    setBusinessDetail(logo);

    GetFunction(('/sell/' + query.invoiceId) as string).then((result) => {
      console.log(result, 'sell result');
      if (result.data[0].einvoicing_status === 'yet_to_be_pushed') {
        setIsYetToPush(true);
      }

      setDataArr(result.data[0]?.sell_lines);
      let value: any = 0;
      result.data[0]?.sell_lines.map((res) => {
        let unitValue = res.line_discount_amount;
        value = value + Number(unitValue);
        setDisVal(value);
      });
      setRenderData(result.data[0]);
      GetFunction('/business-location').then((locationResult) => {
        let locationName = locationResult.data.find(
          (x) => x.id == result.data[0].location_id
        );

        setLocationName(locationName?.name);
        setLoading(false);
      });
      setRenderPaymentData(result.data[0]?.payment_lines);
    });
    GetFunction('/business-details').then((result) => {
      setBusinessData(result.data);
    });
    GetFunction('/user/loggedin').then((result) => {
      setPermissionData(result?.data?.all_permissions);
      localStorage.setItem('user_detail', JSON.stringify(result.data));
    });
  }, []);

  // const userDetail: any = localStorage.getItem('user_detail');
  // const userData: any = JSON.parse(userDetail);
  // const permissionList = userData?.all_permissions;

  React.useEffect(() => {
    let businessDetails: any = localStorage.getItem('business_details');
    setCurrency(JSON.parse(businessDetails));
  }, []);

  const handleReportInvoice = () => {
    const data = {
      transaction_id: query.invoiceId,
      business_id: BusinessData.id,
    };

    AddShipping('/report-invoice-to-zatca', data).then((result) => {
      if (result.success) {
        toast.success(result.message);
        router.reload();
      } else {
        toast.error(result.message);
      }
    });
  };

  const onInvoiceApprove = () => {
    setLoaderApproveIn(true);
    GetFunction('/invoice-approve/' + renderData?.id).then((result) => {
      if (result?.success == true) {
        setLoaderApproveIn(false);
        toast.success(result.msg);
        router.reload();
      } else {
        setLoaderApproveIn(false);
        toast.error(result.msg);
      }
    });
  };

  const onShipClose = () => {
    setShipModal(false);
    setDeliveryStatusDiv(false);
  };
  const onSelfShipiing = () => {
    setDeliveryStatusDiv(true);
  };
  const onTrackingInfoChange = (e) => {
    setTrackingInfo(e.target.value);
  };

  const onDoneClick = () => {
    setDoneBtnLoading(true);
    apiCallingFunction();
    setShipModal(false);
  };

  function onIgniteShipReject() {
    apiCallingFunctionReject();
  }

  const apiCallingFunction = () => {
    setShipLooader(true);
    let status = '';

    if (
      renderData?.shipping_status == 'pending' &&
      renderData.order_type == 'Pickup'
    ) {
      status = 'Accepted';
    } else if (
      renderData?.shipping_status == 'Accepted' &&
      renderData?.order_type == 'Pickup'
    ) {
      status = 'Ready';
    } else if (
      renderData?.shipping_status == 'Ready' &&
      renderData?.order_type == 'Pickup'
    ) {
      status = 'Completed';
    } else if (
      renderData?.shipping_status == 'pending' &&
      renderData?.order_type == 'Delivery'
    ) {
      status = 'Accepted';
    } else if (
      renderData?.shipping_status == 'Accepted' &&
      renderData?.order_type == 'Delivery'
    ) {
      status = 'Shipped';
    } else if (
      renderData?.shipping_status == 'Shipped' &&
      renderData?.order_type == 'Delivery'
    ) {
      status = 'Completed';
    }

    let obj: any = {
      id: renderData?.id,
      shipping_status: status,
    };

    if (trackingInfo) {
      obj['shipping_tracking_id'] = trackingInfo;
      obj['shipping_type'] = renderData.order_type;
    }

    AddShipping('/update-shipping-status', obj).then((result) => {
      if (result.success == 1) {
        toast.success(result.msg);
        router.reload();
        setShipLooader(false);
        setDoneBtnLoading(false);
      } else {
        toast.error(result.msg);
        setShipLooader(false);
        setDoneBtnLoading(false);
      }
    });
  };

  // const subtotal = Number(renderData.total_before_tax) || 0;
  // const tax = Number(renderData.tax_amount) || 0;
  // const shippingCharges = Number(renderData.shipping_charges) || 0;
  // const discount = Number(renderData.discount_amount) || 0;
  // const total = subtotal + tax + shippingCharges - discount;

  const apiCallingFunctionReject = () => {
    setShipLooaderReject(true);
    let status = '';

    if (
      renderData?.shipping_status == 'pending' &&
      renderData?.order_type == 'Pickup'
    ) {
      status = 'Rejected';
    } else if (
      renderData?.shipping_status == 'Accepted' &&
      renderData?.order_type == 'Pickup'
    ) {
      status = 'Cancelled';
    } else if (
      renderData?.shipping_status == 'Ready' &&
      renderData?.order_type == 'Pickup'
    ) {
      status = 'Failed';
    } else if (
      renderData?.shipping_status == 'pending' &&
      renderData?.order_type == 'Delivery'
    ) {
      status = 'Rejected';
    } else if (
      renderData?.shipping_status == 'Accepted' &&
      renderData?.order_type == 'Delivery'
    ) {
      status = 'Cancelled';
    } else if (
      renderData?.shipping_status == 'Shipped' &&
      renderData?.order_type == 'Delivery'
    ) {
      status = 'Failed';
    }

    let obj: any = {
      id: renderData?.id,
      shipping_status: status,
    };

    if (trackingInfo) {
      obj['shipping_tracking_id'] = trackingInfo;
      obj['shipping_type'] = renderData?.order_type;
    }

    AddShipping('/update-shipping-status', obj).then((result) => {
      if (result.success == 1) {
        toast.success(result.msg);
        router.reload();
        setShipLooader(false);
        setDoneBtnLoading(false);
      } else {
        toast.error(result.msg);
        setShipLooader(false);
        setDoneBtnLoading(false);
      }
    });
  };

  function onIgniteShip() {
    if (
      renderData.shipping_status == 'Accepted' &&
      renderData.order_type == 'Delivery'
    ) {
      setShipModal(true);
    } else {
      apiCallingFunction();
    }
  }

  console.log(renderData);

  const columns = [
    {
      title: t('table:table-item-title'),
      dataIndex: 'product',
      key: 'name',
      align: alignLeft,
      render: (product: any, row: any) => (
        <span>
          {row?.product?.sku == 'IS-OP-SKU' ? row?.sell_line_note : row?.product_name}
        </span>
      ),
    },
    {
      title: t('table:table-item-quantity'),
      dataIndex: 'quantity',
      key: 'name',
      align: alignLeft,
      render: (quantity: any) => <span>{quantity}</span>,
    },
    {
      title: t('table:table-item-unit-price'),
      dataIndex: 'unit_price',
      key: 'name',
      align: alignLeft,
      render: (unit_price: any) => <span>{unit_price + currency?.symbol}</span>,
    },
    {
      title: t('table:table-item-discount'),
      dataIndex: 'line_discount_amount',
      key: 'name',
      align: alignLeft,
      render: (line_discount_amount: any) => (
        <span>{line_discount_amount + currency?.symbol}</span>
      ),
    },
    {
      title: t('table:table-item-tax'),
      dataIndex: 'item_tax',
      key: 'name',
      align: alignLeft,
      render: (item_tax: any) => <span>{item_tax + currency?.symbol}</span>,
    },
    {
      title: t('table:table-item-price-inc'),
      dataIndex: 'unit_price_inc_tax',
      key: 'name',
      align: alignLeft,
      render: (unit_price_before_discount: any) => (
        <span>{unit_price_before_discount + currency?.symbol}</span>
      ),
    },
    {
      title: t('table:table-item-subtotal'),
      dataIndex: 'unit_price_inc_tax',
      key: 'price',
      align: alignRight,
      render: (unit_price_inc_tax: any) => (
        <span>{unit_price_inc_tax + currency?.symbol}</span>
      ),
    },
  ];
  const paymentColumns = [
    {
      title: t('table:table-item-date'),
      dataIndex: 'paid_on',
      key: 'name',
      align: alignLeft,
      render: (paid_on: any) => <span>{paid_on}</span>,
    },
    {
      title: t('table:table-item-reference-no'),
      dataIndex: 'payment_ref_no',
      key: 'name',
      align: alignLeft,
      render: (payment_ref_no: any) => <span>{payment_ref_no}</span>,
    },
    {
      title: t('form:input-label-amount'),
      dataIndex: 'amount',
      key: 'name',
      align: alignLeft,
      render: (amount: any, row) => (
        <span>
          {amount + currency?.symbol}
          {row.is_return == 1 ? ' (Return)' : ''}
        </span>
      ),
    },
    {
      title: t('table:table-item-payment-method'),
      dataIndex: 'method',
      key: 'name',
      align: alignLeft,
      render: (method: any, row: any) => (
        <span>
          {method} {row.card_type && <>({row.card_type})</>}{' '}
        </span>
      ),
    },
  ];
  const subtotal = Number(renderData.total_before_tax) || 0;
  const tax = Number(renderData.tax_amount) || 0;
  const shippingCharges = Number(renderData.shipping_charges) || 0;
  const discount = Number(renderData.discount_amount) || 0;
  const total = subtotal + tax + shippingCharges - discount;

  if (loading) return <Loader text={t('common:text-loading')} />;

  return (
    <Card>
      <div className="flex w-full justify-between">
        <span>{t('common:invoice-number')}</span>
        <div>
          <span>
            {isYetToPush &&
              renderData?.status === 'final' &&
              BusinessDetail &&
              BusinessDetail.enabled_modules.includes('enable_einvoice') && (
                <Button
                  className="rounded bg-accent p-2 text-white"
                  onClick={handleReportInvoice}
                >
                  {t('common:report-to-zatca')}
                </Button>
              )}
          </span>
          <span className="ml-3">
            {permissionData?.map((item:any,index) => {
              if (
                item.toLocaleLowerCase().includes('create_approve_invoice') &&
                renderData?.status !== 'final'
              ) {
                return (
                  <Button
                  key={index}
                    loading={loaderApproveIn}
                    className="rounded bg-accent p-2 text-white"
                    onClick={onInvoiceApprove}
                  >
                    {t('Approve Invoice')}
                  </Button>
                );
              }
              return null;
            })}
          </span>
        </div>
      </div>
      <div className="mt-5 flex justify-end ">
        <div className=" w-full">
          {renderData?.contact?.first_name && (
            <div className="flex w-full">
              <Label className="w-5/12">{t('form:text-customer')}</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.contact?.first_name +
                  ' ' +
                  renderData?.contact?.last_name}
              </Label>
            </div>
          )}
          {renderData?.contact?.mobile && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">{t('form:customer-phone')}</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.contact?.mobile}
              </Label>
            </div>
          )}
          <div className="mt-3 flex w-full">
            <Label className="w-5/12">{t('common:invoice-number')}</Label>
            <Label className="ml-3 w-full border-l-2 pl-2">
              {renderData?.invoice_no}
            </Label>
          </div>
          {renderData?.created_at && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">{t('form:form-title-date')}</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.created_at}
              </Label>
            </div>
          )}
          {renderData?.status && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">{t('form:input-label-status')}</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.status}
              </Label>
            </div>
          )}
          {renderData?.payment_status && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">{t('table:table-item-payment-status')}</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.payment_status}
              </Label>
            </div>
          )}
          {renderData?.flextock_status && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">Flextock Status</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.flextock_status}
              </Label>
            </div>
          )}
          {renderData?.shipping_status && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">{t('table:table-item-shipping-status')}</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.shipping_status}
              </Label>
            </div>
          )}
          {renderData?.payment_method && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">Payment Method</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.payment_method}
              </Label>
            </div>
          )}
          {renderData?.shipping_address && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">Shipping Address</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.shipping_address}
              </Label>
            </div>
          )}
          {renderData?.custom_field_4 && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">Tracing info</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.custom_field_4}
              </Label>
            </div>
          )}
         
        </div>
        <div className="flex w-full justify-end">
          <div>
            {logo && (
              <Image
                className="flex justify-end"
                width={200}
                height={100}
                loader={() => logo}
                src={logo}
                alt={'img'}
              />
            )}

            <div className="mt-3 flex justify-end">
              {BusinessDetail && BusinessDetail.name}
            </div>
            <Label className="mt-5 flex justify-end text-xs">
              {console.log(BusinessData.tax_number_1)}
              {BusinessData.tax_number_1 == 'null'
                ? ''
                : 'Tin: ' + BusinessData?.tax_number_1}
            </Label>
            {businesslocationName && (
            <div className="mt-3 justify-end flex text-xs ">
              <Label className=" text-xs">Location:</Label>
              <Label className=" text-xs ml-1">
                {businesslocationName}
              </Label>
            </div>
          )}
          </div>
        </div>
      </div>
      <div className=" mt-5">
        <div className="mb-5">{t('common:text-products')}</div>
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={DataArr}
          rowKey="id"
          scroll={{ x: 300 }}
        />
      </div>
      <div className=" mt-5">
        <div className="mb-5">{t('common:payments')}</div>
        <Table
          //@ts-ignore
          columns={paymentColumns}
          emptyText={t('table:empty-table-data')}
          data={renderPaymentData}
          rowKey="id"
          scroll={{ x: 300 }}
        />
      </div>
      <div className="xl-flow-row mt-5 flex flex-col md:flex-row lg:flex-row">
        <div className="w-9/12">
          <div className="mb-5">{t('common:invoice-notes')}</div>
          <TextArea
            value={renderData?.additional_notes}
            name=""
            variant="outline"
            disabled
            className="mb-5"
          />
        </div>
        <div className="ml-5 mt-3 w-3/12">
          <div className="flex flex-col border-t-4  border-b-4  border-double border-border-200 py-4 ms-auto lg:col-span-1">
            <div className="flex items-center justify-between text-sm text-body">
              <span>{t('table:table-item-subtotal')}</span>
              <span>{renderData?.total_before_tax + currency?.symbol}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-body">
              <span>{t('table:table-item-tax')}</span>
              <span>{renderData?.tax_amount + currency?.symbol}</span>
            </div>
            {renderData?.shipping_charges && (
              <div className="flex items-center justify-between text-sm text-body">
                <span>{t('common:shipping-charges')}</span>
                <span>{renderData?.shipping_charges + currency?.symbol}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-body">
              <span>{t('common:order-discount')}</span>
              <span>
                {Number(renderData?.discount_amount) +
                  DisVal +
                  currency?.symbol}
              </span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold text-heading">
              <span>{t('common:order-total')}</span>
              <span>{total.toFixed(2) + currency?.symbol}</span>
            </div>
          </div>
        </div>
      </div>

      {renderData.shipping_status == 'Completed' ||
      renderData.shipping_status == 'Rejected' ||
      renderData.shipping_status == 'Cancelled' ||
      renderData.shipping_status == 'Failed' ? (
        ''
      ) : (
        <div className="flex justify-end">
          <Button
            loading={shipLooaderReject}
            onClick={onIgniteShipReject}
            className="border border-black bg-white text-black hover:bg-accent-hover hover:text-light"
          >
            <span>
              {renderData?.shipping_status == 'pending' &&
                renderData?.order_type == 'Pickup' &&
                'Rejecte Order'}
              {renderData?.shipping_status == 'Accepted' &&
                renderData?.order_type == 'Pickup' &&
                'Cancel'}
              {renderData?.shipping_status == 'Ready' &&
                renderData?.order_type == 'Pickup' &&
                'Failed'}
              {renderData?.shipping_status == 'pending' &&
                renderData?.order_type == 'Delivery' &&
                'Rejecte Order'}
              {renderData?.shipping_status == 'Accepted' &&
                renderData?.order_type == 'Delivery' &&
                'Cancel'}
              {renderData?.shipping_status == 'Shipped' &&
                renderData?.order_type == 'Delivery' &&
                'Failed'}
            </span>
          </Button>

          <Button loading={shipLooader} className="ml-3" onClick={onIgniteShip}>
            <span>
              {renderData?.shipping_status == 'pending' &&
                renderData?.order_type == 'Pickup' &&
                'Accept Order'}
              {renderData?.shipping_status == 'Accepted' &&
                renderData?.order_type == 'Pickup' &&
                'Ready'}
              {renderData?.shipping_status == 'Ready' &&
                renderData?.order_type == 'Pickup' &&
                'Picked Up'}
              {renderData?.shipping_status == 'pending' &&
                renderData?.order_type == 'Delivery' &&
                'Accept Order'}
              {renderData?.shipping_status == 'Accepted' &&
                renderData?.order_type == 'Delivery' &&
                'Shipped'}
              {renderData?.shipping_status == 'Shipped' &&
                renderData?.order_type == 'Delivery' &&
                'Delivered'}
            </span>
          </Button>
        </div>
      )}

      <Drawer open={shipModal} onClose={() => setShipModal(true)}>
        <div className="mt-4 p-5">
          {deliveryStatusDiv == false ? (
            <div className="">
              <div className="pb-3">Shipping Method</div>
              <div
                onClick={onSelfShipiing}
                className="flex cursor-pointer rounded bg-gray-300 p-3"
              >
                <MdOutlineLocalShipping className="mt-1 mr-3 h-5 w-5" />
                <span>Self Shipping</span>
              </div>
              <div className="mt-3 flex rounded bg-gray-300 p-3">
                <FaShippingFast className="mt-1 mr-3 h-5 w-5" />
                <span>Ignite Shipping</span>
              </div>
            </div>
          ) : (
            <div>
              <Input
                name=""
                label="Tracking Info"
                onChange={onTrackingInfoChange}
              />
            </div>
          )}
          <div className="mt-8 flex justify-end">
            <button onClick={onShipClose} className="rounded-md border p-2">
              {t('form:form-button-close')}
            </button>
            {deliveryStatusDiv && (
              <Button
                loading={doneBtnLoading}
                onClick={onDoneClick}
                className="ml-2 rounded-md border p-2"
              >
                Done
              </Button>
            )}
          </div>
        </div>
      </Drawer>
    </Card>
  );
}
OrderDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
