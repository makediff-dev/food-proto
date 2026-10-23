export type QuantityUnit = 'шт' | 'кг';

export type RecipeItem = {
  id: string;
  name: string;
  quantity: number;
  unit: QuantityUnit;
};

export type RecipeSection = {
  id: string;
  name: string;
  items: readonly RecipeItem[];
};

export const DERIVATIVE_SECTIONS: readonly RecipeSection[] = [
  {
    id: 'meat-1',
    name: 'Производные мясного цеха 1',
    items: [
      { id: 'meat-1-a', name: 'Фарш говяжий', quantity: 12, unit: 'кг' },
      { id: 'meat-1-b', name: 'Котлета сырая', quantity: 48, unit: 'шт' },
      { id: 'meat-1-c', name: 'Бульон мясной', quantity: 8.5, unit: 'кг' },
    ],
  },
  {
    id: 'meat-2',
    name: 'Производные мясного цеха 2',
    items: [],
  },
  {
    id: 'bakery-1',
    name: 'Производные пекарни 1',
    items: [
      { id: 'bakery-1-a', name: 'Тесто дрожжевое', quantity: 6, unit: 'кг' },
      { id: 'bakery-1-b', name: 'Булочка для сэндвича', quantity: 120, unit: 'шт' },
    ],
  },
  {
    id: 'bakery-2',
    name: 'Производные пекарни 2',
    items: [],
  },
  {
    id: 'veg-1',
    name: 'Производные овощного цеха 1',
    items: [],
  },
  {
    id: 'veg-2',
    name: 'Производные овощного цеха 2',
    items: [],
  },
  {
    id: 'soup-1',
    name: 'Производные цеха варки супов и каш 1',
    items: [],
  },
  {
    id: 'soup-2',
    name: 'Производные цеха варки супов и каш 2',
    items: [],
  },
  {
    id: 'side-1',
    name: 'Производные цеха гарниров 1',
    items: [],
  },
  {
    id: 'side-2',
    name: 'Производные цеха гарниров 2',
    items: [],
  },
];

export const FINISHED_SECTIONS: readonly RecipeSection[] = [
  {
    id: 'final-1',
    name: 'Готовая продукция завода 1',
    items: [
      { id: 'final-1-a', name: 'Салат Цезарь', quantity: 24, unit: 'шт' },
      { id: 'final-1-b', name: 'Суп куриный', quantity: 36, unit: 'шт' },
      { id: 'final-1-c', name: 'Рис отварной', quantity: 4.2, unit: 'кг' },
    ],
  },
  {
    id: 'final-2',
    name: 'Готовая продукция завода 2',
    items: [],
  },
];
