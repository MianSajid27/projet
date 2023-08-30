import Link from '@/components/ui/link';
import { getIcon } from '@/utils/get-icon';
import * as sidebarIcons from '@/components/icons/sidebar';
import { useUI } from '@/contexts/ui.context';
import NavItemHeaders from './nav-item-header-new';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
const SidebarItem = (props: any) => {
  const { t } = useTranslation('common');
  const { href, label, icon, children } = props.item;
  const { closeSidebar } = useUI();
  const [PermissionDataArray, setPermissionDataArray] = useState<any>([]);
  const [userEmail, setUserEmail] = useState<any>('');

  useEffect(() => {
    const userDetail: any = localStorage.getItem('user_detail');
    const userData: any = JSON.parse(userDetail);
    setUserEmail(userData);
    const permissionList = userData?.all_permissions;
    setPermissionDataArray(permissionList);
  }, []);
  if (children) {
    return <NavItemHeaders child={props.item.children} item={props.item} />;
  }

  return (
    <>
      {PermissionDataArray?.find((item) => {
        if (
          label === 'dashboard' &&
          item.toLocaleLowerCase().includes('business_settings_dashboard')
        ) {
          return true;
        }
        if (
          label === 'customers' &&
          item.toLocaleLowerCase().includes('customer.view')
        ) {
          return true;
        }
        if (
          label === 'supplier' &&
          item.toLocaleLowerCase().includes('supplier.view')
        ) {
          return true;
        }
        if (
          userEmail?.email == 'rehannadeem93@gmail.com' ||
          (userEmail?.email == 'aleemsajjad1@gmail.com' &&
            label === 'superAdmin' &&
            item.toLocaleLowerCase().includes('supplier.view'))
        ) {
          return true;
        }
        return false;
      }) && (
        <Link
          href={href}
          className="flex w-full items-center text-base text-body-dark text-start focus:text-accent"
        >
          {getIcon({
            iconList: sidebarIcons,
            iconName: icon,
            className: 'w-5 h-5 me-4',
          })}
          <span onClick={() => closeSidebar()}>{t(`common:${label}`)}</span>
        </Link>
      )}
    </>
  );
};

export default SidebarItem;
