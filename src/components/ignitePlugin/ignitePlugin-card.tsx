import Input from '@/components/ui/input';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Select from 'react-select';
import {
  ContactDetailsInput,
  Shipping,
  ShopSocialInput,
  Tax,
  AttachmentInput,
  Settings,
} from '@/types';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useTranslation } from 'next-i18next';
import router, { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { UpdatingStoreSetting } from '@/services/Service';
import { toast } from 'react-toastify';
import React from 'react';
import { convertToHTML } from 'draft-convert';
import { convertFromHTML, EditorState } from 'draft-js';
import dynamic from 'next/dynamic';
import { ContentState, convertToRaw } from 'draft-js';
import { EditorProps } from 'react-draft-wysiwyg';
import facebookPixel from '../../../public/image/facebook-pixel.png';
import googleAnalytic from '../../../public/image/google-analytic.png';
import freshChat from '../../../public/image/freshChat.jpg';
import hotjar from '../../../public/image/hotjar.png';
import intercom from '../../../public/image/intercom.png';
import liveChat from '../../../public/image/liveChat.png';
import tawk from '../../../public/image/tawk.png';
import tidio from '../../../public/image/tidio.png';
import trengo from '../../../public/image/trengo.png';
import zendesk from '../../../public/image/zendesk.jpg';
import drift from '../../../public/image/drift.png';
import adroll from '../../../public/image/adroll.png';
import amaze from '../../../public/image/amaze.png';
import tabbyImg from '../../../public/image/tabby.svg';
// install @types/draft-js @types/react-draft-wysiwyg and @types/draft-js @types/react-draft-wysiwyg for types

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Image from 'next/image';

type FormValues = {
  fb_tracking_pixel_id: any;
  google_analytics_id: any;
  location_id: any;
  intercom_live_chat: any;
  drift_live_chat: any;
  tawk_To_live_chat: any;
  tidio_live_chat: any;
  adroll: any;
  hotjar: any;
  re_amaze: any;
  zendesk_chat: any;
  fresh_chat: any;
  live_chat: any;
  trengo: any;
  tabby:any;
};

type IProps = {
  settings?: Settings | null;
  taxClasses: Tax[] | undefined | null;
  shippingClasses: Shipping[] | undefined | null;
};
const defaultValues = {
  image: [],
  name: '',
  details: '',
  parent: '',
  icon: '',
  type: '',
  description: '',
  short_code: '',
};
export default function IgnitePlugin(initialValues: any) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    defaultValues: initialValues.data
      ? {
          ...initialValues.data,
        }
      : defaultValues,
  });
  let form = new FormData();
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [creatingLoading, setCreatingLoading] = useState(false);

  const [isFacebook, setIsFacebook] = useState(false);
  const [isGoogle, setIsGoogle] = useState(false);
  const [isIntercom, setIsIntercom] = useState(false);
  const [isDrift, setIsDrift] = useState(false);
  const [isTawk, setIsTawk] = useState(false);
  const [isTidio, setIsTidio] = useState(false);
  const [isAdroll, setIsAdroll] = useState(false);
  const [isHotjar, setIsHotjar] = useState(false);
  const [isAmaze, setIsAmaze] = useState(false);
  const [isZendesk, setIsZendesk] = useState(false);
  const [isFreshChat, setIsFreshChat] = useState(false);
  const [isLiveChat, setIsLiveChat] = useState(false);
  const [isTrengo, setIsTrengo] = useState(false);
  const [isTabby, setTabby] = useState(false);
  // const[customScript,setCustomScript]=useState<any>()

  const onSubmit = (values: FormValues) => {
    let ID = initialValues.data.id;
    console.log(values.tabby);
    
    form.append('id', ID);
    form.append('fb_tracking_pixel_id', values.fb_tracking_pixel_id?values.fb_tracking_pixel_id:'');
    form.append('google_analytics_id', values.google_analytics_id?values.google_analytics_id:'');
    form.append('adroll', values.adroll?values.adroll:'');
    form.append('drift_live_chat', values.drift_live_chat?values.drift_live_chat:'');
    form.append('fresh_chat', values.fresh_chat?values.fresh_chat:'');
    form.append('hotjar', values.hotjar?values.hotjar:'');
    form.append('intercom_live_chat', values.intercom_live_chat?values.intercom_live_chat:'');
    form.append('live_chat', values.live_chat?values.live_chat:'');
    form.append('re_amaze', values.re_amaze?values.re_amaze:'');
    form.append('tawk_To_live_chat', values.tawk_To_live_chat?values.tawk_To_live_chat:'');
    form.append('tidio_live_chat', values.tidio_live_chat?values.tidio_live_chat:'');
    form.append('trengo', values.trengo?values.trengo:'');
    form.append('zendesk_chat', values.zendesk_chat?values.zendesk_chat:'');
    form.append('location_id', values.location_id?values.location_id:'');
    form.append('tabby', JSON.stringify(values.tabby));
    setCreatingLoading(true);
    UpdatingStoreSetting('/storefront', form).then((result) => {
      if (result.success) {
        toast.success(t('common:successfully-created'));
        setCreatingLoading(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(t(result.msg));
        setCreatingLoading(false);
      }
    });
  };

  const handleFacebookPlugin = () => {
    setIsFacebook(!isFacebook);
  };
  const handleGooglePlugin = () => {
    setIsGoogle(!isGoogle);
  };
  const handleAdroll = () => {
    setIsAdroll(!isAdroll);
  };
  const handleAmaze = () => {
    setIsAmaze(!isAmaze);
  };
  const handleDrift = () => {
    setIsDrift(!isDrift);
  };
  const handleFreshChat = () => {
    setIsFreshChat(!isFreshChat);
  };
  const handleHotJar = () => {
    setIsHotjar(!isHotjar);
  };
  const handleIntercom = () => {
    setIsIntercom(!isIntercom);
  };
  const handleLiveChat = () => {
    setIsLiveChat(!isLiveChat);
  };
  const handleTawk = () => {
    setIsTawk(!isTawk);
  };
  const handleTidio = () => {
    setIsTidio(!isTidio);
  };
  const handleTrengo = () => {
    setIsTrengo(!isTrengo);
  };
  const handleTabby = () => {
    setTabby(!isTabby);
  };
  const handleZendesk = () => {
    setIsZendesk(!isZendesk);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-google-analytic-id')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center">
              <Image width={100} height={100} src={googleAnalytic} alt="" />
            </div>
            <div className="col-span-6">
              <h3 className="font-semibold">Google analytics</h3>
              <p className="">{t('common:google-analytic-description')}</p>
              <button
                type="button"
                className="bg-accent text-white p-2 rounded"
                onClick={handleGooglePlugin}
              >
               {t('common:install-plugin')}
              </button>
            </div>
          </div>
          {isGoogle && (
            <Input
              // label={t('form:input-label-google-analytic-id')}
              {...register('google_analytics_id')}
              placeholder="Enter Tracking ID"
              variant="outline"
              className="mb-5"
              // value={googleCode}
              // onChange={(e) => { setGoogleCode(e.target.value) }}
            />
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-facebook-pixel-id')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
              <Image
                width={100}
                height={100}
                src={facebookPixel}
                className="rounded"
                alt=""
              />
            </div>
            <div className="col-span-6">
              <h3 className="font-semibold">Facebook Pixel</h3>
              <p className=""> 
              {t('common:facebook-pixel-description')}
               
              </p>
              <button
                type="button"
                className="bg-accent text-white p-2 rounded"
                onClick={handleFacebookPlugin}
              >
                {t('common:install-plugin')}
              </button>
            </div>
          </div>
          {isFacebook && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              {...register('fb_tracking_pixel_id')}
              placeholder="Enter Pixel ID"
              variant="outline"
              className="mb-5"
              // value={facebookCode}
              // onChange={(e) => { setFacebookCode(e.target.value) }}
            />
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-intercom-live-chat')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
              <Image
                width={100}
                height={100}
                src={intercom}
                className="rounded"
                alt=""
              />
            </div>
            <div className="col-span-6">
              <h3 className="font-semibold">Intercom Live Chat</h3>
              <p className="">
              {t('common:intercom-chat-description')}
                
              </p>
              <button
                type="button"
                className="bg-accent text-white p-2 rounded"
                onClick={handleIntercom}
              >
               {t('common:install-plugin')}
              </button>
            </div>
          </div>
          {isIntercom && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              {...register('intercom_live_chat')}
              placeholder="Enter App ID"
              variant="outline"
              className="mb-5"
              // value={facebookCode}
              // onChange={(e) => { setFacebookCode(e.target.value) }}
            />
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-drift-live-chat')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
              <Image
                width={100}
                height={100}
                src={drift}
                className="rounded"
                alt=""
              />
            </div>
            <div className="col-span-6">
              <h3 className="font-semibold">Drift Live Chat</h3>
              <p className="">
              {t('common:drift-chat-description')}
               
              </p>
              <button
                type="button"
                className="bg-accent text-white p-2 rounded"
                onClick={handleDrift}
              >
               {t('common:install-plugin')}
              </button>
            </div>
          </div>
          {isDrift && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              {...register('drift_live_chat')}
              variant="outline"
              className="mb-5"
              placeholder="Enter Secret Key"
              // value={facebookCode}
              // onChange={(e) => { setFacebookCode(e.target.value) }}
            />
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-tawk-live-chat')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
              <Image
                width={100}
                height={100}
                src={tawk}
                className="rounded"
                alt=""
              />
            </div>
            <div className="col-span-6">
              <h3 className="font-semibold">Tawk.To : Live Chat</h3>
              <p className="">
              {t('common:tawk-chat-description')}
              
              </p>
              <button
                type="button"
                className="bg-accent text-white p-2 rounded"
                onClick={handleTawk}
              >
                {t('common:install-plugin')}
              </button>
            </div>
          </div>
          {isTawk && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              {...register('tawk_To_live_chat')}
              placeholder="Enter Tawk Api"
              variant="outline"
              className="mb-5"
              // value={facebookCode}
              // onChange={(e) => { setFacebookCode(e.target.value) }}
            />
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-tidio-live-chat')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
              <Image
                width={100}
                height={100}
                src={tidio}
                className="rounded"
                alt=""
              />
            </div>
            <div className="col-span-6">
              <h3 className="font-semibold">Tidio Live Chat</h3>
              <p className="">{t('common:tidio-chat-description')}</p>
              <button
                type="button"
                className="bg-accent text-white p-2 rounded"
                onClick={handleTidio}
              >
              {t('common:install-plugin')}
              </button>
            </div>
          </div>
          {isTidio && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              {...register('tidio_live_chat')}
              placeholder="Enter Tidio code"
              variant="outline"
              className="mb-5"
              // value={facebookCode}
              // onChange={(e) => { setFacebookCode(e.target.value) }}
            />
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-adroll')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
              <Image
                width={100}
                height={100}
                src={adroll}
                className="rounded"
                alt=""
              />
            </div>
            <div className="col-span-6">
              <h3 className="font-semibold">Adroll</h3>
              <p className="">
              {t('common:adroll-description')}
               
              </p>
              <button
                type="button"
                className="bg-accent text-white p-2 rounded"
                onClick={handleAdroll}
              >
              {t('common:install-plugin')}
              </button>
            </div>
          </div>
          {isAdroll && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              {...register('adroll')}
              placeholder="Enter Adroll Pixel Id"
              variant="outline"
              className="mb-5"
              // value={facebookCode}
              // onChange={(e) => { setFacebookCode(e.target.value) }}
            />
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-hotjar')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
              <Image
                width={100}
                height={100}
                src={hotjar}
                className="rounded"
                alt=""
              />
            </div>
            <div className="col-span-6">
              <h3 className="font-semibold">Hotjar</h3>
              <p className="">
              {t('common:hotjar-description')}
                
              </p>
              <button
                type="button"
                className="bg-accent text-white p-2 rounded"
                onClick={handleHotJar}
              >
               {t('common:install-plugin')}
              </button>
            </div>
          </div>
          {isHotjar && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              {...register('hotjar')}
              placeholder="Enter Hotjar Tracking Code"
              variant="outline"
              className="mb-5"
              // value={facebookCode}
              // onChange={(e) => { setFacebookCode(e.target.value) }}
            />
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-amaze')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
              <Image
                width={100}
                height={100}
                src={amaze}
                className="rounded"
                alt=""
              />
            </div>
            <div className="col-span-6">
              <h3 className="font-semibold">Re:amaze</h3>
              <p className="">
              {t('common:amaze-description')}
               
              </p>
              <button
                type="button"
                className="bg-accent text-white p-2 rounded"
                onClick={handleAmaze}
              >
               {t('common:install-plugin')}
              </button>
            </div>
          </div>
          {isAmaze && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              {...register('re_amaze')}
              placeholder="Enter Brand Subdomain"
              variant="outline"
              className="mb-5"
              // value={facebookCode}
              // onChange={(e) => { setFacebookCode(e.target.value) }}
            />
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-zendesk-chat')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
              <Image
                width={100}
                height={100}
                src={zendesk}
                className="rounded"
                alt=""
              />
            </div>
            <div className="col-span-6">
              <h3 className="font-semibold">Zendesk Chat</h3>
              <p className="">{t('common:zendesk-chat-description')}</p>
              <button
                type="button"
                className="bg-accent text-white p-2 rounded"
                onClick={handleZendesk}
              >
               {t('common:install-plugin')}
              </button>
            </div>
          </div>
          {isZendesk && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              {...register('zendesk_chat')}
              placeholder="Enter Snippet Key"
              variant="outline"
              className="mb-5"
              // value={facebookCode}
              // onChange={(e) => { setFacebookCode(e.target.value) }}
            />
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-fresh-chat')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
              <Image
                width={100}
                height={100}
                src={freshChat}
                className="rounded"
                alt=""
              />
            </div>
            <div className="col-span-6">
              <h3 className="font-semibold">Fresh Chat</h3>
              <p className="">
              {t('common:fresh-chat-description')}
                
              </p>
              <button
                type="button"
                className="bg-accent text-white p-2 rounded"
                onClick={handleFreshChat}
              >
               {t('common:install-plugin')}
              </button>
            </div>
          </div>
          {isFreshChat && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              {...register('fresh_chat')}
              placeholder="Enter Unique ID"
              variant="outline"
              className="mb-5"
              // value={facebookCode}
              // onChange={(e) => { setFacebookCode(e.target.value) }}
            />
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-live-chat')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
              <Image
                width={100}
                height={100}
                src={liveChat}
                className="rounded"
                alt=""
              />
            </div>
            <div className="col-span-6">
              <h3 className="font-semibold">LiveChat</h3>
              <p className="">
              {t('common:live-chat-description')}
                
              </p>
              <button
                type="button"
                className="bg-accent text-white p-2 rounded"
                onClick={handleLiveChat}
              >
                {t('common:install-plugin')}
              </button>
            </div>
          </div>
          {isLiveChat && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              {...register('live_chat')}
              placeholder="Enter License Number"
              variant="outline"
              className="mb-5"
              // value={facebookCode}
              // onChange={(e) => { setFacebookCode(e.target.value) }}
            />
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-trengo')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
              <Image
                width={100}
                height={100}
                src={trengo}
                className="rounded"
                alt=""
              />
            </div>
            <div className="col-span-6">
              <h3 className="font-semibold">TRENGO</h3>
              <p className="">{t('common:rengo-description')} </p>
              <button
                type="button"
                className="bg-accent text-white p-2 rounded"
                onClick={handleTrengo}
              >
                {t('common:install-plugin')}
              </button>
            </div>
          </div>
          {isTrengo && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              {...register('trengo')}
              placeholder="Enter Key"
              variant="outline"
              className="mb-5"
              // value={facebookCode}
              // onChange={(e) => { setFacebookCode(e.target.value) }}
            />
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-tabby')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
              <Image
                width={100}
                height={100}
                src={tabbyImg}
                className="rounded"
                alt=""
              />
            </div>
            <div className="col-span-6">
              <h3 className="font-semibold">Tabby</h3>
              <p className="">{t('common:tabby-description')} </p>
              <button
                type="button"
                className="bg-accent text-white p-2 rounded"
                onClick={handleTabby}
              >
                {t('common:install-plugin')}
              </button>
            </div>
          </div>
          {isTabby && (
            <>
              <Input
              // label={t('form:input-label-facebook-pixel-id')}
              {...register('tabby.merchant_code')}
              // name={'marchent-code'}
              placeholder="Merchant Code"
              variant="outline"
              className="mb-5"
              // value={facebookCode}
              // onChange={(e) => { setFacebookCode(e.target.value) }}
            />
            <Input
            // label={t('form:input-label-facebook-pixel-id')}
            {...register('tabby.public_key')}
            // name={'marchent-code'}
            placeholder="Public Key"
            variant="outline"
            className="mb-5"
            // value={facebookCode}
            // onChange={(e) => { setFacebookCode(e.target.value) }}
          />
            </>
          
          )}
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button type="submit" loading={creatingLoading}>
          {t('form:button-label-save')}
        </Button>
      </div>
    </form>
  );
}
