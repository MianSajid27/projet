import Input from '@/components/ui/input';
import TextArea from '@/components/ui/text-area';
import { useForm, FormProvider } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import Radio from '@/components/ui/radio/radio';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from '@/components/ui/file-input';
import { productValidationSchema } from '@/components/product/product-validation-schema';
import ProductVariableForm from '@/components/products/product-variable-form';
import ProductSimpleForm from '@/components/product/product-simple-form';
import ProductGroupInput from '@/components/product/product-group-input';
import ProductCategoryInput from '@/components/product/product-category-input';
import ProductTypeInput from '@/components/product/product-type-input';
import { ProductType, Product } from '@/types';
import { useTranslation } from 'next-i18next';
import { useShopQuery } from '@/data/shop';
import ProductTagInput from '@/components/product/product-tag-input';
import { Config } from '@/config';
import Alert from '@/components/ui/alert';
import { useState } from 'react';
import ProductAuthorInput from '@/components/product/product-author-input';
import ProductManufacturerInput from '@/components/product/product-manufacturer-input';
import { EditIcon } from '@/components/icons/edit';
import SelectInput from '@/components/ui/select-input';
import Modal from '@/components/ui/modal/modal';

import {
  getProductDefaultValues,
  getProductInputValues,
  ProductFormValues,
} from './form-utils';
import { getErrorMessage } from '@/utils/form-error';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/data/product';
import { split, join } from 'lodash';
import Select from 'react-select';
import { selectStyles } from '../ui/select/select.styles';
import React from 'react';
import {
  AddingFunction,
  GetFunction,
  GetMarketPlace,
  UpdatingProduct,
  AddingTaxFunction,
  GetFunctionBDetail,
  DashboardGetFun,
} from '../../services/Service';
import { SetStateAction, useEffect, useRef } from 'react';

type ProductFormProps = {
  initialValues?: Product | null;
};
import SwitchInput from '../ui/switch-input';
import { Switch } from '@headlessui/react';
import { toast } from 'react-toastify';
import Loader from '../ui/loader/loader';
import { RxCross1 } from 'react-icons/rx';
import { AiFillDelete } from 'react-icons/ai';

export default function CreateOrUpdateProductForm({
  initialValues,
}: ProductFormProps) {
  const router = useRouter();
  const [isSlugDisable, setIsSlugDisable] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();

  const { data: shopData } = useShopQuery(
    { slug: router.query.shop as string },
    {
      enabled: !!router.query.shop,
    }
  );
  const [value, setValues] = React.useState<any>(false);
  const [isMarketPlace, setIsMarketPlace] = React.useState<any>(false);
  const [isStorefront, setIsStorefront] = React.useState<any>(false);
  const [taxArray, setTaxDataArray] = useState<any>();
  const [loadingData, setloadingData] = useState(false);
  const [productTypeDropId, setproductTypeDropId] = useState<any>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [NewLoading, setNewLoading] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [VarientModuel, setVarientModuel] = React.useState(false);
  const [dataSource, setDataSource] = React.useState<any[]>([]);
  const [UnitDataArray, setUnitDataArray] = React.useState<any[]>([]);
  const [BrandDataArray, setBrandDataArray] = React.useState<any[]>([]);
  const [CatDataArray, setCatDataArray] = React.useState<any[]>([]);
  const [SubCatDataArray, setSubCatDataArray] = React.useState<any[]>([]);
  const [SelectedSubCatData, setSelectedSubCatData] = React.useState<any[]>([]);
  const [globalCategory, setGlobalCategory] = React.useState<any[]>([]);
  const [LocationDataArray, setLocationDataArray] = React.useState<any[]>([]);
  const [newData, setAnewData] = React.useState<any[]>([]);
  // const { alignLeft, alignRight } = useIsRTL();
  const [incFullPrice, setfullincPrice] = useState<any>();
  const [incPrice, setincPrice] = useState<any>();
  const [alertQuantityPrise, setAlertQuantityPrise] = useState<any>();
  const [quantityAvail, setQuantityAvail] = useState<any>('');
  const [excPrice, setexcPrice] = useState<any>();
  const [excFullPrice, setfullexcPrice] = useState<any>();
  const [taxValue, setTaxValue] = useState<any>();
  const [catDropId, setcatDropId] = useState<any>();
  const [SubcatDropId, setSubCatDropId] = useState<any>();
  const [SubcatDropName, setSubCatDropName] = useState<any>();
  const [SelectedGlobalCat, setSelectedGlobalCat] = useState<any>();
  const [brandDropId, setbrandDropId] = useState<any>();
  const [priceTextType, setpriceTextType] = useState<any>();
  const [UnitTextType, setUnitTextType] = useState<any>();
  const [LocationVal, setLocation] = useState<any>([]);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [taxId, setTaxId] = useState<any>();
  const [isSearchable, setIsSearchable] = React.useState(true);
  const [path, setPath] = useState<any>([]);
  const [imgArr, setImageArr] = useState<any>();
  const [imageFile, setImageFile] = useState<any>([]);
  const [setStatuses, setStatus] = useState<any>([]);
  const [description, setDesctiption] = useState<any>();
  const [images, setImages] = useState<any>([]);
  const [taxValues, setTaxValues] = useState<any>([]);
  const [excValues, setExcValues] = useState<any>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [modelName, setModalName] = useState();
  const [closeDialog, setCloseDialog] = useState<any>(false);
  const [taxInputs, setTaxInputs] = useState<any>([{ name: '', amount: '' }]);
  const [businessDetail, setBusinessDetail] = useState<any>();
  const [locationDetail, setLocationDetail] = useState<any>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleImgLoader, setDeleImgLoader] = useState(false);
  const [deleteImgId, setDeleteImgId] = useState('');
  const [deleteImgIndex, setDeleteImgIndex] = useState('');
  const [imageLink, setImageLink] = useState(''); // Provide the image link here

  const [productImagesIndex, setProductImagesIndex] = useState(
    initialValues?.product_images_index || {}
  );
  const[coverImg,setCoverImg]=useState<any>()
  let form = new FormData();

  useEffect(()=>{

    
    if(productImagesIndex){
      var newPath:any=[]
      for (const [key, value] of Object?.entries(productImagesIndex)) {
        newPath=[...newPath,value]
        
      }
     
      if(initialValues?.image_url){
        newPath.unshift(initialValues?.image_url)
        setPath(newPath)
      }else{
        setPath(newPath)
      }
    

    }
 
  },[productImagesIndex])

