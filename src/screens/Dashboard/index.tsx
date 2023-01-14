import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

import { Button } from '../../components/Button';
import { Cart } from '../../components/Cart';
import { Categories } from '../../components/Categories';
import { Header } from '../../components/Header';
import { Text } from '../../components/Text';
import { Menu } from '../../components/Menu';
import { TableModal } from '../../components/TableModal';
import { ActivityIndicator } from 'react-native';
import { Empty } from '../../components/Icons/Empty';

import { CartItem } from '../../types/CartItem';
import { Product } from '../../types/Product';
import { Category } from '../../types/Category';

import {
  Container,
  CategoriesContainer,
  CenteredContainer,
  MenuContainer,
  Footer,
  FooterContent
} from './styles';

export function Dashboard(){
  const [isTableModalVisible, setIsTableModalVisible] = useState(false);
  const [selectedTable, setselectedTable] = useState('');
  const [cartItems, setcartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/products')
    ]).then(([categoriesResponse, productsResponse]) => {
      setCategories(categoriesResponse.data);
      setProducts(productsResponse.data);
      setIsLoading(false);
    }).catch((error) => {
      console.log('Request error:', error.message);
    });
  }, []); //quando o array de dependencia esta vazio e executado somente uma vez, quando renderizado em tela

  async function handleSelectCategory(categoryId: string){
    const route = !categoryId
      ? '/products'
      : `/categories/${categoryId}/products`;

    setIsLoadingProducts(true);

    await api.get(route)
      .then((response) => {
        setProducts(response.data);
        setIsLoadingProducts(false);
        console.log(JSON.stringify(response.data, null, 2));
      })
      .catch((error) => {
        console.log('Categories:', error.message);
      });
  }

  function handleSaveTable(table: string): void {
    setselectedTable(table);
    setIsTableModalVisible(false);
  }

  function handleResetOrder(){
    setselectedTable('');
    setcartItems([]);
  }

  function handleAddCart(product: Product) {
    if(!selectedTable){
      setIsTableModalVisible(true);
    }

    setcartItems((prevState) => {
      const itemIndex = prevState.findIndex(
        cartItem => cartItem.product._id === product._id
      );

      if(itemIndex < 0){ //menor que 0 nao encontrou nenhum no find
        return prevState.concat({
          quantity:1,
          product,
        });
      }
      //adiconando a quantity ao carrinho
      const newCartItems = [...prevState];
      const item = newCartItems[itemIndex];

      newCartItems[itemIndex] = {
        ...item,
        quantity: item.quantity + 1
      };

      return newCartItems;
    });
  }

  function handleDecrementCartItem(product: Product){
    setcartItems((prevState) => {
      //buscando o index que seja igual ao que o usuario selecionou
      const itemIndex = prevState.findIndex(
        cartItem => cartItem.product._id === product._id
      );

      const item = prevState[itemIndex];
      const newCartItems = [...prevState];

      if (item.quantity === 1){
        newCartItems.splice(itemIndex, 1);
        return newCartItems;
      }

      newCartItems[itemIndex] = {
        ...item,
        quantity: item.quantity - 1
      };

      return newCartItems;
    });
  }

  return (
    <>
      <Container>
        <Header
          selectedTable={selectedTable}
          onCancelOrder={handleResetOrder}
        />
        {isLoading && (
          <CenteredContainer>
            <ActivityIndicator color="#D73035" size="large"/>
          </CenteredContainer>
        )}

        {!isLoading && (
          <>
            <CategoriesContainer>
              <Categories
                categories={categories}
                onSelectCategory={handleSelectCategory}
              />
            </CategoriesContainer>

            {isLoadingProducts ? (
              <CenteredContainer>
                <ActivityIndicator color="#D73035" size="large"/>
              </CenteredContainer>
            ) : (
              <>
                {products?.length > 0 ? (
                  <MenuContainer>
                    <Menu
                      onAddCart={handleAddCart}
                      product={products}
                    />
                  </MenuContainer>
                ) : (
                  <CenteredContainer>
                    <Empty/>
                    <Text color="#666" style={{ marginTop: 24}}>
                    Nenhum produto foi encontrado
                    </Text>
                  </CenteredContainer>
                )}
              </>
            )}
          </>
        )}
      </Container>
      <Footer>
        {/* <FooterContent> */}
        {
          !selectedTable && (
            <Button title="Novo pedido"
              onPress={() => setIsTableModalVisible(true)}
              disabled={isLoading}
            />
          )
        }

        {
          selectedTable && (
            <Cart
              cartItems={cartItems}
              onAdd={handleAddCart}
              onDecrement={handleDecrementCartItem}
              onConfirmOrder={handleResetOrder}
              selectedTable={selectedTable}
            />
          )
        }
        {/* </FooterContent> */}
      </Footer>

      <TableModal
        visible={isTableModalVisible}
        onClose={() => setIsTableModalVisible(false)}
        onSave={handleSaveTable}
      />
    </>
  );
}
