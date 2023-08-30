import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { AttachmentInput, Type, TypeSettingsInput } from '@/types';
import { useTranslation } from 'next-i18next';
import Router from 'next/router';
import { Routes } from '@/config/routes';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import FormData from 'form-data';
import moment from 'moment';
import { Calendar } from 'react-date-range';
import {
  AddingCouponsFunction,
  AddingFunction,
  UpdatingCouponFunction,
  UpdatingFunction,
} from '@/services/Service';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

type FormValues = {
  code?: string | null;
  amount?: string | null;
  radio?: string | null;
  qty?: string | null;
  note?: string | null;
  date?: string | null;
};
const defaultValues = {
  code: '',
  amount: '',
  radio: '',
  qty: '',
  note: '',
  date: '',
};
type IProps = {
  initialValues?: Type | null;
};
export default function CreateOrUpdateTypeForm(initialValues: any) {
  const [creatingLoading, setCreatingLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const [showCalander, setShowCalander] = useState(false);
  const [showCalanderEnd, setShowCalanderEnd] = useState(false);
  const [Dates, setDate] = useState<any>();
  const [DatesEnd, setDateEnd] = useState<any>();
  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore

    defaultValues: initialValues.initialValues
      ? {
          ...initialValues.initialValues,
        }
      : defaultValues,
  });
  let currentDate = moment(new Date()).format('YYYY-MM-DD');
console.log(initialValues.initialValues);
useEffect(()=>{
  if(initialValues?.initialValues){
    setDate(initialValues?.initialValues?.start_date)
    setDateEnd(initialValues?.initialValues?.expire_date)
  }
},[initialValues.initialValues])

  const onSubmit = (values: FormValues) => {
    let ID = initialValues?.initialValues?.id;

    let form = {
      code: values.code,
      amount: values.amount,
      radio: 'no',
      qty: values.qty,
      start_date: Dates,
      expire_date: DatesEnd,
      note: values.note,
    };
    let UpdateForm = {
      coupon_id: ID,
      code: values.code,
      amount: values.amount,
      radio: 'no',
      qty: values.qty,
      start_date: Dates,
      expire_date: DatesEnd,
      note: values.note,
    };
    if (initialValues.initialValues) {
      setCreatingLoading(true);
      UpdatingCouponFunction('/update-coupons', UpdateForm).then((result) => {
        if (result.success) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          router.back();
        } else {
          toast.error('Something Went Wrong');
          setCreatingLoading(false);
        }
      });
    } else {
      setCreatingLoading(true);
      AddingCouponsFunction('/create-coupon', form).then((result) => {
        if (result.success) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          router.back();
        } else {
          toast.error('Something Went Wrong');
          setCreatingLoading(false);
        }
      });
    }
  };

  const onhowCalannder = () => {
    setShowCalander(!showCalander);
  };

  const onhowCalannderEnd = () => {
    setShowCalanderEnd(!showCalanderEnd);
  };

  const handleSelect = (date) => {
    let dates = moment(date).format('YYYY-MM-DD');
    setDate(dates);
    setShowCalander(!showCalander);
  };

  const handleSelectEnd = (date) => {
    let dates = moment(date).format('YYYY-MM-DD');
    setDateEnd(dates);
    setShowCalanderEnd(!showCalanderEnd);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('common:desccription')}
          details={t('common:add-new-coupons')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('common:code')}
            {...register('code')}
            error={t(errors.code?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('common:amount')}
            {...register('amount')}
            error={t(errors.amount?.message!)}
            variant="outline"
            type="number"
            className="mb-5"
          />
          <Input
            label={t('common:qty')}
            {...register('qty')}
            type="number"
            error={t(errors.qty?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('common:note')}
            {...register('note')}
            error={t(errors.note?.message!)}
            variant="outline"
            className="mb-5"
          />
          <div className="mb-5 w-full ">
            <div onClick={onhowCalannder}>
              <Input
                // {...register('date')}
                label={t("form:form-item-start-date")}
                name="credit_limit"
                variant="outline"
                value={Dates}
              />
            </div>
            {showCalander && (
              <div style={{ zIndex: 999 }}>
                <Calendar
                  color="bg-accent"
                  date={new Date()}
                  onChange={handleSelect}
                />
              </div>
            )}
          </div>
          <div className="mb-5 w-full ">
            <div onClick={onhowCalannderEnd}>
              <Input
                // {...register('date')}
                label={t("form:form-item-end-date")}
                name="credit_limit"
                variant="outline"
                value={DatesEnd}
              />
            </div>
            {showCalanderEnd && (
              <div style={{ zIndex: 999 }}>
                <Calendar
                  color="bg-accent"
                  date={new Date()}
                  onChange={handleSelectEnd}
                />
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button loading={creatingLoading}>
          {initialValues.initialValues
            ? t('common:update-coupon')
            : t('common:add-coupon')}
        </Button>
      </div>
    </form>
  );
}
