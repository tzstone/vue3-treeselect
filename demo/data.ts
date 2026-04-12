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

// 自定义键名数据 - 用于展示 normalizer 功能
// 使用非标准字段名：key 代替 id，name 代替 label，subItems 代替 children
export const customKeyOptions = [
  {
    key: "dept-1",
    name: "技术部",
    subItems: [
      { key: "team-frontend", name: "前端团队" },
      { key: "team-backend", name: "后端团队" },
      { key: "team-qa", name: "测试团队" },
    ],
  },
  {
    key: "dept-2",
    name: "产品部",
    subItems: [
      { key: "team-product", name: "产品设计" },
      { key: "team-ux", name: "用户体验" },
    ],
  },
  {
    key: "dept-3",
    name: "运营部",
    subItems: [
      { key: "team-marketing", name: "市场推广" },
      { key: "team-sales", name: "销售团队" },
    ],
  },
];

// 带图标的选项数据 - 用于展示 option-label slot 功能
export const optionsWithIcons = [
  {
    id: "category-files",
    label: "文件类型",
    icon: "📁",
    children: [
      { id: "file-doc", label: "文档", icon: "📄", size: "2MB" },
      { id: "file-img", label: "图片", icon: "🖼️", size: "5MB" },
      { id: "file-video", label: "视频", icon: "🎬", size: "100MB" },
    ],
  },
  {
    id: "category-status",
    label: "状态",
    icon: "🏷️",
    children: [
      { id: "status-active", label: "进行中", icon: "🟢", priority: "高" },
      { id: "status-pending", label: "待处理", icon: "🟡", priority: "中" },
      { id: "status-done", label: "已完成", icon: "🔵", priority: "低" },
    ],
  },
];

// 带详细信息的值数据 - 用于展示 value-label slot 功能
export const optionsWithDetails = [
  {
    id: "employee-1",
    label: "张三",
    role: "高级工程师",
    department: "技术部",
    avatar: "👨‍💻",
  },
  {
    id: "employee-2",
    label: "李四",
    role: "产品经理",
    department: "产品部",
    avatar: "👩‍💼",
  },
  {
    id: "employee-3",
    label: "王五",
    role: "UI设计师",
    department: "设计部",
    avatar: "👨‍🎨",
  },
  {
    id: "employee-4",
    label: "赵六",
    role: "测试工程师",
    department: "技术部",
    avatar: "👩‍🔬",
  },
];
