# FamilyHub - Development Guide

## Architecture Overview

### State Management Pattern (Redux)

Each feature module follows the same Redux pattern:

```typescript
// 1. Define Types/Interfaces
export interface ItemType {
  id: number;
  name: string;
  // ... other fields
}

interface ItemState {
  items: ItemType[];
  loading: boolean;
  error: string | null;
}

// 2. Create Async Thunks
export const fetchItems = createAsyncThunk('items/fetch', async () => {
  const res = await apiClient.get<ItemType[]>('/Items/GetAll');
  return res.data;
});

// 3. Create Redux Slice
const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    // Handle async thunk results
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  }
});

// 4. Export Actions and Reducer
export const { clearError } = itemSlice.actions;
export default itemSlice.reducer;
```

## Component Patterns

### Page Components
Located in `src/pages/`, these are full-page components:

```typescript
const FeaturePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(state => state.feature);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchData() as any);
  }, [dispatch]);

  const handleAdd = async (formData) => {
    try {
      await dispatch(addData(formData) as any).unwrap();
      setShowForm(false);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="feature-container">
      {/* Page content */}
    </div>
  );
};
```

### Card Components
Reusable display components for individual items:

```typescript
interface CardProps {
  item: ItemType;
  onEdit: () => void;
  onDelete: () => void;
}

const ItemCard: React.FC<CardProps> = ({ item, onEdit, onDelete }) => {
  return (
    <div className="item-card">
      {/* Card content */}
      <div className="item-actions">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};
```

### Form Components
All forms use Formik + Yup for validation:

```typescript
interface FormProps {
  initialData?: ItemType;
  onSubmit: (data: ItemData) => void;
  onCancel: () => void;
}

const ItemForm: React.FC<FormProps> = ({ initialData, onSubmit, onCancel }) => {
  return (
    <Formik
      initialValues={/* ... */}
      validationSchema={Yup.object().shape({
        field: Yup.string().required('Required')
      })}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="form">
          {/* Form fields */}
        </Form>
      )}
    </Formik>
  );
};
```

## File Organization

### Redux Slices (`src/state/features/`)
Each feature has its own directory with a slice file:

```
features/
├── family/
│   └── familySlice.ts
├── events/
│   └── eventSlice.ts
├── tasks/
│   └── taskSlice.ts
├── budget/
│   └── budgetSlice.ts
├── photos/
│   └── photoSlice.ts
└── profiles/
    └── profileSlice.ts
```

### Pages (`src/pages/`)
Full-page components for each feature:
- Dashboard.tsx
- FamilyMembers.tsx
- Events.tsx
- Tasks.tsx
- Budget.tsx
- PhotoGallery.tsx

### Components (`src/components/`)
Reusable UI components:
- Card components (MemberCard, EventCard, etc.)
- PhotoGrid (gallery display)
- Navigation (main navigation bar)
- `forms/` subdirectory with form components

## Adding a New Feature

### Step 1: Create Redux Slice
```typescript
// src/state/features/newfeature/newfeatureSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/axios';

// Define types
export interface NewItem {
  id: number;
  // ... fields
}

// Create thunks
export const fetchItems = createAsyncThunk('feature/fetch', async () => {
  const res = await apiClient.get<NewItem[]>('/Endpoint/GetAll');
  return res.data;
});

// Create slice
const slice = createSlice({
  name: 'feature',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  }
});

export default slice.reducer;
```

### Step 2: Register in Store
```typescript
// src/state/store/store.ts
import featureReducer from '../features/newfeature/newfeatureSlice';

export const store = configureStore({
  reducer: {
    // ... other reducers
    feature: featureReducer
  }
});
```

### Step 3: Create Page Component
```typescript
// src/pages/Feature.tsx
import { useAppDispatch, useAppSelector } from '../../state/hooks/hook';
import { fetchItems } from '../../state/features/feature/featureSlice';

const FeaturePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(state => state.feature);

  useEffect(() => {
    dispatch(fetchItems() as any);
  }, [dispatch]);

  return (
    <div className="feature-container">
      {/* Page content */}
    </div>
  );
};
```

### Step 4: Create UI Components
```typescript
// src/components/ItemCard.tsx
const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return <div className="item-card">{/* ... */}</div>;
};

// src/components/forms/ItemForm.tsx
const ItemForm: React.FC<ItemFormProps> = ({ onSubmit, onCancel }) => {
  return <Form className="form">{/* ... */}</Form>;
};
```

### Step 5: Add Routes
```typescript
// src/routes/approutes.tsx
import Feature from '../pages/Feature';

<Route path="/feature" element={<Feature />} />
```

### Step 6: Add Navigation Link
```typescript
// src/components/Navigation.tsx
const navItems = [
  // ... existing items
  { path: '/feature', label: 'Feature', icon: '🎯' }
];
```

## Styling Guide

### CSS Architecture
- Global styles in `src/index.css`
- Component-specific styles inline or in same directory
- CSS variables for theming

### CSS Variables
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #2ecc71;
  --danger-color: #e74c3c;
  --warning-color: #f39c12;
  --info-color: #3498db;
  --light-bg: #f8f9fa;
  --dark-text: #2c3e50;
  --border-color: #ecf0f1;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}
