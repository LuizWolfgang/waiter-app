import React, { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { api } from '../../services/api';
import { CartItem } from '../../types/CartItem';
import { Product } from '../../types/Product';

import { formartCurrency } from '../../utils/formatCurrency';
import { Button } from '../Button';

import { MinusCircle } from '../Icons/MinusCircle';
import { PlusCircle } from '../Icons/PlusCircle';
import { OrderConfirmedModal } from '../OrderConfirmedModal';

import { Text } from '../Text';

import {
  Item,
  ProductContainer,
  Actions,
  Image,
  QuantityContainer,
  ProductDetails,
  Summary,
  TotalContainer
} from './styles';

interface CartProps {
  cartItems: CartItem[];
  onAdd: (product: Product) => void;
  onDecrement:(product: Product) => void;
  onConfirmOrder:() => void;
  selectedTable: string;
}

export function Cart({cartItems, onAdd, onDecrement, onConfirmOrder, selectedTable}: CartProps){
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //total: multiplicar a quantidade pelo preco unitario de cada produto e sempre somando as multiplicacoes anteriores
  const total = cartItems.reduce((acc, cartItem) => {
    return acc + cartItem.quantity * cartItem.product.price;
  }, 0);

  async function handleConfirmOrder(){
    setIsLoading(true);

    const payload = {
      table: selectedTable,
      products: cartItems.map((cartItem) => ({
        product: cartItem.product._id,
        quantity: cartItem.quantity
      }))
    };

    setIsLoading(false);

    await api.post('/orders', payload)
      .then(() => {
        console.log('order ok');
        setIsModalVisible(true);
      })
      .catch((error) => {
        console.log('Post order:', error);
        alert('Internal server error');
      });

    setIsLoading(false);
  }

  function handleOk() {
    onConfirmOrder();
    setIsModalVisible(false);
  }

  return (
    <>
      <OrderConfirmedModal
        visible={isModalVisible}
        onOk={handleOk}
      />
      {cartItems.length > 0 && (
        <FlatList
          data={cartItems}
          keyExtractor={cartItem => cartItem.product._id}
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 20, maxHeight: 150}}
          renderItem={({ item: cartItem}) => (
            <Item>
              <ProductContainer>
                <Image
                  source={{
                    uri:`http://192.168.1.105:3000/uploads/${cartItem.product.imagePath}`
                  }}/>

                <QuantityContainer>
                  <Text size={14} color="#666">
                    {cartItem.quantity}x
                  </Text>
                </QuantityContainer>

                <ProductDetails>
                  <Text size={14} weight="600">{cartItem.product.name}</Text>
                  <Text size={14} color="#666"
                    style={{ marginTop: 4}}>
                    {formartCurrency(cartItem.product.price)}
                  </Text>
                </ProductDetails>
              </ProductContainer>
              <Actions>
                <TouchableOpacity
                  style={{ marginRight: 24}}
                  onPress={() => onAdd(cartItem.product)}
                >
                  <PlusCircle/>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onDecrement(cartItem.product)}
                >
                  <MinusCircle/>
                </TouchableOpacity>
              </Actions>
            </Item>
          )}
        />
      )}
      <Summary>
        <TotalContainer>
          {cartItems.length > 0 ? (
            <>
              <Text color="#666">Total</Text>
              <Text size={20} weight="600">{formartCurrency(total)}</Text>
            </>
          )
            : (
              <Text color="#999">Seu carrinho está vazio</Text>
            )
          }
        </TotalContainer>

        <Button title="Confirmar pedido"
          onPress={() => handleConfirmOrder()}
          disabled={cartItems.length === 0}
          loading={isLoading}
        />
      </Summary>
    </>
  );
}
