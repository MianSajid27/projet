import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import {
  AttachmentInput,
  ContactDetailsInput,
  Type,
  TypeSettingsInput,
  UserAddressInput,
} from '@/types';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { typeValidationSchema } from './customer-validation-schema';
import FileInput from '@/components/ui/file-input';
import Router from 'next/router';
import { Routes } from '@/config/routes';
import { Config } from '@/config';
import TextArea from '@/components/ui/text-area';
import { toast } from 'react-toastify';
// import { AddBrands } from '../../services/Service';
import Label from '@/components/ui/label';
import { Controller, useFieldArray } from 'react-hook-form';
import ValidationError from '@/components/ui/form-validation-error';
import { DatePicker } from '@/components/ui/date-picker';
import { useState } from 'react';
import { AddingCustomerFunction, AddingFunction, UpdatingCustomerFunction, UpdatingFunction } from '@/services/Service';
import moment from 'moment';

type BannerInput = {
  title: string;
  description: string;
  image: AttachmentInput;
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
  custom_field2:''
};
type FormValues = {
  first_name?: string | null;
  last_name?: string | null;
  opening_balance: any;
  lname?: string | null;
  icon?: any;
  credit_limit: any;
  banners: BannerInput[];
  settings: TypeSettingsInput;
  des: string | null;
  contactDetails: ContactDetailsInput;
  email?: string | null;
  dob: string;
  address: UserAddressInput;
  RegistrationDate: string | null;
  order: string | null;
  spend: string | null;
  mobile: any;
  country: any;
  city: any;
  state: any;
  zip: any;
  street_address: any;
  custom_field2:string
};

export default function CreateOrUpdateTypeForm(initialValues: any) {
  
  const [creatingLoading, setCreatingLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
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
  const onSubmit = (values: FormValues) => {
    let formVal = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      // dob:  moment(values.dob).format('yy-dd-mm'),
      dob:  "2022-13-12",
      mobile: values.mobile,
      promotional_sliders: values.credit_limit,
      credit_limit: values.credit_limit,
      type: 'customer',
      custom_field2: values.custom_field2
    };

    if (initialValues.initialValues) {
      let ID = initialValues.initialValues.id;
      setCreatingLoading(true);
      UpdatingCustomerFunction('/contactapi/', formVal, ID).then((result) => {
        if (!result.exception) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);

          router.back();
        } else {
          toast.error("Something went Wrong");
          setCreatingLoading(false);
        }
      });
    } else {
      setCreatingLoading(true);

      AddingCustomerFunction('/contactapi', formVal).then((result) => {
        if (result) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          router.back();
        } 
        if(result.error) {
          toast.error("Somethink went wrong");
          setCreatingLoading(false);
        }
      });
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:item-description')}
          // details={`${
          //   initialValues.initialValues
          //     ? t('form:item-description-update')
          //     : t('form:item-description-add')
          // } ${t('form:type-description-help-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-Fname')}
            {...register('first_name')}
            error={t(errors.first_name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-Lname')}
            {...register('last_name')}
            error={t(errors.last_name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-email')}
            {...register('email')}
            variant="outline"
            className="mb-4"
            error={t(errors.email?.message!)}
          />
          <Input
            label={t('form:input-label-credit-limit')}
            {...register('credit_limit')}
            variant="outline"
            className="mb-4"
          />
            <Input
                label={t('form:input-label-phone-no')}
                {...register('mobile')}
                variant="outline"
                className="mb-5"
              />
               <TextArea
                label={t('form:input-label-note')}
                {...register('custom_field2')}
                variant="outline"
                className="mb-5"
              />
          {/* <Input
            label={t('Registration Date')}
            {...register('RegistrationDate')}
            type="number"
            variant="outline"
            className="mb-4"
            error={t(errors.RegistrationDate?.message!)}
          /> */}
          {/* <Input
            label={t('Order')}
            {...register('order')}
            variant="outline"
            className="mb-4"
            error={t(errors.order?.message!)}
          />
          <Input
            label={t('Spend')}
            {...register('spend')}
            variant="outline"
            className="mb-4"
            error={t(errors.spend?.message!)}
          />
          <TextArea
            label={t('form:input-description')}
            {...register('des')}
            error={t(errors.des?.message!)}
            variant="outline"
            className="mb-5"
          /> */}
          <div className="mb-5 flex flex-col sm:flex-row">
            {/* <div className="mb-5 w-full p-0 sm:mb-0 sm:w-1/2 sm:pe-2">
              <Label>{t('form:input-label-author-dob')}</Label>
              <Controller
                control={control}
                name="dob"
                render={({ field: { onChange, onBlur, value } }) => (
                  <DatePicker
                    // dateFormat="yy-dd-mm"
                    onChange={onChange}
                    onBlur={onBlur}
                    //@ts-ignore
                    // selected={value}
                    selectsStart
                    startDate={new Date()}
                    className="border border-border-base"
                  />
                )}
              />
              <ValidationError message={t(errors.dob?.message!)} />
            </div> */}
            {/* <div className="mb-5 w-full p-0 sm:mb-0 sm:w-1/2 sm:pe-2">
              <Input
                label={t('form:input-label-phone-no')}
                {...register('mobile')}
                variant="outline"
                className="mb-5"
              />
            </div> */}
          </div>
        </Card>
      </div>

      {/* <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('More Information')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        
        <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-country')}
              {...register('country')}
              variant="outline"
              className="mb-5"
              error={t(errors.country?.message!)}
            />
            <Input
              label={t('form:input-label-city')}
              {...register('city')}
              variant="outline"
              className="mb-5"
              error={t(errors.city?.message!)}
            />
            <Input
              label={t('form:input-label-state')}
              {...register('state')}
              variant="outline"
              className="mb-5"
              error={t(errors.state?.message!)}
            />
            <Input
              label={t('form:input-label-zip')}
              {...register('zip')}
              variant="outline"
              className="mb-5"
              error={t(errors.zip?.message!)}
            />
            <TextArea
              label={t('form:input-label-street-address')}
              {...register('street_address')}
              variant="outline"
              error={t(errors.street_address?.message!)}
            />
          </Card>
      </div> */}

      <div className="mb-4 text-end">
        {initialValues.initialValues && (
          <Button
            variant="outline"
            onClick={router.back}
            className="me-4"
            type="button"
          >
            {t('form:button-label-back')}
          </Button>
        )}

        <Button loading={creatingLoading}>
          {initialValues.initialValues
            ? t('common:update-customer')
            : t('common:add-customer')}
        </Button>
      </div>
    </form>
  );
}
