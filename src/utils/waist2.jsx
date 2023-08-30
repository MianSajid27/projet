import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { AttachmentInput, Type, TypeSettingsInput } from '@/types';
import { useTranslation } from 'next-i18next';
import Label from '@/components/ui/label';
import { yupResolver } from '@hookform/resolvers/yup';
// import { typeValidationSchema } from './brand-validation-schema';
import FileInput from '@/components/ui/file-input';
import Router from 'next/router';
import { Routes } from '@/config/routes';
import { Config } from '@/config';
import TextArea from '@/components/ui/text-area';
import { toast } from 'react-toastify';
import { AddingFunction, AddingUserFunction, DashboardGetFun, UpdateCustomFunction } from '../../services/Service';
import { useEffect, useState } from 'react';
import FormData from 'form-data';
import { RxCross1 } from 'react-icons/rx';
import Select from 'react-select';
import { selectStyles } from '../ui/select/select.styles';
import SelectInput from '../ui/select-input';
import { unitDrop } from './custom-icon';
import { dataDrop } from './custom-icon';
import { Switch } from '@headlessui/react';
type BannerInput = {
  title: string;
  description: string;
  image: AttachmentInput;
};

type FormValues = {
  module?: any;
title?: string | null;
  data_type?: any;
  is_mandatory: string | null;
  values?: string | null;
  validation_expression?: string | null;
  isData: any;
  isModule:any;
 
};
const defaultValues = {
 
 
   title: '',
  data_type: '',
  is_mandatory: '',
  values: '',
 validation_expression: '',
 
};
type IProps = {
  initialValues?: Type | null;
};

