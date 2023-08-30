import { useForm } from 'react-hook-form';
import { AttachmentInput, Category, Type, TypeSettingsInput } from '@/types';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import Card from '../common/card';
import { AiOutlineInbox } from 'react-icons/ai';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { BiDetail } from 'react-icons/bi';
import { MdOutlineDashboardCustomize } from 'react-icons/md';
import { AiOutlineDollarCircle } from 'react-icons/ai';
import { GiPoolTriangle } from 'react-icons/gi';
import { IoIosArrowUp } from 'react-icons/io';
import { ExpandLessIcon } from '@/components/icons/expand-less-icon';
import { ExpandMoreIcon } from '@/components/icons/expand-more-icon';
import logo from '../../../public/ignite-logo.png';
import Image from 'next/image';

export default function CreateOrUpdateTypeForm() {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [section, setSection] = useState();
  const items = [
    {
      title:'f-first-title',
      content:'f-first-content',
    },
    {
      title:'f-second-title',
      content: 'f-second-content'
        ,
    },
    {
      title:'f-third-title' ,
      content:'f-third-content'
        ,
    },
    {
      title:'f-fourth-title'
        ,
      content:'f-fourth-content'
        ,
    },
    {
      title: 'f-fifth-title',
      content:'f-fifth-content'
      ,
    },
  ];
  let expandIcon;
  if (Array.isArray(items) && items.length) {
    expandIcon = !isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />;
  }
  const handleFAQ = (e) => {
    setSection(e);
    setOpen(!isOpen);
  };

  return (
    <>
      <Card>
        <Image width={200} height={80} alt="img" src={logo} />

        <h1 className="font-semibold">{t('common:ignite-marketplace')}</h1>
        <p className="pt-3">
          {t('common:ignite-marketplace-description')}
         
        </p>
        <div className="border-b-2 pt-5" />
        <div className="grid  sm:grid-cols-3 md:grid-cols-6 gap-4 pt-5 text-center">
          <div>
            <div className="flex justify-center">
              <AiOutlineInbox className="h-8 w-8" color="#E2B944" />
            </div>
            <div className="text-sm">{t("common:additional-sale-channel")}</div>
          </div>
          <div>
            <div className="flex justify-center">
              <HiOutlineUserGroup className="h-8 w-8" color="#E2B944" />
            </div>
            <div className="text-sm">{t("common:reaching-customer-segment")}</div>
          </div>
          <div>
            <div className="flex justify-center">
              <BiDetail className="h-8 w-8" color="#E2B944" />
            </div>
            <div className="text-sm">
            {t("common:manage-control-store")}
              
            </div>
          </div>
          <div>
            <div className="flex justify-center">
              <BiDetail className="h-8 w-8" color="#009F7F" />
            </div>
            <div className="text-sm">{t("common:order-tracking")}</div>
          </div>
          <div>
            <div className="flex justify-center">
              <MdOutlineDashboardCustomize
                className="h-8 w-8"
                color="#009F7F"
              />
            </div>
            <div className="text-sm">
            {t("common:discover-unique-product")}
             
            </div>
          </div>
          <div>
            <div className="flex justify-center">
              <GiPoolTriangle className="h-8 w-8" color="#009F7F" />
            </div>
            <div className="text-sm">{t("common:unique-shipping")}</div>
          </div>
          <div>
            <div className="flex justify-center">
              <AiOutlineDollarCircle className="h-8 w-8" color="#E2B944" />
            </div>
            <div className="text-sm">{t('common:competitive-fee')}</div>
          </div>
        </div>
      </Card>
      <Card className="mt-3">
        <h3 className=" font-semibold text-heading">
          {t('common:f-a-q')}
        </h3>
        <div>
          {items.map((item, index) => (
            <>
              <div className="my-2 ">
                <button
                  className="flex w-full rounded-t bg-slate-200 p-2 items-center border-0 text-base outline-none text-start  focus:ring-0"
                  onClick={() => {
                    handleFAQ(index);
                  }}
                >
                  <p className="flex-1 text-black">{t(`common:${item.title}`)}</p>
                  <span className='text-black'>{expandIcon}</span>
                </button>

                {isOpen && section === index && (
                  <div className="bg-stone-100 p-2 rounded-b ">
                    <section >{t(`common:${item.content}`)}</section>
                  </div>
                )}
              </div>
            </>
          ))}
        </div>
      </Card>
      <Card className="mt-3">
        <h1 className="font-semibold">
          {t('common:ignite-setting-customization')}
          
        </h1>
      </Card>
    </>
  );
}
