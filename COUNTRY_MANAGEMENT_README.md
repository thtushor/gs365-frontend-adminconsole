# Country Management System

This document describes the implementation of the Country Management System for the GS Admin Console, which includes management of countries, currencies, and languages with full API integration using React Query.

## Features

- **Countries Management**: View, search, and manage countries with status updates
- **Currencies Management**: View, search, and manage currencies with exchange rates
- **Languages Management**: View, search, and manage languages with status updates
- **Country-Language Assignment**: Assign languages to countries with interactive modals
- **Real-time Updates**: Automatic data refresh using React Query
- **Search & Filtering**: Search by keywords and filter by status
- **Responsive Design**: Mobile-friendly interface with modern UI

## API Endpoints

The system integrates with the following API endpoints:

### GET Endpoints

- `GET /api/countries/currencies?status=active&searchKey=DA` - Get currency list
- `GET /api/countries/languages?status=inactive&searchKey=DA` - Get language list
- `GET /api/countries?status=inactive&searchKey` - Get country and language list

### POST Endpoints

- `POST /api/countries/assign-country-languages` - Assign country language
- `POST /api/countries/update-language-status` - Update language status
- `POST /api/countries/update-country-language` - Update country language
- `POST /api/countries/update-country-status` - Update country status

## Components

### 1. useCountryData Hook (`src/hooks/useCountryData.jsx`)

A custom React Query hook that provides:

- Data fetching for countries, currencies, and languages
- Mutation functions for all API operations
- Automatic cache invalidation
- Loading states and error handling
- Toast notifications for success/error feedback

### 2. LanguageList Component (`src/components/LanguageList.jsx`)

- Displays languages with search and status filtering
- Interactive status toggle functionality
- Assign language modal integration
- Responsive data table with actions

### 3. CountryList Component (`src/components/CountryList.jsx`)

- Displays countries with search and status filtering
- Interactive status toggle functionality
- Shows associated languages and currencies
- Responsive data table with actions

### 4. CurrencyList Component (`src/components/CurrencyList.jsx`)

- Displays currencies with search and status filtering
- Shows exchange rates and currency symbols
- Responsive data table with actions

### 5. CountryManagementPage Component (`src/components/CountryManagementPage.jsx`)

- Tabbed interface combining all three management views
- Real-time count updates for each section
- Unified navigation experience

### 6. AssignCountryLanguageModal Component (`src/components/AssignCountryLanguageModal.jsx`)

- Interactive modal for assigning languages to countries
- Dropdown selection for countries and languages
- Status selection with validation
- Loading states and error handling

### 7. CountryManagementDemo Component (`src/components/CountryManagementDemo.jsx`)

- Demo interface for testing API integration
- Test buttons for all mutation operations
- Real-time data display with loading states
- Useful for development and testing

## Usage

### Basic Usage

```jsx
import { useCountryData } from '../hooks/useCountryData';

const MyComponent = () => {
  const {
    useCountries,
    useCurrencies,
    useLanguages,
    assignCountryLanguage,
    updateLanguageStatus
  } = useCountryData();

  // Fetch data
  const { data: countries, isLoading } = useCountries({ status: 'active' });

  // Perform mutations
  const handleAssign = () => {
    assignCountryLanguage({
      countryId: 1,
      languageId: 2,
      status: 'active'
    });
  };

  return (
    // Your component JSX
  );
};
```

### Navigation

The components are accessible through the sidebar menu under "Country Management":

- **Overview**: Combined view with tabs
- **Demo**: API testing interface
- **Countries**: Individual country management
- **Currencies**: Individual currency management
- **Languages**: Individual language management

## Data Structure

### Country Object

```javascript
{
  id: number,
  name: string,
  flagUrl: string, // Base64 encoded flag image
  currencyId: number,
  status: 'active' | 'inactive',
  currency: {
    id: number,
    code: string,
    symbol: string,
    symbol_native: string,
    name: string,
    status: 'active' | 'inactive'
  },
  languages: [] // Array of language objects
}
```

### Currency Object

```javascript
{
  id: number,
  name: string,
  code: string,
  symbol: string,
  symbol_native: string,
  status: 'active' | 'inactive'
}
```

### Language Object

```javascript
{
  id: number,
  code: string,
  name: string,
  status: 'active' | 'inactive'
}
```

## API Integration

### Query Parameters

- `status`: Filter by status ('active', 'inactive', or empty for all)
- `searchKey`: Search by keywords

### Mutation Payloads

#### Assign Country Language

```javascript
{
  countryId: number,
  languageId: number,
  status: 'active' | 'inactive'
}
```

#### Update Language Status

```javascript
{
  id: number,
  status: 'active' | 'inactive'
}
```

#### Update Country Language

```javascript
{
  id: number,
  countryId: number,
  languageId: number,
  status: 'active' | 'inactive'
}
```

#### Update Country Status

```javascript
{
  id: number,
  status: 'active' | 'inactive'
}
```

## Error Handling

The system includes comprehensive error handling:

- Network errors are caught and displayed via toast notifications
- Loading states prevent multiple simultaneous requests
- Form validation ensures data integrity
- Graceful fallbacks for missing data

## Performance Features

- **React Query Caching**: Automatic caching and background updates
- **Optimistic Updates**: Immediate UI feedback for mutations
- **Query Invalidation**: Automatic cache refresh after mutations
- **Debounced Search**: Efficient search with debouncing
- **Lazy Loading**: Components load data only when needed

## Styling

The components use Tailwind CSS with a consistent design system:

- Green theme colors for primary actions
- Responsive grid layouts
- Modern card-based designs
- Interactive hover states
- Loading spinners and animations

## Development

### Adding New Features

1. Extend the `useCountryData` hook with new queries/mutations
2. Create new components following the existing patterns
3. Add new routes to the menu configuration
4. Update the API endpoints in `ApiList.js`

### Testing

Use the CountryManagementDemo component to test API integration:

- Navigate to `/country-demo`
- Test all mutation operations
- Verify data loading and caching
- Check error handling scenarios

## Dependencies

- `@tanstack/react-query`: Data fetching and caching
- `react-toastify`: Toast notifications
- `axios`: HTTP client with interceptors
- `tailwindcss`: Styling framework

## Future Enhancements

- Bulk operations for multiple items
- Export functionality (CSV, Excel)
- Advanced filtering options
- Audit trail for changes
- Real-time notifications
- Offline support with service workers
