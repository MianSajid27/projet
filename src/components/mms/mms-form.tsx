import AdminLayout from '@/components/layouts/admin';

import {
  GetFunction,
  GetFunctionBDetail,
  UpdateUserFunction,
  AddShipping,
  AddingFunction,
  AddingUserFunction,
} from '@/services/Service';
import { adminOnly } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Router, { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useState } from 'react';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import Button from '@/components/ui/button';
import { toast } from 'react-toastify';
import Label from '@/components/ui/label';
import Select from 'react-select';
import { Switch } from '@headlessui/react';
import Input from '@/components/ui/input';
import { selectStyles } from '@/components/ui/select/select.styles';
import TextArea from '../ui/text-area';
import { useForm } from 'react-hook-form';

type FormValues = {
  sender_id: string;
  template_for: string;
  sms_body: string;
  auto_send_sms: string;
};

const defaultValues = {
  sender_id: '',
  template_for: '',
  sms_body: '',
  auto_send_sms: '',
};

export default function CreateOrUpdateTypeForm(initialValues: any) {
  const { t } = useTranslation();
  const [smsHandle, setSmsHandle] = useState(false);
  const [creatingLoading, setCreatingLoading] = useState(false);

  const handleSMS = () => {
    setSmsHandle(!smsHandle);
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    defaultValues: initialValues.initialValues
      ? {
          ...initialValues.initialValues,
        }
      : defaultValues,
  });
  const router = useRouter();

  useEffect(() => {
    let aa = initialValues?.initialValues?.auto_send_sms == 1 ? true : false;
    setSmsHandle(aa);
  }, []);

  const onSubmit = (values: FormValues) => {
    let obj = {
      template_for: values.template_for,
      sms_body: values.sms_body,
      sender_id: values.sender_id,
      auto_send_sms: smsHandle == false ? 0 : 1,
    };

    if (initialValues.initialValues) {
      let ID = initialValues.initialValues.id;
      setCreatingLoading(true);

      AddingUserFunction('/sms-configuration/update/' + ID, obj).then(
        (result) => {
          if (result.success == true) {
            toast.success(t('Role updated successfully!'));
            setCreatingLoading(false);
            router.back();
          } else {
            toast.error(result.message);
            setCreatingLoading(false);
          }
        }
      );
    } else {
      setCreatingLoading(true);

      AddingUserFunction('/sms-configuration', obj).then((result) => {
        if (result.success == true) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          router.back();
        } else {
          toast.error(result.message);
          setCreatingLoading(false);
        }
      });
    }
  };

  //   if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('MMS')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="flex justify-between">
            <div>Auto Send MMS</div>
            <Switch
              checked={smsHandle}
              onChange={handleSMS}
              className={`${
                smsHandle ? 'bg-accent' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
            >
              <span className="sr-only">Enable </span>
              <span
                className={`${
                  smsHandle ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>
          </div>
          <div className="mt-5">
            <div className="flex justify-between">
              <Label></Label>
              <Label className="mb-0 mb-3">12/100</Label>
            </div>
            <div>
              <Input {...register('sender_id')} type="text" label="Sender Id" />
            </div>
            <div className="mt-3">
              <Input
                type="text"
                {...register('template_for')}
                label="Template for"
              />
            </div>
            <div className="mt-3">
              <TextArea {...register('sms_body')} label="MMS Body" />
            </div>
          </div>
        </Card>
      </div>
      <div className="text-end mb-4">
        <Button loading={creatingLoading}>
          {initialValues.initialValues ? t('Update MMS') : t('Add MMS')}
        </Button>
      </div>
    </form>
  );
}