export default function CreateOrUpdateTypeForm(initialValues: any) {
  const [creatingLoading, setCreatingLoading] = useState(false);
  
  var form = new FormData();
  const router = useRouter();
  const { t } = useTranslation();
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
  // const onSubmit = (values: FormValues) => {
  //   let form = {
  //     module: values.module,
  //     title: values.title,
  //     data_type: values.data_type,
  //   };
  // }
  const [imageFile, setImageFile] = useState<any>();
  const [path, setPath] = useState<string>();
  const [value, setValue] = useState<any>(false);
  const [status, setStatus] = useState<any>(false);
  const[brandId,setBrandId]=useState<any>(null)
  const[isImage,setIsImage]=useState(false)
  const [tittle, setittle] = useState(false)
  const { query } = useRouter();

console.log(query,"sdfghjkl")
//   useEffect(() => {
//     if (initialValues?.initialValues) {
// setBrandId(initialValues?.initialValues.id)
//        setPath(getValues('image'))
//        if(getValues('image')){
//         setIsImage(true)
//        }
//     }

//   }, [initialValues])
// console.log(getValues('image'),'djflafjalsdfja');

//   useEffect(() => {
//     if (imageFile) {
//       setPath(URL.createObjectURL(imageFile));
//     }
//   }, [imageFile]);


  const onSubmit = (values: FormValues) => {
    let form = {
          module: values.module?.value,
             title: values.title,
          data_type: values.isData?.value,
          // data_type: values.isData?.value,
          values: values.values,
          validation_expression: values.validation_expression,
          is_mandatory:status ? 1 : 0,
          ref_id:query.customId
          
        };
   console.log(form);

    /*  let formVal = {
      name: values.name,
      description: values.description,
    }; */
    if (initialValues.initialValues) {
      let ID = initialValues.initialValues.id;
      setCreatingLoading(true);
      UpdateCustomFunction('/custom-field/update/', form, ID).then((result) => {
        // if (result.success) {
          toast.success(t('common:successfully-updated'));
          setCreatingLoading(true);

          router.back();
        // } else {
        //   toast.error(t('The module field is required'));
        //   setCreatingLoading(false);
        // }
        console.log(form)
      });
    } else {
      setCreatingLoading(true);

      AddingUserFunction('/custom-field',form).then((result) => {
        if (result.success) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          router.back();
        } else {
          toast.error(t(result.msg));
          setCreatingLoading(false);
        }
      });
    }
  };
  const onRemoveImageAddCase = () => {
  
if(initialValues?.initialValues && isImage){
  DashboardGetFun('/brand-image-delete/' + brandId).then((result) => {
    if (result.success==true) {
      setPath('')
      setImageFile('')
      toast.success(result.msg);
      setIsImage(false)
    } else {
      toast.error(result.msg);
    }
  });
}else{
  setPath('')
  setImageFile('')
}
  
  };
  const onChangeStatus = (e: any) => {
    setStatus((status: any) => !status);
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:item-description')}
          // details={t('Add New Brand Description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
        {/* <Label>{t('form:input-label-module')}</Label>
                <Select
               
                  styles={selectStyles}
                  name="brand_id"
                  /> */}
          {/* <Input
            label={t('form:input-label-module')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          /> */}
           <Label>{t('form:input-label-module')}</Label>
           
            <SelectInput
    
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.value}
              name="module"
              control={control}
              options={unitDrop}
              isClearable={true}
            />
            <br/>
             {/* <Label>{t('form:input-label-module')}</Label>

<Select
  getOptionLabel={(option: any) => option.label}
  getOptionValue={(option: any) => option.value}
  defaultValue={UnitDataArrayDefault}
  options={unitDrop}           /> */}
          <Input
            label={t('form:input-alter-title')}
            {...register('title')}
            // error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />
             {/* <Input
            label={t('form:input-alter-title')}
            {...register('query')}
            // error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          /> */}
            {/* <Input
            label={t('form:input-alter-data')}
            {...register('arabic_name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          /> */}
           <Label>{t('form:input-alter-data')}</Label>
            <SelectInput
            
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.value}
              name="isData"
              control={control}
              options={dataDrop}
              isClearable={true}
            />
            <br/>
             <Input
            label={t('form:input-alter-value')}
            {...register('values')}
            // error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />
           <Input
            label={t('form:input-alter-validation')}
            {...register('validation_expression')}
            // error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />

          
           {/* <Input
            label={t('form:input-alter-mantory')}
            {...register('arabic_name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          /> */}
          <Label>{t('form:input-alter-mantory')}?</Label>
          <Switch
            
            name="status"
            checked={status}
            onChange={onChangeStatus}
            value={status ? 'active' : 'inactive'}
            className={`${
              status ? 'bg-accent' : 'bg-gray-300'
            } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
            dir="ltr"
          >
            <span className="sr-only">Enable </span>
            <span
              className={`${
                status ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
            />
          </Switch>

            {/* <Input
            label={t('form:input-alter-ref')}
            {...register('arabic_name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          /> */}
         
                  {/* // options={BrandDataArray}
                  // defaultValue={brandDefaultArray}
                  // onChange={brandOnChange} */}
               
          {/* <TextArea
            label={t('form:input-description')}
            {...register('description')}
            error={t(errors.description?.message!)}
            variant="outline"
            className="mb-5"
          /> */}
        </Card>
      </div>

      {/* <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:custom-image')}
          // details={t('Upload Brand Image')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput
            name="promotional_sliders"
            control={control}
            setImageFile={setImageFile}
            multiple={false}

          />
          {path &&
          <div className='flex flex-row mt-1'>
          <span className='w-fit'>
          <img
            style={{ width: '50px', height: '50px', marginTop: '1rem' }}
            src={path}
            alt="cate-image"
            className="object-contain"
          />
          </span>
          
          <div className="bg-slate-200 rounded-full h-5 p-1">
                      <RxCross1
                        onClick={onRemoveImageAddCase}
                        className="w-3 h-3 justify-end flex cursor-pointer"
                      />
                    </div>
          </div>
        
          }
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
          {initialValues.initialValues ? t('common:edit-brand') : t('common:add-custom')}
        </Button>
      </div>

      {/* href={"/catalog/customFeild/query{}/create"} */}
    </form>



  );
}
// import Input from '@/components/ui/input';
// import { useForm } from 'react-hook-form';
// import Button from '@/components/ui/button';
// import Description from '@/components/ui/description';
// import Card from '@/components/common/card';
// import { useRouter } from 'next/router';
// import { AttachmentInput, Type, TypeSettingsInput } from '@/types';
// import { useTranslation } from 'next-i18next';
// import Label from '@/components/ui/label';
// import { yupResolver } from '@hookform/resolvers/yup';
// // import { typeValidationSchema } from './brand-validation-schema';
// import FileInput from '@/components/ui/file-input';
// import Router from 'next/router';
// import { Routes } from '@/config/routes';
// import { Config } from '@/config';
// import TextArea from '@/components/ui/text-area';
// import { toast } from 'react-toastify';
// import {
//   AddingFunction,
//   AddingUserFunction,
//   DashboardGetFun,
//   UpdateCustomFunction
// } from '../../services/Service';
// import { useEffect, useState } from 'react';
// import FormData from 'form-data';
// import { RxCross1 } from 'react-icons/rx';
// import Select from 'react-select';
// import { selectStyles } from '../ui/select/select.styles';
// import SelectInput from '../ui/select-input';
// import { unitDrop } from './custom-icon';
// import { dataDrop } from './custom-icon';
// import { Switch } from '@headlessui/react';
// type BannerInput = {
//   title: string;
//   description: string;
//   image: AttachmentInput;
// };

