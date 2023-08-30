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
import { Switch } from '@headlessui/react';
import Description from '@/components/ui/description';
import ColorPicker from '@/components/ui/color-picker/color-picker';
import DisplayColorCode from '@/components/ui/color-picker/display-color-code';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import { CURRENCY } from './currency';
import { siteSettings } from '@/settings/site.settings';
import ValidationError from '@/components/ui/form-validation-error';
import { useUpdateSettingsMutation } from '@/data/settings';
import { useTranslation } from 'next-i18next';
import { selectStyles } from '../ui/select/select.styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { settingsValidationSchema } from './settings-validation-schema';
import FileInput from '@/components/ui/file-input';
import SelectInput from '@/components/ui/select-input';
import TextArea from '@/components/ui/text-area';
import Alert from '@/components/ui/alert';
import { getIcon } from '@/utils/get-icon';
import * as socialIcons from '@/components/icons/social';
import GooglePlacesAutocomplete from '@/components/form/google-places-autocomplete';
import omit from 'lodash/omit';
import SwitchInput from '@/components/ui/switch-input';
import router, { useRouter } from 'next/router';
import { Config } from '@/config';
import { TIMEZONE } from './timeZone';
import { useState, useEffect } from 'react';
import {
  AddingFunction,
  DashboardGetFun,
  GetFunction,
  UpdatingFunction,
  UpdatingProduct,
  UpdatingStoreSetting,
} from '@/services/Service';
import { toast } from 'react-toastify';
import React from 'react';
import parse from 'html-react-parser';
import { convertToHTML } from 'draft-convert';
import { convertFromHTML, EditorState } from 'draft-js';
import dynamic from 'next/dynamic';
import { ContentState, convertToRaw } from 'draft-js';
import { EditorProps } from 'react-draft-wysiwyg';
import facebookPixel from '../../../public/image/facebook-pixel.png';
import googleAnalytic from '../../../public/image/google-analytic.png';
// install @types/draft-js @types/react-draft-wysiwyg and @types/draft-js @types/react-draft-wysiwyg for types
import { RxCross1 } from 'react-icons/rx';
import { AiFillDelete } from 'react-icons/ai';

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Image from 'next/image';
import Modal from '../ui/modal/modal';
import Router from 'next/router';

type FormValues = {
  name: any;
  theme_color: any;
  location_id: any;
  whatsapp_no: any;
  about_us: any;
  term_condition: any;
  privacy_policy: any;
  color: any;
  banner_images: any;
  storefront_banner: any;
  logo_url: any;
  fav_icon: any;
  meta_title: any;
  meta_description: any;
};

const socialIcon = [
  {
    value: 'FacebookIcon',
    label: 'Facebook',
  },
  {
    value: 'InstagramIcon',
    label: 'Instagram',
  },
  {
    value: 'TwitterIcon',
    label: 'Twitter',
  },
  {
    value: 'YouTubeIcon',
    label: 'Youtube',
  },
];

