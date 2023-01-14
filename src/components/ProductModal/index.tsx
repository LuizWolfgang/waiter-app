import React from 'react';
import { FlatList, Modal } from 'react-native';

import { Text } from '../../components/Text';

import { Product } from '../../types/Product';

import { Close } from '../Icons/Close';

import { formartCurrency } from '../../utils/formatCurrency';

import {
  Image,
  ModalBody,
  CloseButton,
  Header,
  IngredinetsContainer,
  Ingredient,
  Footer,
  FooterContent,
  PriceContent
} from './styles';
import { Button } from '../Button';

interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  onAddCart: (product: Product) => void;
  product: null | Product;
}

export function ProductModal({ visible, onClose, onAddCart, product }: ProductModalProps) {

  if(!product){
    return null;
  }

  function handleAddCart(product: Product){
    onAddCart(product!);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle='pageSheet'
      onRequestClose={onClose}
    >
      <Image
        source={{
          uri:`http://192.168.1.105:3000/uploads/${product?.imagePath}`
        }}
      >
        <CloseButton onPress={() => onClose()}>
          <Close/>
        </CloseButton>
      </Image>
      <ModalBody>
        <Header>
          <Text size={24} weight="600">{product.name}</Text>
          <Text color="#666" weight="600" style={{ marginTop: 8}}>{product.description}</Text>
        </Header>

        { product.ingredients.length > 0 && (
          <IngredinetsContainer>
            <Text weight="600"> Ingredients</Text>
            <FlatList
              style={{ marginTop: 16}}
              data={product.ingredients}
              keyExtractor={ingredient => ingredient._id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: ingredient}) => (
                <Ingredient>
                  <Text>{ingredient.icon}</Text>
                  <Text size={14} color="#666" style={{ marginLeft: 20}}>{ingredient.name}</Text>
                </Ingredient>
              )}
            />
          </IngredinetsContainer>
        )}

      </ModalBody>
      <Footer>
        <FooterContent>
          <PriceContent>
            <Text color="#666">Preço</Text>
            <Text sixe={20} weight="600">{formartCurrency(product.price)}</Text>
          </PriceContent>

          <Button
            onPress={() => handleAddCart(product)}
            title="Adicionar ao pedido"
          />

        </FooterContent>
      </Footer>
    </Modal>
  );
}

