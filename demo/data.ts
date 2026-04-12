export interface TreeselectOption {
  id: string | number;
  label: string;
  children?: TreeselectOption[];
  isDisabled?: boolean;
  isBranch?: boolean;
  isLeaf?: boolean;
  noChildren?: boolean;
}

export const simpleOptions: TreeselectOption[] = [
  {
    id: "fruits",
    label: "Fruits",
    children: [
      {
        id: "apple",
        label: "Apple 🍎",
        isNew: true,
      },
      {
        id: "grapes",
        label: "Grapes 🍇",
      },
      {
        id: "pear",
        label: "Pear 🍐",
      },
      {
        id: "strawberry",
        label: "Strawberry 🍓",
      },
      {
        id: "watermelon",
        label: "Watermelon 🍉",
      },
    ],
  },
  {
    id: "vegetables",
    label: "Vegetables",
    children: [
      {
        id: "corn",
        label: "Corn 🌽",
      },
      {
        id: "carrot",
        label: "Carrot 🥕",
      },
      {
        id: "eggplant",
        label: "Eggplant 🍆",
      },
      {
        id: "tomato",
        label: "Tomato 🍅",
      },
    ],
  },
];

export const nestedOptions: TreeselectOption[] = [
  {
    id: "region-a",
    label: "Region A",
    children: [
      {
        id: "city-a1",
        label: "City A1",
        children: [
          { id: "district-a1-1", label: "District A1-1" },
          { id: "district-a1-2", label: "District A1-2" },
        ],
      },
      {
        id: "city-a2",
        label: "City A2",
        children: [
          { id: "district-a2-1", label: "District A2-1" },
          { id: "district-a2-2", label: "District A2-2" },
        ],
      },
    ],
  },
  {
    id: "region-b",
    label: "Region B",
    children: [
      {
        id: "city-b1",
        label: "City B1",
        children: [
          { id: "district-b1-1", label: "District B1-1" },
          { id: "district-b1-2", label: "District B1-2" },
        ],
      },
    ],
  },
];

export const optionsWithDisabled: TreeselectOption[] = [
  {
    id: "group-1",
    label: "Group 1",
    children: [
      { id: "item-1-1", label: "Item 1-1" },
      { id: "item-1-2", label: "Item 1-2 (disabled)", isDisabled: true },
      { id: "item-1-3", label: "Item 1-3" },
    ],
  },
  {
    id: "group-2",
    label: "Group 2 (disabled)",
    isDisabled: true,
    children: [
      { id: "item-2-1", label: "Item 2-1" },
      { id: "item-2-2", label: "Item 2-2" },
    ],
  },
  {
    id: "group-3",
    label: "Group 3",
    children: [
      { id: "item-3-1", label: "Item 3-1" },
      { id: "item-3-2", label: "Item 3-2" },
    ],
  },
];

export const flatOptions: TreeselectOption[] = [
  { id: "option-1", label: "Option 1" },
  { id: "option-2", label: "Option 2" },
  { id: "option-3", label: "Option 3" },
  { id: "option-4", label: "Option 4" },
  { id: "option-5", label: "Option 5" },
  { id: "option-6", label: "Option 6" },
  { id: "option-7", label: "Option 7" },
  { id: "option-8", label: "Option 8" },
];

export const customLabelOptions: TreeselectOption[] = [
  {
    id: "person-1",
    label: "Person 1",
    children: [
      { id: "person-1-1", label: "Person 1-1" },
      { id: "person-1-2", label: "Person 1-2" },
    ],
  },
  {
    id: "person-2",
    label: "Person 2",
    children: [
      { id: "person-2-1", label: "Person 2-1" },
      { id: "person-2-2", label: "Person 2-2" },
    ],
  },
];

export const valueFormatterOptions: TreeselectOption[] = [
  {
    id: "product-1",
    label: "Product 1 ($10.00)",
    children: [
      { id: "variant-1-1", label: "Variant A ($5.00)" },
      { id: "variant-1-2", label: "Variant B ($7.50)" },
    ],
  },
  {
    id: "product-2",
    label: "Product 2 ($20.00)",
    children: [
      { id: "variant-2-1", label: "Variant C ($12.00)" },
      { id: "variant-2-2", label: "Variant D ($15.00)" },
    ],
  },
];