export const updatedIcons = socialIcon.map((item: any) => {
  item.label = (
    <div className="flex items-center text-body space-s-4">
      <span className="flex h-4 w-4 items-center justify-center">
        {getIcon({
          iconList: socialIcons,
          iconName: item.value,
          className: 'w-4 h-4',
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

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
export default function BusinessSettingsForm(initialValues: any) {
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

  const [status, setStatus] = useState<any>(initialValues.data.is_open);
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [LocationDataArray, setLocationDataArray] = React.useState<any[]>([]);
  const [LocationVal, setLocation] = useState<any>();
  const [termCondition, setTermCondition] = useState('');
  const [aboutUs, setAboutUs] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [imageFile, setImageFile] = useState<any>([]);
  const [path, setPath] = useState<any>([]);
  const [imgArr, setImageArr] = useState<any>(getValues('banner_images'));
  const [loadingData, setloadingData] = useState(false);
  const [addDomainModal, setAddDomainModal] = useState(false);
  const [domainName, setDomainName] = useState('');
  const [packageDetail, setPackageDetail] = useState<any>({});
  const [customScript, setCustomScript] = useState<any>();
  const [sliderImagesObject, setSliderImagesObject] = useState<any>(
    getValues('storefront_banner')
  );
  const [deleteImgId, setDeleteImgId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleImgLoader, setDeleImgLoader] = useState(false);
  // const [customScriptState, setCustomScriptState] = useState(() =>
  //   EditorState.createEmpty()
  // );
  const onChangeStatus = (e: any) => {
    setStatus((value: any) => !value);
  };
  const [privecyEditorState, setprivecyEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [refundEditorState, setRefundEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [privecyConvertedContent, setPrivecyConvertedContent] = useState<any>(
    null
  );
  const [refundConvertedContent, setRefundConvertedContent] = useState<any>(
    null
  );

  useEffect(() => {
    let html = convertToHTML(privecyEditorState.getCurrentContent());
    setPrivecyConvertedContent(html);
  }, [privecyEditorState]);

  useEffect(() => {
    if (sliderImagesObject) {
      var newPath: any = [];
      for (const [key, value] of Object?.entries(sliderImagesObject)) {
        newPath = [...newPath, value];
      }
      setPath(newPath);
    }
  }, [sliderImagesObject]);

  useEffect(() => {
    let vall: any =
      initialValues.data.privacy_policy == undefined
        ? ''
        : initialValues.data.privacy_policy;
    const blocksFromHTML = convertFromHTML(vall);
    setprivecyEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        )
      )
    );
    setCustomScript(initialValues?.data?.custom_script);
  }, []);

  const [termEditorState, settermEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [termConvertedContent, setTermConvertedContent] = useState<any>(null);

  useEffect(() => {
    let html = convertToHTML(termEditorState.getCurrentContent());
    setTermConvertedContent(html);
  }, [termEditorState]);

  useEffect(() => {
    let html = convertToHTML(refundEditorState.getCurrentContent());
    setRefundConvertedContent(html);
  }, [refundEditorState]);

  useEffect(() => {
    let vall: any =
      initialValues.data.term_condition == undefined
        ? ''
        : initialValues.data.term_condition;
    const blocksFromHTML = convertFromHTML(vall);
    settermEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        )
      )
    );
  }, []);

  useEffect(() => {
    let vall: any =
      initialValues.data.return_and_refund_policy == undefined
        ? ''
        : initialValues.data.return_and_refund_policy;
    const blocksFromHTML = convertFromHTML(vall);
    setRefundEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        )
      )
    );
  }, []);

  const [aboutEditorState, setaboutEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [aboutConvertedContent, setAboutConvertedContent] = useState<any>(null);

  useEffect(() => {
    let html = convertToHTML(aboutEditorState.getCurrentContent());
    setAboutConvertedContent(html);
  }, [aboutEditorState]);

  useEffect(() => {
    let vall: any =
      initialValues.data.about_us == undefined
        ? ''
        : initialValues.data.about_us;
    const blocksFromHTML = convertFromHTML(vall);
    setaboutEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        )
      )
    );
    let dataArray = initialValues?.data?.locations?.map((res) => {
      setLocation(res.id);
    });
    initialValues?.data?.dns && setDomainName(initialValues?.data?.dns);
  }, []);

  const [imageFile2, setImageFile2] = useState<any>();
  const [path2, setPath2] = useState<string>(getValues('logo_url'));

  const [imageFile3, setImageFile3] = useState<any>();
  const [path3, setPath3] = useState<string>(getValues('fav_icon'));
  let form = new FormData();

  useEffect(() => {
    if (imageFile2) {
      setPath2(URL.createObjectURL(imageFile2));
    }
  }, [imageFile2]);

  useEffect(() => {
    if (imageFile3) {
      setPath3(URL.createObjectURL(imageFile3));
    }
  }, [imageFile3]);

  useEffect(() => {
    setImageFile('');
    if (imageFile) {
      imageFile.map((res) => {
        if (imgArr != undefined) {
          setImageArr((current) => [...current, res]);
        } else {
          setImageArr([res]);
        }

        if (path != undefined) {
          setPath((current) => [...current, URL.createObjectURL(res)]);
        } else {
          setPath([URL.createObjectURL(res)]);
        }
      });
    }
  }, [imageFile]);

  React.useEffect(() => {
    setloadingData(true);
    const businessDetail = JSON.parse(
      localStorage.getItem('user_business_details')!
    );
    if (businessDetail) {
      setPackageDetail(businessDetail?.subscriptions[0]?.package_details);
    }
    GetFunction('/business-location').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          name: data.name,
        };
      });
      setLocationDataArray(ordersData);
      setloadingData(false);
    });
  }, []);

  const onSubmit = (values: FormValues) => {
    let ID = initialValues.data.id;
    form.append('id', ID);
    form.append('name', values.name);
    form.append('location_id', LocationVal);
    form.append('theme_col', values.color);
    form.append('whatsapp_no', values.whatsapp_no);
    form.append('domain', values.name);
    form.append('privacy_policy', privecyConvertedContent);
    form.append('return_and_refund_policy', refundConvertedContent);
    form.append('term_condition', termConvertedContent);
    form.append('about_us', aboutConvertedContent);
    form.append('store_logo', imageFile2);
    form.append('fav_icon', imageFile3);
    form.append('meta_title', values.meta_title);
    form.append('meta_description', values.meta_description);
    form.append('custom_script', customScript);
    form.append('is_open', status);
    form.append('dns', domainName);

    imgArr?.map((res, index) => {
      form.append(`banner_images${index}`, res);
    });

    setCreatingLoading(true);
    UpdatingStoreSetting('/storefront', form).then((result) => {
      if (result.success) {
        toast.success(t('common:successfully-created'));
        setCreatingLoading(false);
        setTimeout(() => {
          // window.location.reload();
        }, 1000);
      } else {
        toast.error(t(result.message));
        setCreatingLoading(false);
      }
    });
  };
  const logoInformation = (
    <span>
      {t('common:logo-help-text')} <br />
      {t('form:logo-dimension-help-text')} &nbsp;
      <span className="font-bold">
        {siteSettings.logo.width}x{siteSettings.logo.height} {t('common:pixel')}
      </span>
    </span>
  );

  const locationDefaultArray = initialValues.data?.locations;
  const locationOnChange = (e) => {
    setLocation(e.id);
  };
  let HREF = 'https://' + initialValues?.data?.domain + '.myignite.site';

  const onAddBtnClick = (e) => {
    e.preventDefault();
    if (packageDetail.name == 'Free package') {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else {
      setAddDomainModal(true);
    }
  };
  const onAddCLick = (e) => {
    e.preventDefault();
    setAddDomainModal(false);
  };

  const onChnageDomain = (e) => {
    setDomainName(e.target.value);
  };

  const onRemoveImage = (id) => {
    // console.log(initialValues?.product_images_index);
    // console.log(id, 'idid');

    setDeleteModal(true);
    setDeleteImgId(id);
  };

  const onRemoveImageAddCase = (link, index) => {
    // Create a copy of the current imagePath state
    const updatedImagePath = [...path];
    const linkExists = Object.values(sliderImagesObject).includes(link);
    if (linkExists) {
      for (const [key, value] of Object.entries(sliderImagesObject)) {
        if (value === link) {
          onRemoveImage(key);
          // const updatedPath = path.filter((link) => {

          //   return value !== link;
          // });

          // setPath(updatedPath);
          break; // Stop iterating once the link is found
        }
      }
    } else {
      // console.log(updatedImagePath)
      updatedImagePath.splice(index, 1);
      setPath(updatedImagePath);
    }
  };
  const onConfirmDelete = () => {
    setDeleImgLoader(true);
    DashboardGetFun('/delete-storefront-banner?id=' + deleteImgId).then(
      (result) => {
        // console.log(result,'delete api result');

        if (result.success) {
          const updatedImages = { ...sliderImagesObject };

          delete updatedImages[deleteImgId];
          setSliderImagesObject(updatedImages);

          toast.success(result.message);
          setDeleImgLoader(false);
          setDeleteModal(false);
        } else {
          toast.error(result.message);
          setDeleImgLoader(false);
        }
      }
    );
  };
  // console.log(path,'path paht')
  // console.log(sliderImagesObject,'slidt')
  // @ts-ignore
  // @ts-ignore
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('common:sell-on-website')}
            details={t('common:sell-website-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="flex justify-between">
              <Label>{t('common:online-store')}</Label>
              <div className="mb-5">
                <Switch
                  checked={status}
                  className={`${
                    status ? 'bg-accent' : 'bg-gray-300'
                  } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                  dir="ltr"
                  name=""
                  onChange={onChangeStatus}
                >
                  <span className="sr-only">Enable </span>
                  <span
                    className={`${
                      status ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                  />
                </Switch>
              </div>
            </div>
            <span style={{ color: '#4B5563' }}>
              {t('common:online-store-description')}
            </span>
            <br />
            <br />
            <div className="flex lg:flex-row xl:flex-row flex-col  justify-between">
              <div>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={HREF}
                  className="pt-3"
                >
                  {' '}
                  https://{initialValues?.data?.domain}.myignite.site
                </a>
              </div>

              <div className="flex justify-end custom:my-4">
                <Button onClick={onAddBtnClick}>
                  {t('form:button-map-domain')}
                </Button>
              </div>
            </div>
            {initialValues?.data?.dns && (
              <div className="flex flex-row">
                <span className="block text-body-dark font-semibold text-sm leading-none flex items-center">
                  Domain:
                </span>
                <span>{initialValues?.data?.dns}</span>
              </div>
            )}
          </Card>
        </div>
        <Modal open={addDomainModal} onClose={() => setAddDomainModal(false)}>
          <Card className="mt-4" style={{ width: 600 }}>
            <div className="w-full">
              <Label className="flex justify-start">
                {t('form:button-add-domain')}
              </Label>
              <Input
                value={domainName}
                onChange={onChnageDomain}
                className="w-full "
                name=""
                placeholder="example.com"
              />
            </div>
            <div className="pt-5 flex justify-end">
              <Button onClick={onAddCLick}>Add</Button>
            </div>
          </Card>
        </Modal>
        <Description
          title={t('form:input-label-logo')}
          details={t('form:logo-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className=" w-full sm:w-8/12 md:w-2/3">
          <FileInput
            name="promotional_sliders"
            control={control}
            setImageFile={setImageFile2}
            multiple={false}
          />
          {path2 && (
            <img
              style={{ width: '50px', height: '50px', marginTop: '1rem' }}
              src={path2}
              alt="cate-image"
            />
          )}
        </Card>
        <Description
          title={t('common:favicon')}
          details={t('form:logo-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="mt-8 w-full sm:w-8/12 md:w-2/3">
          <FileInput
            name="fav_icon"
            control={control}
            setImageFile={setImageFile3}
            multiple={false}
          />
          {path3 && (
            <img
              style={{ width: '50px', height: '50px', marginTop: '1rem' }}
              src={path3}
              alt="cate-image"
            />
          )}
        </Card>
        <Description
          title={t('form:slide-management')}
          details={t('form:slide-management-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="mt-8 w-full sm:w-8/12 md:w-2/3">
          <FileInput
            name="product_images"
            setImageFile={setImageFile}
            control={control}
            multiple={true}
          />
          <div className="flex flex-wrap">
            {path &&
              path.map((res, index) => (
                <div className="flex mt-6 image-container" key={index}>
                  <img
                    key={index}
                    style={{
                      paddingTop: 5,
                      marginLeft: 10,
                      width: '50px',
                      height: '50px',
                    }}
                    src={res}
                    // onDragStart={(event) => handleImageDrag(event, index)}
                    alt="cate-image"
                  />
                  <div className="bg-slate-200 rounded-full h-5 p-1">
                    <RxCross1
                      onClick={() => onRemoveImageAddCase(res, index)}
                      className=" w-3 h-3 justify-end flex  cursor-pointer"
                    />
                  </div>
                </div>
              ))}
          </div>
          {/* <div className="flex">
            {path &&
              path.map((res, index) => (
                <img
                  key={index}
                  style={{
                    padding: 10,
                    width: '50px',
                    height: '50px',
                    marginTop: '1rem',
                  }}
                  src={res}
                  alt="cate-image"
                />
              ))}
          </div> */}
          <Modal
            open={deleteModal}
            onClose={() => setDeleteModal(true)}
            style={{ width: '45%' }}
          >
            <Card className="" style={{ width: 400 }}>
              <div className="flex">
                <AiFillDelete
                  color="red"
                  width={10}
                  height={10}
                  className="h-8 w-8"
                />
                <Label className="text-lg pt-2">
                  Are you sure you want to delete
                </Label>
              </div>

              <div className="flex justify-end mt-10">
                <Button onClick={() => setDeleteModal(false)}>Cancel</Button>
                <Button
                  loading={deleImgLoader}
                  className="ml-5"
                  onClick={onConfirmDelete}
                >
                  Yes
                </Button>
              </div>
            </Card>
          </Modal>
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-domain-name')}
          details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-domain-name')}
            {...register('name')}
            variant="outline"
            className="mb-5"
          />
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-store-setting')}
          details={t('form:shop-settings-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Label>{t('form:theme-color')}</Label>
          <ColorPicker
            label={t('form:input-label-color')}
            {...register('color')}
            className="mt-5 mb-5"
            defaultValue={initialValues?.data?.theme_color}
          >
            <DisplayColorCode
              defVal={initialValues?.data?.theme_color}
              control={control}
            />
          </ColorPicker>
          <div className="mb-3">
            <Label>{t('form:input-label-location')}</Label>
            <Select
              getOptionLabel={(option: any) => option.name}
              styles={selectStyles}
              options={LocationDataArray}
              onChange={locationOnChange}
              defaultValue={initialValues.data?.locations}
            />
          </div>
          <Input
            label={t('form:input-label-meta-tital')}
            {...register('meta_title')}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-meta-des')}
            {...register('meta_description')}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-whatsapp-no')}
            {...register('whatsapp_no')}
            variant="outline"
            className="mb-5"
          />
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-custom-script')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card
          className="w-full sm:w-8/12 md:w-2/3"
          // style={{
          //     minHeight: "14rem"
          // }}
        >
          <TextArea
            label={t('form:input-label-custom-script')}
            // {...register('name')}
            name={'customScript'}
            variant="outline"
            className=" min-h-full"
            value={customScript}
            onChange={(e) => {
              setCustomScript(e.target.value);
            }}
          />
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-about-us')}
          details={t('form:shop-settings-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card
          className="w-full sm:w-8/12 md:w-2/3  "
          style={{
            minHeight: '18rem',
          }}
        >
          <Editor
            editorState={aboutEditorState}
            onEditorStateChange={setaboutEditorState}
            editorClassName="p-3"
            toolbarClassName="bg-gray-200 "
            wrapperClassName="border border-border-base focus:border-accent rounded min-h-full "
            toolbar={{
              options: [
                'inline',
                'blockType',
                'fontSize',
                'fontFamily',
                'list',
                'textAlign',
                'colorPicker',
                'link',
                'emoji',
              ],
              inline: { inDropdown: false },
              list: { inDropdown: false },
              textAlign: { inDropdown: false },
              link: { inDropdown: false },
              history: { inDropdown: false },
            }}
          />
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-term-condition')}
          details={t('form:shop-settings-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card
          className="w-full sm:w-8/12 md:w-2/3"
          style={{
            minHeight: '18rem',
          }}
        >
          {/* <TextArea
            label={t('form:input-label-term-condition')}
            name="term_condition"
            value={termCondition}
            onChange={(e) => {
              setTermCondition(e.target.value);
            }}
            variant="outline"
            className="mb-5"
          /> */}
          <Editor
            editorState={termEditorState}
            onEditorStateChange={settermEditorState}
            editorClassName="p-3"
            toolbarClassName="bg-gray-200"
            wrapperClassName="border border-border-base focus:border-accent rounded min-h-full"
            toolbar={{
              options: [
                'inline',
                'blockType',
                'fontSize',
                'fontFamily',
                'list',
                'textAlign',
                'colorPicker',
                'link',
                'emoji',
              ],
              inline: { inDropdown: false },
              list: { inDropdown: false },
              textAlign: { inDropdown: false },
              link: { inDropdown: false },
              history: { inDropdown: false },
            }}
          />
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-privacy-policy')}
          details={t('form:shop-settings-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card
          className="w-full sm:w-8/12 md:w-2/3"
          style={{
            minHeight: '18rem',
          }}
        >
          <Editor
            editorState={privecyEditorState}
            onEditorStateChange={setprivecyEditorState}
            editorClassName="p-3"
            toolbarClassName="bg-gray-200"
            wrapperClassName="border border-border-base focus:border-accent rounded min-h-full"
            toolbar={{
              options: [
                'inline',
                'blockType',
                'fontSize',
                'fontFamily',
                'list',
                'textAlign',
                'colorPicker',
                'link',
                'emoji',
              ],
              inline: { inDropdown: false },
              list: { inDropdown: false },
              textAlign: { inDropdown: false },
              link: { inDropdown: false },
              history: { inDropdown: false },
            }}
          />
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
        title={t('form:input-label-refund')}
          details={t('form:shop-settings-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card
          className="w-full sm:w-8/12 md:w-2/3"
          style={{
            minHeight: '18rem',
          }}
        >
          <Editor
            editorState={refundEditorState}
            onEditorStateChange={setRefundEditorState}
            editorClassName="p-3"
            toolbarClassName="bg-gray-200"
            wrapperClassName="border border-border-base focus:border-accent rounded min-h-full"
            toolbar={{
              options: [
                'inline',
                'blockType',
                'fontSize',
                'fontFamily',
                'list',
                'textAlign',
                'colorPicker',
                'link',
                'emoji',
              ],
              inline: { inDropdown: false },
              list: { inDropdown: false },
              textAlign: { inDropdown: false },
              link: { inDropdown: false },
              history: { inDropdown: false },
            }}
          />
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button type="submit" loading={creatingLoading}>
          {t('form:button-label-save-settings')}
        </Button>
      </div>
    </form>
  );
}
