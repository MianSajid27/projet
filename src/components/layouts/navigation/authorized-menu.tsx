import cn from 'classnames';
import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Avatar from '@/components/common/avatar';
import Link from '@/components/ui/link';
import { siteSettings } from '@/settings/site.settings';
import { useTranslation } from 'next-i18next';
import React from 'react';
// import { useMeQuery } from '@/data/user';

export default function AuthorizedMenu() {
  const [userData, setUserData] = useState<any>();
  React.useEffect(() => {
    let businessDetails: any = localStorage.getItem('user_detail');
    setUserData(JSON.parse(businessDetails));
  }, []);

  // const { data } = useMeQuery();
  const { t } = useTranslation('common');

  // Again, we're using framer-motion for the transition effect
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center focus:outline-none">
        <Avatar
          src={
            // data?.profile?.avatar?.thumbnail ??
            siteSettings?.avatar?.placeholder
          }
          alt="avatar"
        />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          as="ul"
          className="absolute mt-1 w-48 rounded bg-white shadow-md end-0 origin-top-end focus:outline-none"
        >
          <Menu.Item>
            <li
              className="flex w-full flex-col space-y-1 rounded-t
             bg-[#212121] px-4 py-3 text-sm text-white"
            >
              <span className="font-semibold capitalize">
                {userData?.first_name + ' ' + userData?.last_name}
              </span>
              <span className="text-xs">{userData?.username}</span>
            </li>
          </Menu.Item>

          {siteSettings.authorizedLinks.map(({ href, labelTransKey }) => (
            <Menu.Item key={`${href}${labelTransKey}`}>
              {({ active }) => (
                <li className="cursor-pointer border-b border-gray-100 last:border-0">
                  <Link
                    href={href}
                    className={cn(
                      'block px-4 py-3 text-sm font-semibold capitalize transition duration-200 hover:text-accent',
                      active ? 'text-accent' : 'text-heading'
                    )}
                  >
                    {t(labelTransKey)}
                  </Link>
                </li>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
