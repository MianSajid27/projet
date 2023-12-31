import AuthorCreateOrUpdateForm from '@/components/variant/author-form';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopLayout from '@/components/layouts/shop';
import { adminOwnerAndStaffOnly } from '@/utils/auth-utils';

export default function CreateAuthorPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-author')}
        </h1>
      </div>
      <AuthorCreateOrUpdateForm />
    </>
  );
}
CreateAuthorPage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
CreateAuthorPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
