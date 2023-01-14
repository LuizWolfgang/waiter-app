import React, {useState} from 'react';
import { FlatList  } from 'react-native';
import { Text } from '../Text';
import { Category as CategoryType } from '../../types/Category';
import {
  Category,
  Icon
} from './styles';

interface CategoriesProps {
  categories: CategoryType[];
  onSelectCategory: (categoryId: string) => Promise<void>;

}
export function Categories({ categories, onSelectCategory } : CategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState('');

  function handleSelectedCategoryOpacity(categoryId: string)  {
    const category = categoryId === selectedCategory ? '' : categoryId;

    onSelectCategory(category);
    setSelectedCategory(category);
  }

  return (
    <FlatList
      horizontal
      data={categories}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 24}}
      keyExtractor={category => category._id}
      renderItem={({ item: category}) => {
        const isSelected = selectedCategory === category._id;
        return (
          <Category onPress={() => handleSelectedCategoryOpacity(category._id)}>
            <Icon>
              <Text opacity={ isSelected ? 1 : 0.5} >
                {category.icon}
              </Text>
            </Icon>
            <Text size={14} weight="600" opacity={ isSelected ? 1 : 0.5}>
              {category.name}
            </Text>
          </Category>
        );
      }}
    />
  );
}

