import Navbar from '@/components/layouts/navigation/top-navbar';
import { Fragment } from 'react';
import MobileNavigation from '@/components/layouts/navigation/mobile-navigation';
import { siteSettings } from '@/settings/site.settings';
import { useTranslation } from 'next-i18next';
import SidebarItem from '@/components/layouts/navigation/sidebar-item';
import { useRouter } from 'next/router';
import iconn from '../../../../public/image/favicon.png';
import Image from 'next/image';
import { useState } from 'react';
import React from 'react';
import { Routes } from '@/config/routes';

const AdminLayout: React.FC = ({ children }) => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [isGreater, setIsGreater] = useState(false);
  const [dateArray, setDateArray] = useState([]);
  const [filterList, setFilterList] = useState<any>([]);
  const userDetail: any = localStorage.getItem('user_detail');
  const userData: any = JSON.parse(userDetail);
  const permissionList = userData?.all_permissions;
  const router = useRouter();
  const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';

  // React.useEffect(() => {
  //   let businessDetail: any = localStorage.getItem('user_business_details');
  //   let businessName: any = JSON.parse(businessDetail);
  //   let subscriptions = businessName?.subscriptions;
  //   let subscriptionData = subscriptions.map((data, i) => {
  //     let date = new Date(data.end_date);
  //     return date;
  //   });
  //   setDateArray(subscriptionData);
  // }, []);

  // React.useEffect(() => {
  //   const today = new Date();
  //   for (let i = 0; i < dateArray.length; i++) {
  //     if (today > dateArray[i]) {
  //       setIsGreater(true);
  //       break;
  //     }
  //   }
  // }, [dateArray]);

  const SidebarItemMap = () => (
    <Fragment>
      {siteSettings.sidebarLinks.admin.map((item, index) => (
        <SidebarItem
          style={{ marginBottom: 50 }}
          key={`${item.label}-${index}`}
          item={item}
        />
      ))}
      <div
        style={{
          bottom: 0,
          position: 'fixed',
          display: 'flex',
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: '#fff',
          width: 240,
        }}
      >
        <Image alt="img" height={25} width={40} src={iconn} />
        <h6 className="pt-2" style={{ color: 'gray' }}>
          Powered by Ignite
        </h6>
      </div>
    </Fragment>
  );

  return (
    <div
      className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150"
      dir={dir}
    >
      <Navbar />
      <MobileNavigation>
        <SidebarItemMap />
      </MobileNavigation>

      <div className="flex flex-1 pt-20">
        <aside className="xl:w-76 fixed bottom-0 hidden h-full w-72 overflow-y-auto bg-white px-4 pt-22 shadow ltr:left-0 ltr:right-auto rtl:right-0 rtl:left-auto lg:block">
          <div className="flex flex-col space-y-6 py-3 pb-24">
            <SidebarItemMap />
          </div>
        </aside>
        <main className="ltr:xl:pl-76 rtl:xl:pr-76 w-full ltr:lg:pl-72 rtl:lg:pr-72 rtl:lg:pl-0">
          <div className="h-full p-5 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