// type FormValues = {
//   title?: string | null;
// // module?:any;
//   is_mandatory: string | null;
//   values?: string | null;
//   validation_expression?: string | null;

// };
// const defaultValues = {
//   title: '',
//   // module:'',
//   is_mandatory: '',
//   values: '',
//   validation_expression: '',
// };
// type IProps = {
//   initialValues?: Type | null;
// };

// export default function CustomFeildFrom(initialValues: any) {
//   const [creatingLoading, setCreatingLoading] = useState(false);
//   console.log(initialValues, 'sajid');
//   var form = new FormData();
//   const router = useRouter();
//   const { t } = useTranslation();
//   const {
//     register,
//     control,
//     handleSubmit,
//     watch,
//     getValues,
//     formState: { errors },
//   } = useForm<FormValues>({
//     //@ts-ignore
//     defaultValues: initialValues.initialValues
//       ? {
//           ...initialValues.initialValues,
//         }
//       : defaultValues,
//   });
//   // const onSubmit = (values: FormValues) => {
//   //   let form = {
//   //     module: values.module,
//   //     title: values.title,
//   //     data_type: values.data_type,
//   //   };
//   // }

//   const [imageFile, setImageFile] = useState<any>();
//   const [path, setPath] = useState<string>();
//   const [value, setValue] = useState<any>(false);
//   const [status, setStatus] = useState<any>(false);
//   const [brandId, setBrandId] = useState<any>(null);
//   const [isImage, setIsImage] = useState(false);
//   const [tittle, setittle] = useState(false);
//   const { query } = useRouter();

//   console.log(query, 'sdfghjkl');
//   //   useEffect(() => {
//   //     if (initialValues?.initialValues) {
//   // setBrandId(initialValues?.initialValues.id)
//   //        setPath(getValues('image'))
//   //        if(getValues('image')){
//   //         setIsImage(true)
//   //        }
//   //     }

//   //   }, [initialValues])
//   // console.log(getValues('image'),'djflafjalsdfja');

//   //   useEffect(() => {
//   //     if (imageFile) {
//   //       setPath(URL.createObjectURL(imageFile));
//   //     }
//   //   }, [imageFile]);

 
//   const UnitDataArrayDefault = [
//     {
//       label: initialValues.initialValues.module,
//     },
//   ];
//   const CustomDataArrayDefault = [
//     {
//       label: initialValues.initialValues.data_type,
//     },
//   ];
//   const onSubmit = (values: FormValues) => {
//     let form = {
//       // module:values.module,
//       title: values.title,
      
//       // data_type: values.isData?.value,
//       values: values.values,
//       validation_expression: values.validation_expression,
//       is_mandatory: values.is_mandatory ? 1 : 0,
//       ref_id: query.customId,
//     };
//     console.log(form);

//     /*  let formVal = {
//       name: values.name,
//       description: values.description,
//     }; */
//     if (initialValues.initialValues) {
//       let ID = initialValues.initialValues.id;
//       setCreatingLoading(true);
//       UpdateCustomFunction('/custom-field/update/', form, ID).then((result) => {
//         if (result.success) {
//           toast.success(t('common:successfully-updated'));
//           setCreatingLoading(false);

//           router.back();
//         } else {
//           toast.error(t(result.msg));
//           setCreatingLoading(false);
//         }
//       });
//     } else {
//       setCreatingLoading(true);

//       AddingUserFunction('/custom-field', form).then((result) => {
//         if (result.success) {
//           toast.success(t('common:successfully-created'));
//           setCreatingLoading(false);
//           router.back();
//         } else {
//           toast.error(t(result.msg));
//           setCreatingLoading(false);
//         }
//       });
//     }
//   };
//   const onRemoveImageAddCase = () => {
//     if (initialValues?.initialValues && isImage) {
//       DashboardGetFun('/brand-image-delete/' + brandId).then((result) => {
//         if (result.success == true) {
//           setPath('');
//           setImageFile('');
//           toast.success(result.msg);
//           setIsImage(false);
//         } else {
//           toast.error(result.msg);
//         }
//       });
//     } else {
//       setPath('');
//       setImageFile('');
//     }
//   };
//   const onChangeStatus = (e: any) => {
//     setStatus((status: any) => !status);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div className="my-5 flex flex-wrap sm:my-8">
//         <Description
//           title={t('form:item-description')}
//           // details={t('Add New Brand Description')}
//           className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
//         />

//         <Card className="w-full sm:w-8/12 md:w-2/3">
//           {/* <Label>{t('form:input-label-module')}</Label>
//                 <Select
               