```

### Responsive Design
```css
/* Mobile first approach */
.container {
  grid-template-columns: 1fr;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## API Integration

### Axios Configuration
```typescript
// src/api/axios.ts
const apiClient = axios.create({
  baseURL: 'https://api.example.com/api'
});

// Request interceptor (adds auth token)
apiClient.interceptors.request.use(async (config) => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    const { accessToken } = await msalInstance.acquireTokenSilent({
      scopes: ['api://...'],
      account: accounts[0]
    });
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
```

### Error Handling
```typescript
// In Redux thunks
export const fetchData = createAsyncThunk(
  'feature/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/Endpoint');
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error');
    }
  }
);
```

## Form Validation Examples

### Field-level Validation
```typescript
Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  age: Yup.number().positive().integer(),
  date: Yup.string().required(),
  phone: Yup.string().matches(/^\d{10}$/, 'Invalid phone'),
})
```

### Custom Validation
```typescript
const schema = Yup.object().shape({
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password')],
    'Passwords must match'
  )
});
```

## State Management Best Practices

### 1. Immutability
```typescript
// ✅ Good - RTK handles this
builder.addCase(updateItem.fulfilled, (state, action) => {
  const index = state.items.findIndex(i => i.id === action.payload.id);
  state.items[index] = action.payload;
});

// ❌ Avoid - Direct mutation in vanilla Redux
state.items[index] = action.payload; // Don't do this
```

### 2. Selector Hooks
```typescript
// Custom selector
export const selectItemById = (state: RootState, id: number) =>
  state.items.items.find(i => i.id === id);

// Usage in component
const item = useAppSelector(state => selectItemById(state, itemId));
```

### 3. Avoiding Prop Drilling
```typescript
// ❌ Bad - Prop drilling
<Parent data={data} onUpdate={onUpdate}>
  <Child data={data} onUpdate={onUpdate}>
    <GrandChild data={data} onUpdate={onUpdate} />
  </Child>
</Parent>

// ✅ Good - Use Redux or Context
const GrandChild = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(state => state.data);
};
```

## Testing Guidelines

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import ItemCard from './ItemCard';

test('renders item card', () => {
  render(<ItemCard item={mockItem} />);
  expect(screen.getByText(mockItem.name)).toBeInTheDocument();
});
```

### Redux Testing
```typescript
import reducer, { fetchItems } from './itemSlice';

test('handles fetch fulfilled', () => {
  const state = reducer(initialState, fetchItems.fulfilled([], ''));
  expect(state.items).toEqual([]);
});
```

## Performance Tips

### 1. Memoization
```typescript
import { memo } from 'react';

export const ItemCard = memo(function ItemCard({ item }: Props) {
  return <div>{item.name}</div>;
});
```

### 2. useCallback for Event Handlers
```typescript
const handleDelete = useCallback((id: number) => {
  dispatch(deleteItem(id));
}, [dispatch]);
```

### 3. useMemo for Expensive Calculations
```typescript
const filteredItems = useMemo(() => {
  return items.filter(item => item.category === selectedCategory);
}, [items, selectedCategory]);
```

## Debugging

### Redux DevTools
Install Redux DevTools browser extension to inspect state changes.

### Console Logging
```typescript
// In Redux thunks
export const fetchData = createAsyncThunk('...', async () => {
  console.log('Fetching data...');
  const res = await apiClient.get('/endpoint');
  console.log('Data received:', res.data);
  return res.data;
});
```

### Network Debugging
- Open DevTools → Network tab
- Check API requests and responses
- Verify headers include auth token

## Common Issues & Solutions

### Issue: Redux state not updating
**Solution**: Ensure you're using `as any` typecast when dispatching with Redux Thunk:
```typescript
dispatch(fetchItems() as any); // Temporary until proper typing
```

### Issue: Form not validating
**Solution**: Ensure ErrorMessage component is using correct field name:
```typescript
<ErrorMessage name="fieldName" component="div" className="error" />
```

### Issue: Authentication errors
**Solution**: Check MSAL configuration and ensure token is being added to requests.

### Issue: CORS errors
**Solution**: Configure CORS on backend to accept requests from your frontend URL.

## Code Style Guidelines

### Naming Conventions
- Components: PascalCase (`MemberCard.tsx`)
- Files: PascalCase for components, camelCase for utilities
- Functions: camelCase (`handleSubmit`, `formatDate`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Import Organization
```typescript
// 1. React/libraries
import React from 'react';
import { useAppDispatch } from '...';

// 2. Redux slices/hooks
import { fetchData } from '...';
import { useAppSelector } from '...';

// 3. Components
import { Card } from '...';

// 4. Styles
import './Component.css';
```

### Component Structure
```typescript
// Props interface
interface ComponentProps {
  data: DataType;
  onAction: () => void;
}

// Component definition
const Component: React.FC<ComponentProps> = ({ data, onAction }) => {
  // State
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => { }, []);
  
  // Event handlers
  const handleClick = () => { };
  
  // Render
  return <div>{/* JSX */}</div>;
};

// Export
export default Component;
```

---

This guide provides the patterns and practices used throughout the FamilyHub application. Follow these guidelines when adding new features or modifying existing code.
