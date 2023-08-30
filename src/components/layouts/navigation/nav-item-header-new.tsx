import Link from '@/components/ui/link';
import { getIcon } from '@/utils/get-icon';
import * as sidebarIcons from '@/components/icons/sidebar';
import { useUI } from '@/contexts/ui.context';
import { useEffect, useRef, useState } from 'react';
import Router, { withRouter } from 'next/router';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { toast } from 'react-toastify';
import LinkDiv from '@/components/ui/link-div';

const resolveLinkPath = (childTo: any, parentTo: any) =>
  `${parentTo}/${childTo}`;

const NavItemHeaders = (props) => {
  const router = useRouter();
  const newArr: any = [];
  const { item } = props;
  const { label, icon, href, children } = item;
  const { t } = useTranslation('common');
  const [packageDetail, setPackageDetail] = useState<any>({});

  const [expanded, setExpand] = useState(
    window.location.pathname.includes(href)
  );

  React.useEffect(() => {
    const businessDetail = JSON.parse(
      localStorage.getItem('user_business_details')!
    );
    if (businessDetail) {
      setPackageDetail(businessDetail?.subscriptions[0]?.package_details);
    }
  }, []);

  const [accessList, setAccessList] = useState<any>([]);
  const userDetail: any = localStorage.getItem('user_detail');
  const userData: any = JSON.parse(userDetail);
  const permissionList = userData?.all_permissions;
  const { locale } = useRouter();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    permissionList?.filter((item) => {
      if (item.toLocaleLowerCase().includes('user.view')) {
        children.map((item) => {
          if (item.label == 'users') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('supplier.view')) {
        children.map((item) => {
          if (item.label == 'supplier') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('roles.view')) {
        children.map((item) => {
          if (item.label == 'roles') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('product.view')) {
        children.map((item: any) => {
          if (item.label == 'products') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('category.view')) {
        children.map((item: any) => {
          if (item.label == 'categories') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('brand.view')) {
        children.map((item: any) => {
          if (item.label == 'brands') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('unit.view')) {
        children.map((item: any) => {
          if (item.label == 'units') {
            setAccessList((current) => [...current, item]);
          }
        });
      }

      if (item.toLocaleLowerCase().includes('product.view')) {
        children.map((item: any) => {
          if (item.label == 'variation') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('sell.view')) {
        children.map((item) => {
          if (item.label == 'invoices') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('list_drafts')) {
        children.map((item: any) => {
          if (item.label == 'drafts') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('list_quotations')) {
        children.map((item: any) => {
          if (item.label == 'quotations') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('access_sell_return')) {
        children.map((item: any) => {
          if (item.label == 'credit-notes') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('purchase_n_sell_report.view')) {
        children.map((item: any) => {
          if (item.label == 'sales-report') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('profit_loss_report.view')) {
        children.map((item: any) => {
          if (item.label == 'profit-loss-report') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('all_product_stock')) {
        children.map((item: any) => {
          if (item.label === 'stock-report') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('purchase_n_sell_report.view')) {
        children.map((item: any) => {
          if (item.label == 'sales-report-by-payment') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('sales_summary_report')) {
        children.map((item: any) => {
          if (item.label == 'sales-summary') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('sales_item_report')) {
        children.map((item: any) => {
          if (item.label == 'product-sales') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('sales_category_report')) {
        children.map((item: any) => {
          if (item.label == 'category-sales') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('sales_employee_report')) {
        children.map((item: any) => {
          if (item.label == 'employee-sales') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('tax_report.view')) {
        children.map((item: any) => {
          if (item.label == 'tax-summary') {
            setAccessList((current) => [...current, item]);
          }
        });
      }

      if (item.toLocaleLowerCase().includes('business_settings_storefront')) {
        children.map((item: any) => {
          if (item.label == 'online-store') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
    });
    permissionList?.filter((item) => {
      if (item.toLocaleLowerCase().includes('business_settings.access')) {
        children.map((item: any) => {
          if (item.label == 'business') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('sell.create')) {
        children.map((item: any) => {
          if (item.label == 'devices') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('business_settings.access')) {
        children.map((item: any) => {
          if (item.label == 'location') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('view_product_stock_value')) {
        children.map((item: any) => {
          if (item.label == 'stock-sale-report') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('sales_representative.view')) {
        children.map((item: any) => {
          if (item.label == 'shift-report') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('coupons.view')) {
        children.map((item: any) => {
          if (item.label == 'coupons') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('abondend_cart.view')) {
        children.map((item: any) => {
          if (item.label == 'abandoned-cart') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('business_settings_pos')) {
        children.map((item: any) => {
          if (item.label === 'POS_Setting') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('business_settings_storefront')) {
        children.map((item: any) => {
          if (item.label === 'text-storefront') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('product.import')) {
        children.map((item: any) => {
          if (item.label === 'import-products') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('sales_agent.view')) {
        children.map((item: any) => {
          if (item.label === 'Sales-agent') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
    });
    children.map((item: any) => {
      if (item.label === 'sales-channel') {
        setAccessList((current) => [...current, item]);
      }
      if (item.label === 'manage-stock') {
        setAccessList((current) => [...current, item]);
      }

      if (item.label === 'mobile-app') {
        setAccessList((current) => [...current, item]);
      }
      if (item.label === 'import-invoice') {
        setAccessList((current) => [...current, item]);
      }
      if (item.label === 'mms') {
        setAccessList((current) => [...current, item]);
      }
      
    });
    permissionList?.filter((item) => {
      if (item.toLocaleLowerCase().includes('invoice_settings.access')) {
        children.map((item: any) => {
          if (item.label === 'Invoice-Layout') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('tax_rate.view')) {
        children.map((item: any) => {
          if (item.label == 'tax') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('purchase.view')) {
        children.map((item: any) => {
          if (item.label == 'purchase') {
            setAccessList((current) => [...current, item]);
          }
        });
        children.map((item: any) => {
          if (item.label == 'stock-transfer') {
            setAccessList((current) => [...current, item]);
          }
        });
        children.map((item: any) => {
          if (item.label == 'stock-adjustment') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('access_store_plugins')) {
        children.map((item: any) => {
          if (item.label === 'store-plugin') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('access_shipping')) {
        children.map((item: any) => {
          if (item.label === 'ignite-shipping') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('purchase.payments')) {
        children.map((item: any) => {
          if (item.label === 'payment') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('sell.create')) {
        children.map((item: any) => {
          if (item.label === 'text-billing') {
            setAccessList((current) => [...current, item]);
          }
          if (item.label === 'text-pay-link') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
      if (item.toLocaleLowerCase().includes('marketplace.view')) {
        children.map((item: any) => {
          if (item.label === 'marketPlace') {
            setAccessList((current) => [...current, item]);
          }
        });
      }
    });
  }, []);

  const onExpandChange = (e: any) => {
    e.preventDefault();
    setExpand((expanded) => !expanded);
  };

  const onParentClick = (i) => {
    console.log('href', i.href);
  };
  const onChildClick = (i) => {
    if (packageDetail.name == 'Free package' && i.href == 'abandonedCart') {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else if (packageDetail.name == 'Free package' && i.href == 'coupons') {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else if (packageDetail.name == 'Free package' && i.href == '/mobileApp') {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else if (packageDetail.name == 'Free package' && i.href == 'salesAgent') {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else if (
      packageDetail.name == 'Free package' &&
      i.href == 'stockTransfer'
    ) {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else if (i.href == 'stockAdjustment') {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else if (i.href == 'supplier') {
    } else if (packageDetail.name == 'Free package' && i.href == 'supplier') {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else if (
      i.href == 'importProducts' &&
      packageDetail.name == 'Free package'
    ) {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else {
      Router.push(resolveLinkPath(i.href, props.item.href));
    }
  };

  return (
    <div>
      <button
        onClick={onExpandChange}
        className="flex w-full items-center text-base text-body-dark text-start focus:text-accent"
        dir={dir}
      >
        {expanded && (
          <img
            alt="img"
            style={{
              position: 'absolute',
              width: 13,
              [dir === 'rtl' ? 'left' : 'right']: 20,
            }}
            src="/image/dropBottom.png"
          />
        )}
        {!expanded && (
          <img
            alt="img"
            style={{
              position: 'absolute',
              width: 15,
              [dir === 'rtl' ? 'left' : 'right']: 20,
              transform: `scaleX(${dir === 'rtl' ? -1 : 1})`,
            }}
            src="/image/dropRight.png"
          />
        )}
        {getIcon({
          iconList: sidebarIcons,
          iconName: icon,
          className: 'w-5 h-5 me-4',
        })}
        <span
          style={{ [dir === 'rtl' ? 'marginRight' : 'marginLeft']: '0rem' }}
        >
          {t(`common:${label}`)}
        </span>
      </button>

      {/* <button
          onClick={onExpandChange}
          className="flex w-full items-center text-base text-body-dark text-start focus:text-accent"
          dir={dir}
        >
          {getIcon({
            iconList: sidebarIcons,
            iconName: icon,
            className: 'w-5 h-5 me-4',
          })}
          <span>{t(`common:${label}`)}</span>

          {expanded && (
            <img
              alt="img"
              style={{ position: 'absolute', width: 13, right: 20 }}
              src="/image/dropBottom.png"
            />
          )}
          {!expanded && (
            <img
              alt="img"
              style={{ position: 'absolute', width: 15, right: 20 }}
              src="/image/dropRight.png"
            />
          )}
        </button> */}

      {expanded && (
        <div style={{ marginTop: 0, marginBottom: 0 }}>
          {accessList.map((item: any, index: any) => {
            const key = `${item.label}-${index}`;
            const { label, Icon, children } = item;

            if (children) {
              return (
                <div key={index}>
                  <NavItemHeaders
                    item={{
                      ...item,
                      href: resolveLinkPath(item.href, props.item.href),
                    }}
                  />
                </div>
              );
            }
            return (
              <div key={key}>
                {
                  <span
                    onClick={() => onChildClick(item)}
                    // key={key}
                    // href={resolveLinkPath(item.href, props.item.href)}
                    className="cursor-pointer flex w-full items-center pl-5 pt-5 text-base text-body-dark text-start focus:text-accent"
                  >
                    {getIcon({
                      iconList: sidebarIcons,
                      iconName: item.icon,
                      className: 'w-5 h-5 me-4',
                    })}
                    <span style={{ marginTop: 0 }}>
                      {t(`common:${item.label}`)}
                    </span>
                  </span>
                }
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default withRouter(NavItemHeaders);
