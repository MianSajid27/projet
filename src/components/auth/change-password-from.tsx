import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { toast } from 'react-toastify';
import PasswordInput from '@/components/ui/password-input';
import Input from '@/components/ui/input';
import { useChangePasswordMutation } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { UpdatePassword } from '@/services/Service';

interface FormValues {
  oldPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}

const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required('form:error-old-password-required'),
  newPassword: yup.string().required('form:error-password-required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'form:error-match-passwords')
    .required('form:error-confirm-password'),
});

const ChangePasswordForm = () => {
  const { t } = useTranslation();

  const { mutate: changePassword, isLoading: loading } =
    useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    setError,
    reset,

    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(changePasswordSchema),
  });

  async function onSubmit(values: FormValues) {
    let formVal = {
      current_password: values.oldPassword,
      new_password: values.newPassword,
    };
    UpdatePassword('/update-password', formVal).then((result) => {

      if (result.success == 1) {
        toast.success(result.msg);
        reset();
      } else {
        toast.error(result.error.message);
      }
    });
  }

  /*  changePassword(
      {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      },
      {
        onError: (error: any) => {
          Object.keys(error?.response?.data).forEach((field: any) => {
            setError(field, {
              type: 'manual',
              message: error?.response?.data[field][0],
            });
          });
        },
        onSuccess: (data) => {
          if (!data?.success) {
            setError('oldPassword', {
              type: 'manual',
              message: data?.message ?? '',
            });
          } else if (data?.success) {
            toast.success(t('common:password-changed-successfully'));
            reset();
          }
        },
      }
    ); */

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-password')}
          details={t('form:password-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
          <PasswordInput
            label={t('form:input-label-old-password')}
            {...register('oldPassword')}
            variant="outline"
            error={t(errors.oldPassword?.message!)}
            className="mb-5"
          />
          <PasswordInput
            label={t('form:input-label-new-password')}
            {...register('newPassword')}
            variant="outline"
            error={t(errors.newPassword?.message!)}
            className="mb-5"
          />
          <PasswordInput
            label={t('form:input-label-confirm-password')}
            {...register('passwordConfirmation')}
            variant="outline"
            error={t(errors.passwordConfirmation?.message!)}
          />
        </Card>

        <div className="w-full text-end">
          <Button loading={loading} disabled={loading}>
            {t('form:button-label-change-password')}
          </Button>
        </div>
      </div>
    </form>
  );
};
export default ChangePasswordForm;
