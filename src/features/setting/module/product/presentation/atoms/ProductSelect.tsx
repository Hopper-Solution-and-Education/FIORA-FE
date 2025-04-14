import { SelectField } from '@/components/common/atoms';
import { useAppDispatch, useAppSelector } from '@/store';
import { isEmpty } from 'lodash';
import { setProductIdToTransfer } from '../../slices';
import Link from 'next/link';

type ProductSelectType = {
  productId?: string;
};

const ProductSelect = ({ productId }: ProductSelectType) => {
  const dispatch = useAppDispatch();
  const { items: products } = useAppSelector((state) => state.productManagement.products);
  const productIdToTransfer = useAppSelector(
    (state) => state.productManagement.ProductIdToTransfer,
  );
  const handleChangeSelect = (id: string) => {
    dispatch(setProductIdToTransfer(id));
  };

  // chắc chắn rằng product được chọn để transfer không phải là product hiện tại
  const productFiltered = products.filter((product) => product.id !== productId);

  const options = productFiltered.map((product) => ({
    value: product.id,
    label: product.name,
    icon: product.icon,
  }));

  return (
    <>
      {isEmpty(productFiltered) ? (
        <div className="text-center py-10 px-4 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
          <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
            No products available to transfer.
          </p>
          <Link
            href="/setting/product/create"
            className="inline-block px-6 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
          >
            Create a new product
          </Link>
        </div>
      ) : (
        <SelectField
          name={''}
          value={productIdToTransfer}
          onChange={handleChangeSelect}
          options={options}
          placeholder="Select a Product"
        />
      )}
    </>
  );
};

export default ProductSelect;