useEffect(()=>{

  if(path.length!=0){
    // console.log(path,'pathpaht');
    
    convertToBlob(path[0])
    // if(path[0].includes('blob:'))
    // {
     
    //   convertToBlob(path[0].replace(/^blob:/, ''))
    // }else{
     
    //   convertToBlob(path[0])
    // }
  
    // convertImageUrlToFile(path[0])
    //   .then(file => {
    //     console.log("Converted File:", file);
    //     // Use the File object as needed
    //     setCoverImg(file)
    //   })
    //   .catch(error => {
    //     console.error("Failed to convert image URL to File:", error);
    //   });
    
  }
},[path])
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
        
          // let url:any= URL.createObjectURL(res)
       
          setPath((current) => [...current,URL.createObjectURL(res)]);
  //         setPath((current) => {
  //            const url = URL.createObjectURL(res);
  // const cleanedUrl = url.replace(/^blob:/, '');
  // return [...current, cleanedUrl];
  //         });
        } else {
          setPath([URL.createObjectURL(res)]);
        }
      });
   
    }
  }, [imageFile]);
  
  useEffect(() => {
    // console.log(initialValues,'initialValues');
    // if(initialValues?.category){
    //   setbrandDropId(initialValues?.category?.id)
    // } if(initialValues?.brand){
    //   setcatDropId(initialValues?.brand?.id)
    // }
    
    if (initialValues?.product_images_index) {
      const mergedArray:any = [...Object.values(initialValues?.product_images_index)];
    
      if(mergedArray && initialValues?.image_url){
        mergedArray.unshift(initialValues?.image_url)
        setPath(mergedArray)
      }else{
        setPath(mergedArray)
      }
     
    }
    if(initialValues?.image_url){
      path.unshift(initialValues?.image_url)
      
     }
   
  }, [initialValues])


  
   const convertToBlob =async (url) => {
   
   await fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], "image.svg", { type: "image/svg+xml" });
        console.log(file,'======file');
        setCoverImg(file)
        
        // this.setState({ file });
      })
      .catch((error) => {
        console.error("Error converting image:", error);
      });
  };
  



  const shopId = shopData?.id!;
  const isNewTranslation = router?.query?.action === 'translate';
  const isSlugEditable =
    router?.query?.action === 'edit' &&
    router?.locale === Config.defaultLanguage;
  const methods = useForm<ProductFormValues>({
    resolver: yupResolver(productValidationSchema),
    shouldUnregister: true,
    // @ts-ignore
    defaultValues: getProductDefaultValues(initialValues!, isNewTranslation),
  });



  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = methods;

  const {
    mutate: createProduct,
    isLoading: creating,
  } = useCreateProductMutation();
  const {
    mutate: updateProduct,
    isLoading: updating,
  } = useUpdateProductMutation();

  React.useEffect(() => {
    // const productImagesArray = Object.entries(
    //   initialValues?.product_images_index
    // ).map(([key, value]) => ({
    //   id: key,
    //   imageUrl: value,
    // }));
    // console.log(productImagesArray);
  });

  React.useEffect(() => {
    setloadingData(true);
    // let aa = initialValues?.product_images_index;
    // console.log(aa);

    // const productImagesArray = Object.keys(aa);
    // console.log(productImagesArray);

    setproductTypeDropId('single');
    let Exclusive_Price: any = parseFloat(
      initialValues?.product_variations[0]?.variations[0]?.default_sell_price
    ).toFixed(2);
    let Exclusive_Full_Price: any =
      initialValues?.product_variations[0]?.variations[0]?.default_sell_price;
    let Inclusive_Prise: any = parseFloat(
      initialValues?.product_variations[0]?.variations[0]?.sell_price_inc_tax
    ).toFixed(2);
    let Inclusive_Full_Prise: any =
      initialValues?.product_variations[0]?.variations[0]?.sell_price_inc_tax;
    let Alert_Quantity: any = initialValues?.alert_quantity;

    setincPrice(Inclusive_Prise);
    setfullincPrice(Inclusive_Full_Prise);
    setexcPrice(Exclusive_Price);
    setfullexcPrice(Exclusive_Full_Price);
    setAlertQuantityPrise(Alert_Quantity);

    if (initialValues?.enable_stock == 1) {
      setValues(true);
    } else {
      setValues(false);
    }
    if (initialValues?.show_in_market_place == 1) {
      setIsMarketPlace(true);
    } else {
      setIsMarketPlace(false);
    }
    if (initialValues?.show_on_storefront == 1) {
      setIsStorefront(true);
    } else {
      setIsStorefront(false);
    }
    if (initialValues?.type == 'variable') {
      setproductTypeDropId('variable');
    }

    if (initialValues?.product_description) {
      setDesctiption(initialValues?.product_description);
    }
    if (initialValues?.rack_details) {
      setLocationDetail(initialValues?.rack_details);
    }

    if (initialValues?.sub_category?.id) {
      setSubCatDropId(initialValues?.sub_category?.id);
    }

    GetFunction('/get_variations').then((result) => {
      let ordersData = result.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
          values: data.values,
        };
      });
      // setDataSource(ordersData);
      setIsLoading(false);
    });

    GetFunction('/tax').then((result) => {
      let taxData = result.data;

      let taxArr = taxData.map((data, i) => {
        return {
          key: data.id,
          id: data.id,
          value: data.amount,
          label: data.name,
        };
      });

      setTaxDataArray(taxArr);
    });

    GetFunction('/unit').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.actual_name,
          label: data.actual_name,
        };
      });

      setUnitDataArray(ordersData);
    });

    GetFunction('/brand').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });

      setBrandDataArray(ordersData);
    });

    GetFunction('/business-location').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });

      setLocationDataArray(ordersData);
    });

    GetFunction('/taxonomy').then((result) => {
      const subcategoriesData: any = [];
      result.data.forEach((data, i) => {
        data.sub_categories.forEach((subcat_data, cat_i) => {
          subcategoriesData.push({
            key: cat_i,
            id: subcat_data.id,
            value: subcat_data.name,
            label: subcat_data.name,
            parent_id: subcat_data.parent_id,
          });
        });
      });

      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });


      setCatDataArray(ordersData);
      setSubCatDataArray(subcategoriesData);

      const filteredSubCatData = subcategoriesData.filter(
        (subcat) => subcat.parent_id === initialValues?.category?.id
      );
      setSelectedSubCatData(filteredSubCatData);
    });
    GetMarketPlace('/marketplace-front/globelCategories').then((result) => {
      let categories = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });

      setGlobalCategory(categories);
    });

    if (
      initialValues?.product_variations[0]?.variations[0]
        ?.variation_location_details[0]?.qty_available
    ) {
      let avlQty =
        initialValues?.product_variations[0].variations[0]
          .variation_location_details[0].qty_available;
      setQuantityAvail(avlQty);
    }
    if (initialValues?.product_tax?.id) {
      let tax_id = initialValues?.product_tax.id;
      let amount = initialValues?.product_tax.amount;
      setTaxId(tax_id);
      setTaxValue(amount);
    }
    if (initialValues?.type == 'variable') {
      setVarientModuel(true);
    }
    if (initialValues?.unit?.id) {
      setUnitTextType(initialValues?.unit?.id);
    }
    // if(initialValues?.product_locations[0]?.id){
    //   setLocation(initialValues?.product_locations[0]?.id)
    // }
    if (initialValues?.product_locations) {
      let locsData = initialValues?.product_locations.map((data, i) => {
        return {
          id: data.id,
          label: data.name,
        };
      });

      setLocation(locsData);
    }
    let token = localStorage.getItem('user_token');
    GetFunctionBDetail('/business-details', token).then((result) => {
      setBusinessDetail(result.data);
    });

    setloadingData(false);
    // label: initialValues?.product_locations[0]?.name,
  }, []);
  // console.log(businessDetail,'ldskjfaslfkjsldfjfslafj');

  useEffect(() => {
    if (initialValues?.ignite_category_id) {
      setloadingData(true);
      globalCategory.map((data, i) => {
        if (data.id === initialValues?.ignite_category_id) {
          setSelectedGlobalCat(data);
          setloadingData(false);
        }
      });
    }
  }, [initialValues, globalCategory]);

  // let locObject = {
  //   id:949,
  //   label:'test'
  //  };

  const handleRack = (index, e) => {
    let newArr: any = [...locationDetail];
    newArr[index] = {
      ...newArr[index],
      rack: e,
      // row: ,
      // position: 3
    };
    setLocationDetail(newArr);
  };

  const handleRow = (index, e) => {
    let newArr: any = [...locationDetail];
    newArr[index] = {
      // rack: 2,
      ...newArr[index],
      row: e,
      // position: 3
    };
    setLocationDetail(newArr);
  };
  const handlePosition = (index, e) => {
    let newArr: any = [...locationDetail];
    newArr[index] = {
      // rack: 2,
      // row: 2,
      ...newArr[index],
      position: e,
    };
    setLocationDetail(newArr);
  };

  // console.log(locationDetail, 'locationDetal');


  const changeTaxInputs = (e, input) => {
    const value = e.target.value;
    let newTaxInputs = [...taxInputs];
    if (input === 'name') {
      newTaxInputs[0].name = value;
    } else {
      newTaxInputs[0].amount = value;
    }
    setTaxInputs(newTaxInputs);
  };

  const TaxOnChange = (e) => {
    setTaxId(e.id);
    setTaxValue(e.value);
    if (e.value != 0) {
      let value: any = excPrice;
      // value = value * (1 + 0.15)  ;
      value = value * (1 + e.value / 100);
      let newValue: any = Math.round(value);

      let fullValue: any = excFullPrice;
      // value = value * (1 + 0.15)  ;
      fullValue = fullValue * (1 + e.value / 100);
      let newfullValue: any = fullValue;
      setincPrice(newValue);
      setfullincPrice(newfullValue);
      setexcPrice(excPrice);
      setfullexcPrice(excFullPrice);
    } else {
      setincPrice(0.0);
      setfullincPrice(0.0);
    }
  };
  const AlertQuantityOnChange = (e) => {
    setAlertQuantityPrise(e.target.value);
  };
  const QuantityAvailOnChange = (e) => {
    setQuantityAvail(e.target.value);
  };

  const onChangeExcPrice = (e) => {
    let value: number = e.target.value;
 
    value = taxValue ? value * (1 + taxValue / 100) : value;
    let newValue: any = value;
    if (taxValue == 0) {
      setincPrice(parseFloat(e.target.value).toFixed(2));
      setfullincPrice(e.target.value);
      setexcPrice(e.target.value);
      setfullexcPrice(e.target.value);
    } else {
      setincPrice(parseFloat(newValue).toFixed(2));
      setfullincPrice(newValue);
      setexcPrice(e.target.value);
      setfullexcPrice(e.target.value);
    }
  };

  const onChangeIncPrice = (e) => {
    let value = e.target.value;
    value = taxValue ? value / (1 + taxValue / 100) : value;
    let newValue: any = value;
    if (taxValue == 0) {
      setexcPrice(parseFloat(e.target.value).toFixed(2));
      setfullexcPrice(e.target.value);
      setincPrice(e.target.value);
      setfullincPrice(e.target.value);
    } else {
      setexcPrice(parseFloat(newValue).toFixed(2));
      setfullexcPrice(newValue);
      setincPrice(e.target.value);
      setfullincPrice(e.target.value);
    }
  };
  const ProductOnChange = (e) => {
    setproductTypeDropId(e.label);
    // window.scrollTo(0, 0);

    // targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // if (e.value != 'single') {
    //   setVarientModuel(true);
    // } else {
    //   setVarientModuel(false);
    // }
  };

  const subCatOnChange = (e) => {
    setSubCatDropId(e.id);
    setSubCatDropName(e.label);
  };

  const catOnChange = (e) => {
    setcatDropId(e.id);
    setSelectedSubCatData([]);
    setSubCatDropId(null);
    setSubCatDropName(null);
    const filteredSubCatData = SubCatDataArray.filter(
      (subcat) => subcat.parent_id === e.id
    );
    setSelectedSubCatData(filteredSubCatData);
  };
  const changeGlobalCat = (e) => {
    setSelectedGlobalCat(e);
  };
  const brandOnChange = (e) => {
    setbrandDropId(e.id);
  };

  const UnitOnChange = (e) => {
    setUnitTextType(e.id);
  };
  const locationOnChange = (e) => {
    setLocation(e);

    // let value = e.map((y) => {
    //   return y.id
    // });
    // setLocation(value);
  };
  const gettingelectedVal = (e) => {
    setNewLoading(true);
    let vvvvvvv = dataSource.find((aa) => aa.id == e.id);
    setAnewData(vvvvvvv.values);
  };
  if (loadingData) return <Loader text={t('common:text-loading')} />;

  const productTypeOption = [
    {
      value: 0,
      label: initialValues?.type == 'single' ? initialValues?.type : 'single',
    },
    {
      value: 1,
      label: 'variable',
    },
  ];
  const taxTypeOption = [
    {
      value: 'none',
      label: 'None',
    },
    {
      value: 'tax15',
      label: 'Tax-15',
    },
  ];
  const UnitDataArrayDefault = [
    {
      label: initialValues?.unit?.actual_name,
    },
  ];
  const brandDefaultArray = [
    {
      label: initialValues?.brand?.name,
    },
  ];
  const categoryDefaultArray = [
    {
      label: initialValues?.category?.name,
    },
  ];
  const subcategoryDefaultArray = [
    {
      label: initialValues?.sub_category?.name,
    },
  ];

  const taxDefaultArray = [
    {
      label: initialValues?.product_tax?.name,
    },
  ];
  const productDefaultArray = [
    {
      label: initialValues?.type,
    },
  ];

  const onChange = (e: any) => {
    setValues((value: any) => !value);
  };
  const onChangeMarketPlace = (e: any) => {
    setIsMarketPlace((isMarketPlace: any) => !isMarketPlace);
  };
  const onChangeStorefront = (e: any) => {
    setIsStorefront(!isStorefront);
  };
  const openModal = (e: any, name) => {
    e.preventDefault();
    setModalName(name);
    setOpenDialog(true);
  };

  const onClickClose = () => {
    setOpenDialog(false);
    setCloseDialog(false);
  };

  let stock;
  if (value == true) {
    stock = 1;
  } else {
    stock = 0;
  }
  const onSubmitTax = () => {
    if (taxInputs) {
      let formVal = {
        name: taxInputs[0]?.name,
        amount: taxInputs[0]?.amount,
      };
      setCreatingLoading(true);
      if (modelName == 'tax') {
        setCreatingLoading(true);
        AddingTaxFunction('/create-tax', formVal).then((result) => {
          if (result.success) {
            toast.success(t('common:successfully-created'));
            setCreatingLoading(false);
            setOpenDialog(false);
            GetFunction('/tax').then((result) => {
              let taxData = result.data;

              let taxArr = taxData.map((data, i) => {
                return {
                  key: data.id,
                  id: data.id,
                  value: data.amount,
                  label: data.name,
                };
              });

              setTaxDataArray(taxArr);
            });
          } else {
            toast.error(t(result.msg));
            setCreatingLoading(false);
          }
        });
      } else if (modelName == 'brand') {
        setCreatingLoading(true);
        AddingTaxFunction('/brand', formVal).then((result) => {
          if (result.success) {
            toast.success(t('common:successfully-created'));
            setCreatingLoading(false);
            setOpenDialog(false);

            GetFunction('/brand').then((result) => {
              let ordersData = result.data.map((data, i) => {
                return {
                  key: i,
                  id: data.id,
                  value: data.name,
                  label: data.name,
                };
              });

              setBrandDataArray(ordersData);
            });
          } else {
            toast.error(t(result.msg));
            setCreatingLoading(false);
          }
        });
      } else if (modelName == 'category') {
        setCreatingLoading(true);
        AddingTaxFunction('/taxonomy/create', formVal).then((result) => {
          if (result.success) {
            toast.success(t('common:successfully-created'));
            setCreatingLoading(false);
            setOpenDialog(false);
            GetFunction('/taxonomy').then((result) => {
              let ordersData = result.data.map((data, i) => {
                return {
                  key: i,
                  id: data.id,
                  value: data.name,
                  label: data.name,
                };
              });

              setCatDataArray(ordersData);
            });
          } else {
            toast.error(t(result.msg));
            setCreatingLoading(false);
          }
        });
      } else if (modelName == 'unit') {
        setCreatingLoading(true);
        let unitVal = {
          actual_name: taxInputs[0]?.name,
        };
        AddingTaxFunction('/unit', unitVal).then((result) => {
          if (result.success) {
            setCreatingLoading(false);

            toast.success(t('common:successfully-created'));
            setOpenDialog(false);
            GetFunction('/unit').then((result) => {
              let ordersData = result.data.map((data, i) => {
                return {
                  key: i,
                  id: data.id,
                  value: data.actual_name,
                  label: data.actual_name,
                };
              });

              setUnitDataArray(ordersData);
            });
          } else {
            toast.error(t('Something Went Wrong'));
            setCreatingLoading(false);
          }
        });
      }
    }
  };
  const handleImageDrag = (event, index) => {
    event.preventDefault();
    const draggedLink = path[index];

    const updatedImageLinks = [...path]; // Create a copy of the original array

    // Swap the position of the dragged image with the image at index 0
    const temp = updatedImageLinks[0];
    updatedImageLinks[0] = draggedLink;
    updatedImageLinks[index] = temp;

    setPath(updatedImageLinks);
  };


  const onRemooveImage = (id) => {
    // console.log(initialValues?.product_images_index);
    // console.log(id, 'idid');

    setDeleteModal(true);
    setDeleteImgId(id);
  };

  const onRemooveImageAddCase = (link, index) => {
    const updatedPath = [...path];
    // updatedPath.splice(index, 1);

    const linkExists = Object.values(productImagesIndex).includes(link);
    if(linkExists){
      for (const [key, value] of Object.entries(productImagesIndex)) {
        if (value === link) {
          onRemooveImage(key)
         
          break; // Stop iterating once the link is found
        }
      }
    }else{
      updatedPath.splice(index, 1);
      setPath(updatedPath);
    }
   

    // console.log(linkExists, 'linklink')
  };

  const onConfirmDelet = () => {
    setDeleImgLoader(true);
    DashboardGetFun('/product/delete/' + deleteImgId).then((result) => {
      if (result.success) {
        const updatedImages = { ...productImagesIndex };

        delete updatedImages[deleteImgId];
        setProductImagesIndex(updatedImages);

        toast.success(result.message);
        setDeleImgLoader(false);
        setDeleteModal(false);
      } else {
        toast.success(result.message);
        setDeleImgLoader(false);
      }
    });
  };
  const onSubmit = async (values: ProductFormValues) => {
    // console.log(coverImg,'file file');
    const inputValues = {
      language: router.locale,
      ...getProductInputValues(values, initialValues, value, productTypeDropId),
    };
    let variations = inputValues.variation_options?.upsert;

    let template = inputValues?.template;
    // console.log('templates',template);return;
    let marketPlace;
    if (isMarketPlace == true) {
      marketPlace = 1;
    } else {
      marketPlace = 0;
    }
    let showOnStorefront;
    if (isStorefront == true) {
      showOnStorefront = 1;
    } else {
      showOnStorefront = 0;
    }
    let productRack: any = {};
    if (
      businessDetail?.enable_row ||
      businessDetail?.enable_racks ||
      businessDetail?.enable_position
    ) {
      {
        LocationDataArray.map((location, index) => {
          productRack = {
            ...productRack,
            [location.id]: locationDetail[index],
          };
        });
      }
    }

    try {
      let locationData = LocationVal.map((data, i) => {
        return data.id;
      });
      form.append('name', values.name);
      values.arabic_name &&  form.append('arabic_name', values.arabic_name);
     
      form.append('show_in_market_place', marketPlace);
      form.append('show_on_storefront', showOnStorefront);
      form.append(
        'ignite_category_id',
        SelectedGlobalCat ? SelectedGlobalCat.id : ''
      );
      form.append('category_id', catDropId ? catDropId : '');
      form.append('sub_category_id', SubcatDropId ? SubcatDropId : '');
      form.append('brand_id', brandDropId ? brandDropId : '');
      form.append('sku', values.sku);
      form.append('unit_id', UnitTextType ? UnitTextType : '');
      form.append('single_dpp', excFullPrice ? excFullPrice : '');
      form.append('single_dpp_inc_tax', incFullPrice ? incFullPrice : '');
      form.append('type', productTypeDropId);
      form.append('enable_stock', stock);
      form.append('barcode_type', 'C128');
      form.append('tax_type', 'inclusive');
       values.weight &&  form.append('weight', values.weight );
      form.append('image', coverImg);
      if (
        businessDetail?.enable_row ||
        businessDetail?.enable_racks ||
        businessDetail?.enable_position
      ) {
        if (initialValues) {
          if (initialValues?.rack_details?.length == 0) {
            form.append('product_racks', JSON.stringify(productRack));
          } else {
            form.append('product_racks_update', JSON.stringify(productRack));
          }
        } else {
          form.append('product_racks', JSON.stringify(productRack));
        }
      }

      // form.append('product_racks',productRack);
      form.append('tax_rate_id', taxId ? taxId : '');
      form.append('qty_available', quantityAvail ? quantityAvail : '');

      form.append(
        'business_location_id',
        locationData.length > 0 ? JSON.stringify(locationData) : ''
      );

      form.append('not_for_selling', '0');
      form.append('product_description', values?.product_description);
      form.append('enable_sr_no', '0');
      form.append('status', setStatuses ? setStatuses : '');
      form.append(
        'alert_quantity',
        alertQuantityPrise ? alertQuantityPrise : ''
      );
      form.append('tax_amount', taxValue ? taxValue : '');
      variations && variations.length != 0
        ? form.append('variation', variations ? JSON.stringify(variations) : '')
        : '';
      template ? form.append('templates', template ? template : '') : '';
      form.append('id', initialValues?.id);
      form.append('sales_tax', taxValues ? JSON.stringify(taxValues) : '');
      form.append('exc_values', excValues ? JSON.stringify(excValues) : '');
      imgArr?.map((res, index) => {
        form.append(`product_image${index}`, res);
      });
      images?.map((res, index) => {
        form.append(`images_${index}`, res);
      });

      // return;
      if (initialValues?.id) {
        setCreatingLoading(true);
        UpdatingProduct('/product/update', form).then((result) => {
          if (result.success) {
            setCreatingLoading(false);
            toast.success(t('common:successfully-created'));
            router.back();
          } else {
            toast.error(result.message);
            setCreatingLoading(false);
          }
        });
      } else {
        setCreatingLoading(true);
        AddingFunction('/product/createProductWithVariations', form).then(
          (result) => {
            if (result.success) {
              setCreatingLoading(false);
              toast.success(t('common:successfully-created'));
              if (result.data.enable_stock == 1) {
                const url = 'stock/' + result.data.id;
                router.push(url);
              } else {
                router.back();
              }
            } else {
              toast.error(result.message);
              setCreatingLoading(false);
            }
          }
        );
      }
    } catch (error) {
      const serverErrors = getErrorMessage(error);
      Object.keys(serverErrors?.validation).forEach((field: any) => {
        setError(field.split('.')[1], {
          type: 'manual',
          message: serverErrors?.validation[field][0],
        });
      });
    }
  };

  const product_type = watch('product_type');

  const is_digital = watch('is_digital');
  const is_external = watch('is_external');
  const slugAutoSuggest = join(split(watch('name'), ' '), '-').toLowerCase();
