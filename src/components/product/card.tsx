import Image from 'next/image';
import usePrice from '@/utils/use-price';
import { productPlaceholder } from '@/utils/placeholders';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { AddToCart } from '@/components/cart/add-to-cart/add-to-cart';
import { useTranslation } from 'next-i18next';
import { PlusIcon } from '@/components/icons/plus-icon';
import { Product, ProductType, Subscription } from '@/types';

interface Props {
  item: Subscription;
}

const ProductCard = ({ item }: any) => {
  const { name, price, sale_price } = item ?? {};

  const {
    price: currentPrice,
    basePrice,
    discount,
  } = usePrice({
    amount: sale_price ? sale_price : price!,
    baseAmount: price ?? 0,
  });

  return (
    <div className="cart-type-neon h-full overflow-hidden rounded border border-border-200 bg-light shadow-sm transition-all duration-200 hover:shadow-md">
      <header className="p-3 md:p-6">
        <div className="mb-2 flex flex-col items-center">
          <div className="mb-4 flex  text-xs text-body md:text-sm">
            {name}
          </div>
          <span className="text-sm font-semibold text-heading md:text-base">
            {currentPrice}
          </span>
        </div>
        <>
          <AddToCart variant="neon" data={item} />
        </>
      </header>
    </div>
  );
};

export default ProductCard;
