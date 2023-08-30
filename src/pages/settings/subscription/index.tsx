import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/Newearch';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { Routes } from '@/config/routes';
import { adminOnly } from '@/utils/auth-utils';
import RoleList from '@/components/subscription/subscription-list';
import PackageList from '@/components/subscription/packages-list';
import {
  GetBusinessDetail,
  GetFunction,
  UpdatingBusiness,
  UpdatingProduct,
  UpdatingSellFunction,
} from '@/services/Service';
import React from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import CartCounterButton from '@/components/cart/cart-counter-button';
import Script from 'next/script';
import CartItem from '@/components/cart/item';
import DrawerWrapper from '@/components/ui/drawer-wrapper';
import Cart from '@/components/cart/cart';
import ProductCard from '@/components/product/card';
import Drawer from '@/components/ui/drawer';
import SubscriptionCart from '@/components/cart/subscription-cart';
import { useCart } from '@/contexts/quick-cart/cart.context';

export default function TypesPage() {
  const { t } = useTranslation();
  const [loadingData, setloadingData] = useState(false);
  const [ListData, setListData] = useState<any>([]);
  const [packagesList, setPackagesList] = useState<any>([]);
  const [addonList, setAddonList] = useState<any>([]);
  const [addonQuantity, setAddonQuantity] = useState<any>([]);
  const [addonPrice, setAddonPrice] = useState<any>(0);
  const [packages, setPackages] = useState<any>([]);
  const [url, setUrl] = useState<any>('');
  const [isSubscription, setIsSubscription] = useState(false);
  const [displayCartSidebar, setdisplayCartSidebar] = useState(false);
  const userDetail = JSON.parse(localStorage.getItem('user_detail')!);
  const permissionList = userDetail?.all_permissions;
  const router = useRouter();
  const {
    items,
    totalUniqueItems,
    total,
    resetCart,
    resetPaymentCart,
  } = useCart();
  useEffect(() => {
    setloadingData(true);
    GetFunction('/pabbly/get-client-urls').then((result) => {
      // console.log(result,"pabbly result");
      if (result?.data?.client_protal_url) {
        const url = result?.data?.client_protal_url;
        if (url) {
          setUrl(url);
          GetFunction('/pabbly/subscriptions-and-related-addons').then(
            (result) => {
              //  console.log(result,'pablly reuslt')
              // setListData(result.data.customer_subscriptions);
              setPackagesList(result?.data.customer_subscriptions);
              setAddonList(result?.data.related_addons);

              setloadingData(false);
            }
            
          );
          // router.push(url)
          // router.back()
       
        }
        // router.push(url)
      } else if (result?.data?.pabbly_checkout_page) {
        const url = result?.data?.pabbly_checkout_page;
        if (url) {
          setUrl(url);
          setIsSubscription(true);
          // router.push(url)
          // router.back()
          setloadingData(false);
        }
      } else {
        toast.error(result.message);
        // router.back()
        setloadingData(false);
      }
    });

    GetBusinessDetail('/business-details').then((result) => {
      localStorage.setItem(
        'business_details',
        JSON.stringify(result.data.currency)
      );
      localStorage.setItem(
        'user_business_details',
        JSON.stringify(result.data)
      );
      localStorage.setItem('business_name', result.data.name);
    });
  }, []);
  // React.useEffect(() => {
  //     setloadingData(true);
  //     GetFunction('/pabbly/products-and-subscriptions').then((result) => {
  //       // console.log(result.data.customer_subscriptions)
  //       setListData(result.data.customer_subscriptions);
  //       setPackagesList(result.data.customer_subscriptions);

  //     });
  //     GetFunction('/pabbly/products-and-subscriptions').then((result) => {
  //       // console.log(result.data.products[0].plans)
  //       if (result.data) {
  //         setPackages(result.data.products[0].plans);
  //       }
  //     });
  //     setloadingData(false);
  // }, []);

  // if (loadingData) return <Loader text={t('common:text-loading')} />;

  // const filterBySearch = (event) => {

  //   const query = event.target.value;
  //   var updatedList = [ListData];

  //   let searchLower = query.toLowerCase();
  // //  console.log(updatedList[0],'dsljfdslk');

  //   let filtered:any = updatedList[0]?.filter((list: any) => {
  //     if (list?.plan?.plan_name?.toLowerCase().includes(searchLower)) {
  //       return true;
  //     }

  //   });

  //    setPackagesList(filtered);
  // };
  const onDecrement = (e: any, index) => {
    // console.log(e)
    const qty = addonQuantity - 1;
    setAddonQuantity(qty);
    const totalPrice = qty * e?.price;
    setAddonPrice(totalPrice);
  };
  const onIncrement = (e, index) => {
    let qty = 0;
    if (addonQuantity[index] === undefined) {
      qty = 0 + 1;
    } else {
      qty = addonQuantity[index] + 1;
    }

    const newArray = Array.from(addonQuantity);
    newArray[index] = qty;
    setAddonQuantity(newArray);
    const totalPrice = qty * e?.price;
    setAddonPrice(totalPrice);
  };
  const updateSubscription = (e, index) => {
    var form = new FormData();
    form.append('product_id', packagesList[0].product_id);
    form.append('plan_id', packagesList[0].plan_id);
    form.append('price', addonPrice);
    form.append('addon_id', e.id);
    form.append('addon_quantity', addonQuantity[index]);

    UpdatingProduct(
      '/pabbly/subscriptions/63e348ed7b308006228f52e4/update',
      form
    ).then((result) => {
      if (result?.success == true) {
        toast.success(result?.message);
        window.open(result?.data?.invoice_link, '_blank');
        window.location.reload();
      } else {
        toast.error(result?.message);
      }
    });
  };
  const inDrawerClick = () => {
    setdisplayCartSidebar(true);
  };
  useEffect(() => {
    resetPaymentCart();
  }, []);
  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      {isSubscription ? (
        <iframe src={url} width="100%" height="100%"></iframe>
      ) : (
        <div>
          <RoleList list={packagesList} url={url} />
          {/* <div className='grid grid-cols-2 gap-4'>
            {addonList?.map((addon: any, index: any) => (
              <Card className="" key={index}>
                <div className='flex '>{addon?.name}</div>
                <div className='flex '> {packagesList[0]?.currency_symbol}{addon?.price}</div>
                <div className='flex '>{addon?.description}</div>
                
                <div className='p-1 bg-gray-300 w-fit rounded'>
                  <button className="px-1 border-r-2" disabled={addonQuantity <= 0} onClick={() => { onDecrement(addon, index) }}>-</button>
                  <span className="px-1">{addonQuantity[index] ? addonQuantity[index] : 0}</span>
                  <button className="px-1 border-l-2" onClick={() => { onIncrement(addon, index) }}>+</button>
                </div>
                <div className="py-2">
                  <button className="bg-accent p-2 rounded text-white" onClick={() => { updateSubscription(addon, index) }}>{t('table:table-button-update-subscription')}</button>
                </div>
              </Card>
            ))}
          </div> */}
          <div className="flex space-x-5">
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 3xl:grid-cols-6">
              {addonList?.map((addon: any, index: any) => (
                <ProductCard key={index} item={addon} />
              ))}
            </div>
          </div>
          <div onClick={inDrawerClick}>
            <CartCounterButton />
          </div>
          <Drawer
            open={displayCartSidebar}
            onClose={() => setdisplayCartSidebar(false)}
            variant="right"
          >
            <DrawerWrapper hideTopBar={true}>
              <SubscriptionCart data={packagesList} />
            </DrawerWrapper>
          </Drawer>
        </div>
      )}
      {/* <Card className="mb-8 flex flex-col items-center xl:flex-row">
      <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">

          <h1 className="text-xl font-semibold text-heading">
            {t('common:package-subscriptions')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search onChangeearchVal={filterBySearch} />

        </div>
      </Card> */}
      {/* <RoleList list={packagesList}/> */}
      {/* <PackageList list={packages} /> */}
      {/* <PackageList list={packages} /> */}
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
