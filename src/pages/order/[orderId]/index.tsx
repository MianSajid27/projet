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
import defaultImg from '../../../../public/image/default.png';
import { GetFunction } from '@/services/Service';
type FormValues = {
  order_status: any;
};
export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const { alignLeft, alignRight, isRTL } = useIsRTL();
  const { resetCart } = useCart();
  const [, resetCheckout] = useAtom(clearCheckoutAtom);
  const [orderDetail, setOrderDetail] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const order_id: any = query.orderId;

  useEffect(() => {
    setIsLoading(true);
    if (order_id != undefined) {
      GetFunction('/sell/' + order_id).then((result) => {
        setOrderDetail(result.data[0]);
        setIsLoading(false);
      });
    }
  }, [order_id]);
  useEffect(() => {
    resetCart();
    resetCheckout();
  }, [resetCart, resetCheckout]);

  const { mutate: updateOrder, isLoading: updating } = useUpdateOrderMutation();
  const { orderStatuses } = useOrderStatusesQuery({ language: locale });
  const { order, isLoading: loading, error } = useOrderQuery({
    id: query.orderId as string,
    language: locale!,
  });
  const { refetch } = useDownloadInvoiceMutation(
    {
      order_id: query.orderId as string,
      isRTL,
      language: locale!,
    },
    { enabled: false }
  );

  const {
    handleSubmit,
    control,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { order_status: order?.status?.id ?? '' },
  });

  const ChangeStatus = ({ order_status }: FormValues) => {
    updateOrder({
      id: order?.id as string,
      status: order_status?.id as string,
    });
  };
  const { price: subtotal } = usePrice(
    order && {
      amount: order?.amount!,
    }
  );

  const { price: total } = usePrice(
    order && {
      amount: order?.paid_total!,
    }
  );
  const { price: discount } = usePrice(
    order && {
      amount: order?.discount!,
    }
  );
  const { price: delivery_fee } = usePrice(
    order && {
      amount: order?.delivery_fee!,
    }
  );
  const { price: sales_tax } = usePrice(
    order && {
      amount: order?.sales_tax!,
    }
  );

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  async function handleDownloadInvoice() {
    const { data } = await refetch();

    if (data) {
      const a = document.createElement('a');
      a.href = data;
      a.setAttribute('download', 'order-invoice');
      a.click();
    }
  }

  const columns = [
    {
      dataIndex: 'product',
      key: 'image',
      width: 70,
      render: (product: any) => (
        <Image
          src={product?.image ?? defaultImg}
          alt="alt text"
          layout="fixed"
          width={50}
          height={50}
        />
      ),
    },
    {
      title: t('table:table-item-products'),
      dataIndex: 'product',
      key: 'name',
      align: alignLeft,
      render: (product: any, item: any) => (
        <div>
          <span>{product.name}</span>
          {/* <span className="mx-2">x</span>
          <span className="font-semibold text-heading">
            {item.pivot.order_quantity}
          </span> */}
        </div>
      ),
    },
    {
      title: t('table:table-item-quantity'),
      dataIndex: 'quantity',
      key: 'name',
      align: alignLeft,
      render: (quantity: any, item: any) => (
        <div>
          <span>{quantity}</span>
          {/* <span className="mx-2">x</span>
          <span className="font-semibold text-heading">
            {item.pivot.order_quantity}
          </span> */}
        </div>
      ),
    },
    {
      title: t('table:table-item-total'),
      dataIndex: 'unit_price',
      key: 'price',
      align: alignRight,
      render: (price: any) => (
        <div>
          <span>{Number(price).toFixed(2)}</span>
          {/* <span className="mx-2">x</span>
          <span className="font-semibold text-heading">
            {item.pivot.order_quantity}
          </span> */}
        </div>
      ),
      //   render: function Render(_: any, item: any) {
      //     const { price } = usePrice({
      //       amount: parseFloat(item.pivot.subtotal),
      //     });
      //     return <span>{price}</span>;
      //   },
    },
  ];
  if (isLoading) return <Loader text={t('common:text-loading')} />;

  return (
    <Card>
      {/* <div className="flex w-full">
        <Button
          onClick={handleDownloadInvoice}
          className="mb-5 bg-blue-500 ltr:ml-auto rtl:mr-auto"
        >
          <DownloadIcon className="h-4 w-4 me-3" />
          {t('common:text-download')} {t('common:text-invoice')}
        </Button>
      </div> */}

      <div className="flex flex-col items-center lg:flex-row">
        <h3 className="mb-8 w-full whitespace-nowrap text-center text-2xl font-semibold text-heading lg:mb-0 lg:w-1/3 lg:text-start">
          {t('form:input-label-order-id')} - {orderDetail?.invoice_no}
        </h3>

        {/* <form
          onSubmit={handleSubmit(ChangeStatus)}
          className="flex w-full items-start ms-auto lg:w-2/4"
        >
          <div className="z-20 w-full me-5">
            <SelectInput
              name="order_status"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={orderStatuses}
              placeholder={t('form:input-placeholder-order-status')}
            />

            <ValidationError message={t(errors?.order_status?.message)} />
          </div>
          <Button loading={updating}>
            <span className="hidden sm:block">
              {t('form:button-label-change-status')}
            </span>
            <span className="block sm:hidden">
              {t('form:form:button-label-change')}
            </span>
          </Button>
        </form> */}
      </div>

      <div className=" flex items-center justify-center ">
        <ProgressBox data={orderStatuses} status={order?.status?.serial!} />
      </div>

      <div className="mb-10">
        {orderDetail ? (
          <Table
            //@ts-ignore
            columns={columns}
            emptyText={t('table:empty-table-data')}
            data={orderDetail?.sell_lines!}
            rowKey="id"
            scroll={{ x: 300 }}
          />
        ) : (
          <span>{t('common:no-order-found')}</span>
        )}

        <div className="flex w-full flex-col space-y-2 border-t-4 border-double border-border-200 px-4 py-4 ms-auto sm:w-1/2 md:w-1/3">
          <div className="flex items-center justify-between text-sm text-body">
            <span>{t('common:order-sub-total')}</span>
            <span>{Number(orderDetail?.total_before_tax).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-body">
            <span>{t('common:order-tax')}</span>
            <span>{Number(orderDetail?.tax_amount).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-body">
            <span>{t('common:order-delivery-fee')}</span>
            <span>{Number(orderDetail?.shipping_charges).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-body">
            <span>{t('common:order-discount')}</span>

            <span>{Number(orderDetail?.discount_amount).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-base font-semibold text-heading">
            <span>{t('common:order-total')}</span>
            <span>{Number(orderDetail?.final_total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        {/* <div className="mb-10 w-full sm:mb-0 sm:w-1/2 sm:pe-8">
                    <h3 className="mb-3 border-b border-border-200 pb-2 font-semibold text-heading">
                        {t('common:billing-address')}
                    </h3>

                    <div className="flex flex-col items-start space-y-1 text-sm text-body">
                        <span>{order?.customer?.name}</span>
                        {order?.billing_address && (
                            <span>{formatAddress(order.billing_address)}</span>
                        )}
                        {order?.customer_contact && <span>{order?.customer_contact}</span>}
                    </div>
                </div> */}
        {/* sm:w-1/2 sm:ps-8  */}
        <div className="w-full ">
          <h3 className="mb-3 border-b border-border-200 pb-2 font-semibold text-heading text-start sm:text-end">
            {t('common:shipping-address')}
          </h3>

          <div className="flex flex-col items-start space-y-1 text-sm text-body text-start sm:items-end sm:text-end">
            <span>{orderDetail?.shipping_address}</span>
            {/* {order?.shipping_address && (
                            <span>{formatAddress(order.shipping_address)}</span>
                        )}
                        {order?.customer_contact && <span>{order?.customer_contact}</span>} */}
          </div>
        </div>
      </div>
    </Card>
  );
}
OrderDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