//                   styles={selectStyles}
//                   name="brand_id"
//                   /> */}
//           {/* <Input
//             label={t('form:input-label-module')}
//             {...register('name')}
//             error={t(errors.name?.message!)}
//             variant="outline"
//             className="mb-5"
//           /> */}
//           <Label>{t('form:input-label-module')}</Label>

//           <Select
//             getOptionLabel={(option: any) => option.label}
//             getOptionValue={(option: any) => option.value}
//             defaultValue={UnitDataArrayDefault}
//             options={unitDrop}           />
//           <br />
//           <Input
//             label={t('form:input-alter-title')}
//             {...register('title')}
//             error={t(errors.title?.message!)}
//             variant="outline"
//             className="mb-5"
//           />
//           {/* <Input
//             label={t('form:input-alter-title')}
//             {...register('query')}
//             // error={t(errors.name?.message!)}
//             variant="outline"
//             className="mb-5"
//           /> */}
//           {/* <Input
//             label={t('form:input-alter-data')}
//             {...register('arabic_name')}
//             error={t(errors.name?.message!)}
//             variant="outline"
//             className="mb-5"
//           /> */}
//           <Label>{t('form:input-alter-data')}</Label>
//           <Select
//             getOptionLabel={(option: any) => option.label}
//             getOptionValue={(option: any) => option.value}
//             defaultValue={CustomDataArrayDefault}
//             options={dataDrop}           />
//           <br />
//           <Input
//             label={t('form:input-alter-value')}
//             {...register('values')}
//             error={t(errors.values?.message!)}
//             variant="outline"
//             className="mb-5"
//           />
//           <Input
//             label={t('form:input-alter-validation')}
//             {...register('validation_expression')}
//             error={t(errors.validation_expression?.message!)}
//             variant="outline"
//             className="mb-5"
//           />

//           {/* <Input
//             label={t('form:input-alter-mantory')}
//             {...register('arabic_name')}
//             error={t(errors.name?.message!)}
//             variant="outline"
//             className="mb-5"
//           /> */}
//           <Label>{t('form:input-alter-mantory')}</Label>
//           <Switch
//             name="is_mandatory"
//             checked={status}
//             onChange={onChangeStatus}
//             value={status ? 'active' : 'inactive'}
//             className={`${
//               status ? 'bg-accent' : 'bg-gray-300'
//             } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
//             dir="ltr"
//           >
//             <span className="sr-only">Enable </span>
//             <span
//               className={`${
//                 status ? 'translate-x-6' : 'translate-x-1'
//               } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
//             />
//           </Switch>

//           {/* <Input
//             label={t('form:input-alter-ref')}
//             {...register('arabic_name')}
//             error={t(errors.name?.message!)}
//             variant="outline"
//             className="mb-5"
//           /> */}

//           {/* // options={BrandDataArray}
//                   // defaultValue={brandDefaultArray}
//                   // onChange={brandOnChange} */}

//           {/* <TextArea
//             label={t('form:input-description')}
//             {...register('description')}
//             error={t(errors.description?.message!)}
//             variant="outline"
//             className="mb-5"
//           /> */}
//         </Card>
//       </div>

//       {/* <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
//         <Description
//           title={t('form:custom-image')}
//           // details={t('Upload Brand Image')}
//           className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
//         />
//         <Card className="w-full sm:w-8/12 md:w-2/3">
//           <FileInput
//             name="promotional_sliders"
//             control={control}
//             setImageFile={setImageFile}
//             multiple={false}

//           />
//           {path &&
//           <div className='flex flex-row mt-1'>
//           <span className='w-fit'>
//           <img
//             style={{ width: '50px', height: '50px', marginTop: '1rem' }}
//             src={path}
//             alt="cate-image"
//             className="object-contain"
//           />
//           </span>
          
//           <div className="bg-slate-200 rounded-full h-5 p-1">
//                       <RxCross1
//                         onClick={onRemoveImageAddCase}
//                         className="w-3 h-3 justify-end flex cursor-pointer"
//                       />
//                     </div>
//           </div>
        
//           }
//         </Card>
//       </div> */}

//       <div className="mb-4 text-end">
//         {initialValues.initialValues && (
//           <Button
//             variant="outline"
//             onClick={router.back}
//             className="me-4"
//             type="button"
//           >
//             {t('form:button-label-back')}
//           </Button>
//         )}

//         <Button loading={creatingLoading}>
//           {initialValues.initialValues
//             ? t('common:edit-custom')
//             : t('common:add-custom')}
//         </Button>
//       </div>

//       {/* href={"/catalog/customFeild/query{}/create"} */}
//     </form>
//   );
// }
