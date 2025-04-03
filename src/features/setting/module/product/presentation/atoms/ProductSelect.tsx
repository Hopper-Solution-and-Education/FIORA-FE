import SelectField from '@/components/common/atoms/SelectField';
import { useAppDispatch, useAppSelector } from '@/store';
import { setProductIdToTransfer } from '../../slices';

const ProductSelect = () => {
  const dispatch = useAppDispatch();
  const { items: products } = useAppSelector((state) => state.productManagement.products);
  const productIdToTransfer = useAppSelector(
    (state) => state.productManagement.ProductIdToTransfer,
  );
  const handleChangeSelect = (id: string) => {
    dispatch(setProductIdToTransfer(id));
  };

  const options = products.map((product) => ({
    value: product.id,
    label: product.name,
    icon: product.icon,
  }));

  return (
    <SelectField
      name={''}
      value={productIdToTransfer}
      onChange={handleChangeSelect}
      options={options}
      placeholder="Select a Product"
    />
  );
};

export default ProductSelect;
