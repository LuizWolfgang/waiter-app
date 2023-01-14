import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Product as Products} from '../../types/Product';
import { formartCurrency } from '../../utils/formatCurrency';
import { PlusCircle } from '../Icons/PlusCircle';
import { ProductModal } from '../ProductModal';
import { Text } from '../Text';

import {
  Product,
  Image,
  ProductsDetails,
  Separator,
  AddToCartButton
} from './styles';

interface MenuProps {
  onAddCart: (product: Products) => void;
  product: Products[];
}
export function Menu({ onAddCart, product }: MenuProps){
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<null | Products>(null);


  function handleOpenModal(product: Products){
    setIsModalVisible(true);
    setSelectedProduct(product);
  }

  function handleAddCart(product: Products) {
    onAddCart(product);
  }

  return (
    <>
      <ProductModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        product={selectedProduct}
        onAddCart={handleAddCart}
      />
      <FlatList
        data={product}
        style={{ marginTop: 32}}
        contentContainerStyle={{ paddingHorizontal: 24}}
        ItemSeparatorComponent={Separator}
        keyExtractor={product => product._id}
        renderItem={({item: product}) => (
          <Product onPress={() => handleOpenModal(product)}>
            <Image
              source={{
                uri: `http://192.168.1.105:3000/uploads/${product.imagePath}`
              }}
            />
            <ProductsDetails>
              <Text weight="600">{product.name}</Text>
              <Text size={14} color="#666" style={{ marginVertical: 8}}>
                {product.description}
              </Text>
              <Text size={14} weight="600">{formartCurrency(product.price)}</Text>
            </ProductsDetails>

            <AddToCartButton onPress={() => onAddCart(product)}>
              <PlusCircle/>
            </AddToCartButton>
          </Product>
        )}
      />
    </>
  );
}
