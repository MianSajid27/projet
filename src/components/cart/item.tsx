import Image from 'next/image';
import { motion } from 'framer-motion';
import Counter from '@/components/ui/counter';
import { CloseIcon } from '@/components/icons/close-icon';
import { fadeInOut } from '@/utils/motion/fade-in-out';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/contexts/quick-cart/cart.context';
import usePrice from '@/utils/use-price';
import React, { useState } from 'react';
import Input from '../ui/input';
import DrawerWrapper from '@/components/ui/drawer-wrapper';
import Drawer from '@/components/ui/drawer';
import Button from '@/components/ui/button';
import { log } from 'console';
import { resetPaymentCart } from '@/contexts/quick-cart/cart.utils';
import { toast } from 'react-toastify';
import Select from '../ui/select/select';
import {
  AddingFunction,
  AddingUserFunction,
  GetFunction,
} from '@/services/Service';
import Label from '../ui/label';
import { Switch } from '@headlessui/react';
import { selectStyles } from '../ui/select/select.styles';

interface CartItemProps {
  item: any;
  onCrossIcoIncPress?: any;
  onCrossIcoDecPress?: any;
}

const CartItem = ({
  item,
  onCrossIcoIncPress,
  onCrossIcoDecPress,
}: CartItemProps) => {
  const [currency, setCurrency] = React.useState<any>();
  const { t } = useTranslation('common');
  const { isInStock, clearItemFromCart, addItemToCart, removeItemFromCart } =
    useCart();
  const [discountModal, setdiscountModal] = useState<any>(false);
  const [LotModal, setLotModal] = useState<any>(false);
  const [discountVal, setDiscountVal] = useState<any>();
  const [percentageValue, setPercentageValue] = useState<any>();
  const [netTotalValue, setNetTotalValue] = useState<any>();
  const [lotNumberArray, setLotNumberArrray] = useState<any>([]);
  const [lotNumber, setLotNumber] = useState<any>([]);
  const [lotQuantity, setLotQuantity] = useState<any>();
  const [lotName, setLotName] = useState<any>('');
  const [incSwitch, setincSwitch] = useState<any>(false);

  const [taxValID, setTaxValID] = useState<any>('');
  const [TaxAmount, setTaxAmount] = useState<any>(0);
  const [defaultUnitPrise, setDefaultUnitPrise] = React.useState<any>(0);
  const [defaultIncPrise, setDefaultIncPrise] = React.useState<any>(0);
  const [taxArray, setTaxDataArray] = useState<any>([]);

  const businessDetail = JSON.parse(
    localStorage.getItem('user_business_details')!
  );
  React.useEffect(() => {
    let obj = {
      product_id: item.productId,
      variation_id: item.variationsId,
    };
    AddingUserFunction('/purchase/lot-numbers', obj).then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.lot_number,
          label: data.lot_number,
          quantity: data.quantity,
        };
      });
      setLotNumberArrray(ordersData);
    });
    GetFunction('/tax').then((result) => {
      console.log(result);

      let datas = result.data.map((data, i) => {
        return {
          id: data.id,
          value: data.amount,
          label: data.name,
        };
      });
      datas.unshift({})
      setTaxDataArray(datas);
    });
  }, []);

  const { price } = usePrice({
    amount: item?.price,
  });
  const { price: itemPrice } = usePrice({
    amount: item.itemTotal,
  });
  React.useEffect(() => {
    let businessDetails: any = localStorage.getItem('business_details');
    setCurrency(JSON.parse(businessDetails));
  }, []);

  function handleIncrement(e: any) {
    let quantity = Math.round(item.product_qty);
    let item_quantity = item.quantity + 1;
    if (item.enable_stock == 0) {
      onCrossIcoIncPress();
      e.stopPropagation();
      addItemToCart(item, 1);
    } else {
      if (item_quantity > lotQuantity) {
        toast.error(
          t('Only ' + lotQuantity + ' pieces is available in the selected lot'),
          {
            autoClose: 5000,
          }
        );
      } else {
        if (item_quantity > quantity) {
          toast.error(item.name + t('common:out-of-stock'), {
            autoClose: 5000,
          });
        } else {
          onCrossIcoIncPress();
          e.stopPropagation();
          addItemToCart(item, 1);
        }
      }
    }
  }
  const onChangeSwitch = () => {
    setincSwitch((value: any) => !value);
  };

  const TaxOnChange = (e) => {
    setTaxAmount(e.target.value);
    setTaxValID(e.id);
    let incPrice = defaultUnitPrise * (1 + e.target.value / 100);
    let obj: any = item;
    obj.price = Number(incPrice).toFixed(2);
    obj.product_tax_percentage = e.target.value;
    addItemToCart(obj, 0);
  };
  const onChangeUnitPrise = (e) => {
    console.log(TaxAmount);

    let val = e.target.value;
    let incPrice = val * (1 + TaxAmount / 100);
    setDefaultUnitPrise(val);
    let obj: any = item;
    obj.unit_price = Number(val);
    obj.price = Number(incPrice).toFixed(2);
    addItemToCart(obj, 0);
  };
  const onChangeIncPrise = (e) => {
    let obj: any = item;

    let val = e.target.value;
    let incPrice = val / (1 + TaxAmount / 100);
    setDefaultIncPrise(val);
    obj.price = Number(val);
    obj.unit_price = Number(incPrice).toFixed(2);
    addItemToCart(obj, 0);
  };

  const handleRemoveClick = (e: any) => {
    onCrossIcoDecPress();
    e.stopPropagation();
    removeItemFromCart(item.id);
  };

  const onValueDiscountChange = (e) => {
    setDiscountVal(e.target.value);
    let netValue = item.unit_price;
    let percentageVal: any = (e.target.value / netValue) * 100;
    setPercentageValue(percentageVal.toFixed(2));

    let netTotal =
      (item.unit_price - e.target.value) *
      (1 + item.product_tax_calculate / 100);
    setNetTotalValue(netTotal.toFixed(2));
  };

  const onPercentageDiscountChange = (e) => {
    setPercentageValue(e.target.value);
    let netValue = item.unit_price;
    let percentageVal: any = (netValue / 100) * e.target.value;
    setDiscountVal(percentageVal);

    let netTotal =
      (item.unit_price - percentageVal) * (1 + item.product_tax / 100);
    setNetTotalValue(netTotal.toFixed(2));
  };

  const onNetTotalChange = (e) => {
    setNetTotalValue(e.target.value);

    let netValue = item.price;
    let percentageVal: any = 100 - (e.target.value / netValue) * 100;
    setPercentageValue(percentageVal.toFixed(2));

    let newwwwwv = (item.unit_price * percentageVal) / 100;
    setDiscountVal(newwwwwv.toFixed(2));

    if (e.target.value.length == 0) {
      setDiscountVal('');
      setPercentageValue('');
    }
  };
  const { discountValue } = useCart();

  const onAddButtonCLick = () => {
    let obj: any = item;

    obj.discount = discountVal;
    obj.quantity = item.quantity;
    addItemToCart(obj, 0);
    setdiscountModal(false);
  };
  const onChangeLot = (e) => {
    console.log(e);

    setLotNumber(e.id);
    setLotQuantity(e.quantity);
    setLotName(e.value);
  };
  const onAddLotButtonCLick = () => {
    let obj: any = item;
    obj.lotNumber = lotNumber;
    addItemToCart(obj, 0);
    setLotModal(false);
  };

  let priceValue = item.unit_price * Number(item.quantity);
  let incPriceValue = item.price * Number(item.quantity);

  // const random = () =>{
  // if (item.type == 'CustomProduct') {
  //   let prices = defaultUnitPrise;
  //   let tax = TaxAmount;
  //   let has_inc_tax = incSwitch;
  //   let unit_price;
  //   let sell_price_inc_tax;
  //   let tax_value;

  //   if (has_inc_tax) {
  //     unit_price = prices / (1 + tax / 100);
  //     sell_price_inc_tax = prices;
  //     tax_value = sell_price_inc_tax - unit_price;
  //   } else {
  //     sell_price_inc_tax = prices * (1 + tax / 100);
  //     unit_price = prices;
  //     tax_value = sell_price_inc_tax - unit_price;
  //   }

  //   let obj: any = item;
  //   obj.price = sell_price_inc_tax;
  //   obj.unit_price = unit_price;
  //   obj.sell_price_inc_tax = sell_price_inc_tax;
  //   obj.price_w_tax = tax_value;
  //   obj.product_tax = tax_value;

  //   console.log(obj);
  //   // addItemToCart(obj, 0);
  // }
  // }
  console.log(item);

  return (
    <motion.div
      layout
      initial="from"
      animate="to"
      exit="from"
      variants={fadeInOut(0.25)}
      className="flex items-center border-b border-solid border-border-200 border-opacity-75 py-4 px-4 text-sm sm:px-6"
    >
      <div className="flex-shrink-0">
        <Counter
          value={item.quantity}
          onDecrement={handleRemoveClick}
          onIncrement={handleIncrement}
          variant="pillVertical"
          disabled={false}
        />
      </div>

      <div className="relative mx-4 flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden bg-gray-100 sm:h-16 sm:w-16">
        <Image
          src={item?.image ?? '/'}
          loader={() => item?.image}
          alt="no image"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div>
        <h3 className="font-bold text-heading">{item.name}</h3>
        <div className="flex">
          {item.type != 'CustomProduct' && (
            <p className="my-2.5 mr-2 font-semibold text-accent">
              <span className="font-bold text-heading">
                {t('Taxable Price:')}{' '}
              </span>
              {Number(item.unit_price * Number(item.quantity)).toFixed(2) +
                currency?.symbol}
              {/* <input
                onChange={onPriceChange}
                value={priceValue}
                className=" h-8 w-20 rounded border-2 p-2"
              /> */}
            </p>
          )}
          {item.type != 'CustomProduct' && (
            <p className="my-2.5 font-semibold text-accent">
              <span className="pr-1 font-bold text-heading">
                {t('common:text-tax')}
              </span>
              {Number(item.product_tax * Number(item.quantity)).toFixed(2) +
                currency?.symbol}
            </p>
          )}
          {item.type == 'CustomProduct' && (
            <>
              <div className="my-2.5 font-semibold text-accent">
                <span className="font-bold text-heading">{t(' Price:')}</span>
                <input
                  onChange={onChangeUnitPrise}
                  value={priceValue || defaultUnitPrise}
                  className=" h-8 w-20 rounded border-2 p-2"
                />
              </div>
            </>
          )}
          {item.type == 'CustomProduct' && (
            <>
              <div className="my-2.5 font-semibold text-accent">
                <span className="font-bold text-heading">Tax:</span>
                <select  onChange={TaxOnChange} className=" h-8 w-20 rounded border-2 ">
                  {taxArray.map((res, index) => (
                    <option value={res.value} key={index}>
                      {res.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="my-2.5 ml-3 font-semibold text-accent">
                <span className="font-bold text-heading">{t('Inc Tax:')}</span>
                <input
                  onChange={onChangeIncPrise}
                  value={incPriceValue || defaultIncPrise}
                  className=" h-8 w-20 rounded border-2 p-2"
                />
              </div>
            </>
          )}
        </div>
        <div className="flex">
          {item.type != 'CustomProduct' && (
            <>
              <p
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => setdiscountModal(true)}
                className="pt-0 "
              >
                {t('common:add-discount')}
              </p>
              <span className="pl-2 font-semibold text-accent">
                {Number(item.discount) * Number(item.quantity) +
                  currency?.symbol}
              </span>
            </>
          )}
          {item.type == 'CustomProduct' && (
            <div className='flex justify-end'>
              <p
                className="pt-0 font-semibold text-accent"
              >
                Total Price:
              </p>
              <span className="pl-2 font-semibold text-accent">
                {incPriceValue + currency?.symbol}
              </span>
            </div>
          )}

          {businessDetail.enable_lot_number == 1 &&
            item.type != 'CustomProduct' && (
              <>
                <p
                  style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={() => setLotModal(true)}
                  className="ml-4 pt-0"
                >
                  {t('Lot Number  ')}
                </p>
                <span className="pl-2 font-semibold text-accent">
                  {lotName}
                </span>
              </>
            )}
        </div>
      </div>
      {item.type != 'CustomProduct' && (
        <span className="font-bold text-heading ms-auto">{itemPrice}</span>
      )}

      <div onClick={onCrossIcoDecPress}>
        <button
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 -me-2 ms-3 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none"
          onClick={() => clearItemFromCart(item.id)}
        >
          <span className="sr-only">{t('text-close')}</span>
          <CloseIcon className="h-3 w-3" />
        </button>
      </div>
      <Drawer
        open={discountModal}
        onClose={() => setdiscountModal(true)}
        variant="right"
      >
        <DrawerWrapper
          onClose={() => setdiscountModal(false)}
          hideTopBar={false}
        >
          <div className="m-auto rounded bg-light sm:w-[28rem]">
            <div className="p-4">
              <div style={{ textAlign: 'left', width: '100%' }}>
                <p className="my-2.5  font-semibold text-accent">
                  <p className=" font-bold text-heading">
                    {t('common:unit-price')}{' '}
                  </p>
                  <Input
                    disabled
                    value={Number(item.unit_price).toFixed(2)}
                    className="w-auto"
                    name=""
                  />
                </p>
                <p className="my-2.5  font-semibold text-accent">
                  <p className=" font-bold text-heading">
                    {t('common:value-discount')}{' '}
                  </p>
                  <Input
                    value={discountVal}
                    onChange={onValueDiscountChange}
                    className="w-auto"
                    name=""
                  />
                </p>
                <p className="my-2.5  font-semibold text-accent">
                  <p className=" font-bold text-heading">
                    {t('common:percentage-discount')}
                  </p>
                  <Input
                    value={percentageValue}
                    onChange={onPercentageDiscountChange}
                    className="w-auto"
                    name=""
                  />
                </p>
                <p className="my-2.5  font-semibold text-accent">
                  <p className=" font-bold text-heading">
                    {t('common:net-Value')}
                  </p>
                  <Input
                    value={Number(netTotalValue).toFixed(2)}
                    onChange={onNetTotalChange}
                    className="w-auto"
                    name=""
                  />
                </p>
              </div>
              <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setdiscountModal(false)}
                    className="rounded-md border p-2"
                  >
                    {t('common:text-close')}
                  </button>
                  <Button
                    onClick={onAddButtonCLick}
                    className="rounded-md border p-2"
                  >
                    {t('common:text-add')}
                  </Button>
                </div>
              </footer>
            </div>
          </div>
        </DrawerWrapper>
      </Drawer>
      <Drawer open={LotModal} onClose={() => setLotModal(true)} variant="right">
        <DrawerWrapper onClose={() => setLotModal(false)} hideTopBar={false}>
          <div className="m-auto rounded bg-light sm:w-[28rem]">
            <div className="p-4">
              <div style={{ textAlign: 'left', width: '100%' }}>
                <p className="my-2.5  font-semibold text-accent">
                  <p className=" font-bold text-heading">{t('Lot Number')}</p>
                  <Select options={lotNumberArray} onChange={onChangeLot} />
                </p>
              </div>
              <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setLotModal(false)}
                    className="rounded-md border p-2"
                  >
                    {t('common:text-close')}
                  </button>
                  <Button
                    onClick={onAddLotButtonCLick}
                    className="rounded-md border p-2"
                  >
                    {t('common:text-add')}
                  </Button>
                </div>
              </footer>
            </div>
          </div>
        </DrawerWrapper>
      </Drawer>
    </motion.div>
  );
};

export default CartItem;