console.log(isStorefront,'storestore');


  return (
    <>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('form:image-uploader-title')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <FileInput
                name="product_image"
                setImageFile={setImageFile}
                control={control}
                multiple={true}
              />
              {/* <div className="flex">
                {Object.keys(productImagesIndex).map((key) => (
                  <div className="flex mt-6" key={key}>
                    <img
                      style={{
                        paddingTop: 5,
                        marginLeft: 10,
                        width: '50px',
                        height: '50px',
                      }}
                      src={productImagesIndex[key]}
                      alt="cate-image"
                    />
                    <div className="bg-slate-200 rounded-full h-5 p-1">
                      <RxCross1
                        onClick={() => onRemooveImage(key)}
                        className="w-3 h-3 justify-end flex cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div> */}

              <div className="flex flex-wrap">
                {path &&
                  path.map((res, index) => (
                   
                    <div className="flex mt-6 image-container" key={index}>
                      
                      <span className=" image-container">
                      {index === 0 && (
                        <div className="text-cover ">
                          <span className=" bg-accent ml-2 rounded px-1">Cover</span> </div>
                      )}
                      <img
                        key={index}
                        style={{
                          paddingTop: 5,
                          marginLeft: 10,
                          width: '50px',
                          height: '50px',
                         
                        }}
                        src={res}
                        onDragStart={(event) => handleImageDrag(event, index)}
                        alt="cate-image"
                      /></span>
                      <div className="bg-slate-200 rounded-full h-5 p-1">
                        <RxCross1
                          onClick={() => onRemooveImageAddCase(res, index)}
                          className=" w-3 h-3 justify-end flex  cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>

          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:item-description')}
              details={t('form:product-description')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <Input
                label={t('form:input-label-name')}
                {...register('name')}
                variant="outline"
                className="mb-5"
              />
              <Input
                label={t('form:input-alter-name')}
                {...register('arabic_name')}
                error={t(errors.name?.message!)}
                variant="outline"
                className="mb-5"
              />
              <Input
                label={t('form:input-label-stock-code')}
                {...register('sku')}
                disabled={initialValues?.id ? true : false}
                variant="outline"
                className="mb-5"
              />{
                businessDetail?.enable_weight == 1 &&
                <Input
                  label={t('form:input-label-weight')}
                  {...register('weight')}
                  variant="outline"
                  className="mb-5"
                />
              }

              <TextArea
                label={t('form:input-description')}
                {...register('product_description')}
                variant="outline"
                className="mb-5"
              />

              <div className="mb-5">
                <Label>{t('form:input-tax')}</Label>
                <Select
                  styles={selectStyles}
                  name="taxType"
                  options={taxArray}
                  defaultValue={taxDefaultArray}
                  onChange={TaxOnChange}
                />
                <div className="text-right">
                  <button
                    style={{ width: '8%', marginTop: '10px' }}
                    className=" bg-accent p-1 text-sm font-bold text-white transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-10"
                    type="button"
                    onClick={(e) => openModal(e, 'tax')}
                  >
                    +
                  </button>
                </div>
                {/* <SelectInput
              onChange={TaxOnChange}
              name='taxType'
              control={control}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.id}
              options={taxArray}
              styles={selectStyles}
              // isSearchable={isSearchable}
              // options={CatDataArray}
              // defaultValue={categoryDefaultArray}'
              
            />
            */}
              </div>
            </Card>
          </div>

          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('common:unit')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div className="mb-3">
                <Label>{t('form:input-label-unit')}</Label>
                <Select
                  placeholder="ome Value here"
                  styles={selectStyles}
                  options={UnitDataArray}
                  defaultValue={UnitDataArrayDefault}
                  onChange={UnitOnChange}
                />
                <div className="text-right">
                  <button
                    style={{ width: '8%', marginTop: '10px' }}
                    className=" bg-accent p-1 text-sm font-bold text-white transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-10"
                    type="button"
                    onClick={(e) => openModal(e, 'unit')}
                  >
                    +
                  </button>
                </div>
              </div>
            </Card>
          </div>

          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:input-label-details')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div className="mb-3">
                <Label>{t('form:input-label-brand')}</Label>
                <Select
                  styles={selectStyles}
                  name="brand_id"
                  options={BrandDataArray}
                  defaultValue={brandDefaultArray}
                  onChange={brandOnChange}
                />
                <div className="text-right">
                  <button
                    style={{ width: '8%', marginTop: '10px' }}
                    className=" bg-accent p-1 text-sm font-bold text-white transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-10"
                    type="button"
                    onClick={(e) => openModal(e, 'brand')}
                  >
                    +
                  </button>
                </div>
                {/* <SelectInput
              name='brand_id'
              control={control}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.id}
              options={BrandDataArray}
              styles={selectStyles}
              // isSearchable={isSearchable}
              // options={CatDataArray}
              // defaultValue={categoryDefaultArray}
              onChange={brandOnChange}
            /> */}
              </div>
              <div className="mb-3">
                <Label>{t('form:input-label-category')}</Label>
                <Select
                  styles={selectStyles}
                  name="categories"
                  options={CatDataArray}
                  defaultValue={categoryDefaultArray}
                  onChange={catOnChange}
                  isClearable
                />
                <div className="text-right">
                  <button
                    style={{ width: '8%', marginTop: '10px' }}
                    className=" bg-accent p-1 text-sm font-bold text-white transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-10"
                    type="button"
                    onClick={(e) => openModal(e, 'category')}
                  >
                    +
                  </button>
                </div>
                {/* <SelectInput
              name='categories'
              control={control}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.id}
              options={CatDataArray}
              styles={selectStyles}
              // isSearchable={isSearchable}
              // options={CatDataArray}
              // defaultValue={categoryDefaultArray}
              onChange={catOnChange}
            /> */}
              </div>
              <div className="mb-3">
                <Label>{t('form:input-label-subcategory')}</Label>
                <Select
                  styles={selectStyles}
                  name="sub_cat_id"
                  options={SelectedSubCatData.map((subcat, i) => ({
                    key: i,
                    id: subcat.id,
                    value: subcat.id,
                    label: subcat.value,
                  }))}
                  //  value={SubcatDropName || subcategoryDefaultArray}
                  defaultValue={subcategoryDefaultArray}
                  onChange={subCatOnChange}
                  isClearable
                />

                {/* <SelectInput
              name='categories'
              control={control}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.id}
              options={CatDataArray}
              styles={selectStyles}
              // isSearchable={isSearchable}
              // options={CatDataArray}
              // defaultValue={categoryDefaultArray}
              onChange={catOnChange}
            /> */}
              </div>
              <div className="mb-3">
                <Label>{t('form:input-label-location')}</Label>
                <Select
                  styles={selectStyles}
                  name="business_location_id"
                  getOptionLabel={(option: any) => option.label}
                  getOptionValue={(option: any) => option.id}
                  options={LocationDataArray}
                  value={LocationVal}
                  onChange={locationOnChange}
                  isMulti
                />
                {/* {
              initialValues?.product_locations ? (
                <Select
                styles={selectStyles}
                name="business_location_id"
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => option.id}
                options={LocationDataArray}
                value={LocationVal}
                onChange={locationOnChange}
                isMulti
  
              />
              ) : (
                <Select
                styles={selectStyles}
                name="business_location_id"
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => option.id}
                options={LocationDataArray}
                onChange={locationOnChange}
                isMulti
  
              />
              )
             } */}

                {/* <SelectInput
              name='business_location_id'
              control={control}s
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.id}
              options={LocationDataArray}
              styles={selectStyles}
              // isSearchable={isSearchable}
              // options={CatDataArray}
              // defaultValue={categoryDefaultArray}
              onChange={locationOnChange}
            />
            */}
              </div>
            </Card>
          </div>
          {businessDetail?.enable_row != 0 ||
            businessDetail?.enable_racks != 0 ||
            businessDetail?.enable_position != 0 ? (
            <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
              <Description
                title={t('form:rock-row-position')}
                className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
              />
              <Card className="w-full sm:w-8/12 md:w-2/3">
                {LocationDataArray.map((location, index) => (
                  <div key={index}>
                    <label className="mb-3 block text-sm font-semibold leading-none text-body-dark">
                      {location.label}
                    </label>
                    {businessDetail && businessDetail?.enable_racks === 1 && (
                      <div className="mb-3">
                        {/* <label className="mb-3 block text-sm font-semibold leading-none text-body-dark">
                            {t('form:form-label-rack')}
                          </label> */}
                        <input
                          // {...register('ExecPrice')}
                          placeholder="Rack"
                          value={
                            locationDetail ? locationDetail[index]?.rack : ''
                          }
                          className=" flex h-12 w-full appearance-none items-center rounded border border-border-base px-2 text-sm text-heading transition duration-300 ease-in-out focus:border-accent focus:bg-light focus:shadow focus:outline-none focus:ring-0"
                          type="number"
                          onChange={(e) => handleRack(index, e.target.value)}
                        />
                      </div>
                    )}
                    {businessDetail && businessDetail?.enable_row === 1 && (
                      <div className="mb-3">
                        {/* <label className="mb-3 block text-sm font-semibold leading-none text-body-dark">
                            {t('form:form-label-row')}
                          </label> */}
                        <input
                          // {...register('ExecPrice')}
                          placeholder="Row"
                          value={
                            locationDetail ? locationDetail[index]?.row : ''
                          }
                          className=" flex h-12 w-full appearance-none items-center rounded border border-border-base px-2 text-sm text-heading transition duration-300 ease-in-out focus:border-accent focus:bg-light focus:shadow focus:outline-none focus:ring-0"
                          type="number"
                          onChange={(e) => handleRow(index, e.target.value)}
                        />
                      </div>
                    )}
                    {businessDetail && businessDetail?.enable_position === 1 && (
                      <div className="mb-3">
                        {/* <label className="mb-3 block text-sm font-semibold leading-none text-body-dark">
                            {t('form:form-label-position')}
                          </label> */}
                        <input
                          // {...register('ExecPrice')}
                          placeholder="Position"
                          value={locationDetail[index]?.position ?? ''}
                          className=" flex h-12 w-full appearance-none items-center rounded border border-border-base px-2 text-sm text-heading transition duration-300 ease-in-out focus:border-accent focus:bg-light focus:shadow focus:outline-none focus:ring-0"
                          type="number"
                          onChange={(e) =>
                            handlePosition(index, e.target.value)
                          }
                        />
                      </div>
                    )}

                  </div>
                ))}
              </Card>
            </div>
          ) : null}
          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:form-label-stock')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div className="mb-5">
                <Label>{t('form:form-input-label-manage-stock')}</Label>
                <Switch
                  checked={value}
                  {...register('enable_stock')}
                  onChange={onChange}
                  className={`${value ? 'bg-accent' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                  dir="ltr"
                >
                  <span className="sr-only">Enable </span>
                  <span
                    className={`${value ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                  />
                </Switch>
              </div>
              {value && (
                <>
                  <div>
                    {/* {productTypeDropId != 'variable' ? ( <>
                <Input
                label={t('form:input-label-quantity')}
                {...register('QName')}
                variant="outline"
                onChange={QuantityAvailOnChange}
                value={quantityAvail}
                className="mb-5"
              />
                </>) : ''} */}

                    <Input
                      label={t('form:input-label-alert-quantity')}
                      {...register('alertQName')}
                      onChange={AlertQuantityOnChange}
                      value={alertQuantityPrise}
                      type="number"
                      variant="outline"
                      className="mb-5"
                    />
                  </div>
                </>
              )}
            </Card>
          </div>

          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:form-label-marketPlace')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div className="mb-5">
                <Label>{t('form:form-label-marketPlace')}</Label>
                <Switch
                  checked={isMarketPlace}
                  // {...register('show_in_market_place')}
                  onChange={onChangeMarketPlace}
                  className={`${isMarketPlace ? 'bg-accent' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                  dir="ltr"
                >
                  <span className="sr-only">Enable </span>
                  <span
                    className={`${isMarketPlace ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                  />
                </Switch>
              </div>
              {isMarketPlace && (
                <>
                  <div>
                    <Select
                      styles={selectStyles}
                      name="globalCategories"
                      options={globalCategory}
                      defaultValue={SelectedGlobalCat}
                      onChange={changeGlobalCat}
                    />
                  </div>
                </>
              )}
            </Card>
          </div>

          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:form-label-storefront')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div className="mb-5">
                <Label>{t('form:form-label-storefront')}</Label>
                <Switch
                  checked={isStorefront}
                  // {...register('show_in_market_place')}
                  onChange={onChangeStorefront}
                  className={`${isStorefront ? 'bg-accent' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                  dir="ltr"
                >
                  <span className="sr-only">Enable </span>
                  <span
                    className={`${isStorefront ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                  />
                </Switch>
              </div>
           
            </Card>
          </div>
          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:input-product-type')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div className="mb-5">
                <Label>{t('form:input-product-type')}</Label>
                <Select
                  isDisabled={initialValues?.id ? true : false}
                  styles={selectStyles}
                  options={productTypeOption}
                  defaultValue={productDefaultArray}
                  menuShouldScrollIntoView={false}
                  onChange={ProductOnChange}
                />
                {/* <ProductTypeInput /> */}
              </div>
            </Card>
          </div>

          {/* Simple Type */}
          {/* {product_type?.value === ProductType.Simple && (
            <ProductSimpleForm initialValues={initialValues} />
          )} */}

          {/* Variation Type */}
          {productTypeDropId == 'variable' ? (
            <>
              <ProductVariableForm
                shopId={shopId}
                initialValues={initialValues}
                setImage={setImages}
                setStatus={setStatus}
                taxValue={taxValue}
                setTaxValues={setTaxValues}
                setExcValues={setExcValues}
                excValues={excValues}
                taxValues={taxValues}
              />
            </>
          ) : (
            <>
              <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
                <Description
                  title={t('form:price')}
                  className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
                />
                <Card className="w-full sm:w-8/12 md:w-2/3">
                  <div className="mb-3">
                    <label className="mb-3 block text-sm font-semibold leading-none text-body-dark">
                      {t('form:form-label-execPrice')}
                    </label>
                    <input
                      {...register('ExecPrice')}
                      value={excPrice}
                      className=" flex h-12 w-full appearance-none items-center rounded border border-border-base px-2 text-sm text-heading transition duration-300 ease-in-out focus:border-accent focus:bg-light focus:shadow focus:outline-none focus:ring-0"
                      type="number"
                      onChange={onChangeExcPrice}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-3 block text-sm font-semibold leading-none text-body-dark">
                      {t('form:form-label-incPrice')}
                    </label>
                    <input
                      {...register('IncPrice')}
                      value={incPrice}
                      className=" flex h-12 w-full appearance-none items-center rounded border border-border-base px-2 text-sm text-heading transition duration-300 ease-in-out focus:border-accent focus:bg-light focus:shadow focus:outline-none focus:ring-0"
                      type="number"
                      onChange={onChangeIncPrice}
                    />
                  </div>
                </Card>
              </div>
            </>
          )}

          <div className="mb-4 text-end">
            {initialValues && (
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
              {initialValues
                ? t('form:button-label-update-product')
                : t('form:button-label-add-product')}
            </Button>
          </div>
        </form>
      </FormProvider>
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
              onClick={onConfirmDelet}
            >
              Yes
            </Button>
          </div>
        </Card>
      </Modal>
      {openDialog && (
        <Modal
          open={openDialog}
          onClose={() => setCloseDialog(true)}
          style={{ width: '45%' }}
        >
          <Card className="mt-4" style={{ width: 400 }}>
            <form onSubmit={handleSubmit(onSubmitTax)}>
              {modelName == 'tax' && (
                <>
                  <label htmlFor="" className="mb-2">
                    <b>Add Tax</b>
                  </label>
                  <div className=" w-full ">
                    <Label className="text-left">
                      {t('form:input-label-name')}
                    </Label>
                    <Input
                      name="name"
                      onChange={(e) => changeTaxInputs(e, 'name')}
                      // error={t(errors.name?.message!)}
                      variant="outline"
                      className="mb-5"
                    />
                    <Label className="text-left">
                      {t('form:input-label-amount')}
                    </Label>
                    <Input
                      name="amount"
                      onChange={(e) => changeTaxInputs(e, 'price')}
                      // error={t(errors.amount?.message!)}
                      variant="outline"
                      className="mb-5"
                    />
                  </div>
                </>
              )}
              {modelName == 'brand' && (
                <>
                  <label htmlFor="" className="mb-2">
                    <b>Add Brand</b>
                  </label>
                  <div className="md:w-10/3 w-full sm:w-10/12">
                    <Label className="text-left">
                      {t('form:input-label-name')}
                    </Label>
                    <Input
                      name="name"
                      onChange={(e) => changeTaxInputs(e, 'name')}
                      // error={t(errors.name?.message!)}
                      variant="outline"
                      className="mb-5"
                    />
                  </div>
                </>
              )}
              {modelName == 'category' && (
                <>
                  <label htmlFor="" className="mb-2">
                    <b>Add Category</b>
                  </label>
                  <div className="md:w-10/3 w-full sm:w-10/12">
                    <Label className="text-left">
                      {t('form:input-label-name')}
                    </Label>
                    <Input
                      name="name"
                      onChange={(e) => changeTaxInputs(e, 'name')}
                      // error={t(errors.name?.message!)}
                      variant="outline"
                      className="mb-5"
                    />
                  </div>
                </>
              )}
              {modelName == 'unit' && (
                <>
                  <label htmlFor="" className="mb-2">
                    <b>Add Unit</b>
                  </label>
                  <div className="md:w-10/3 w-full sm:w-10/12">
                    <Label className="text-left">
                      {t('form:input-label-name')}
                    </Label>
                    <Input
                      name="name"
                      onChange={(e) => changeTaxInputs(e, 'name')}
                      // error={t(errors.name?.message!)}
                      variant="outline"
                      className="mb-5"
                    />
                  </div>
                </>
              )}
              <div className="mt-8 flex justify-end">
                <Button
                  style={{ width: '29%' }}
                  className=" me-4"
                  onClick={onClickClose}
                  variant="outline"
                >
                  Close
                </Button>
                <Button style={{ width: '31%' }} loading={creatingLoading}>
                  Save
                </Button>
              </div>
            </form>
          </Card>
        </Modal>
      )}
    </>
  );
}
