# StatusChip Component

A highly customizable and reusable status chip component for displaying various status types with consistent styling and behavior.

## Features

- 🎨 **Multiple Variants**: Default, outlined, filled, pill, square, minimal
- 📏 **5 Size Options**: xs, sm, md, lg, xl
- 🎯 **20+ Predefined Statuses**: active, inactive, success, error, warning, etc.
- 🔧 **Fully Customizable**: Custom colors, labels, and icons
- ♿ **Accessible**: Proper ARIA labels and keyboard navigation
- 🎭 **Interactive**: Optional click handlers with hover effects
- 🚫 **Disabled State**: Visual feedback for disabled chips

## Basic Usage

```jsx
import StatusChip from './shared/StatusChip';

// Simple usage with predefined status
<StatusChip status="active" />
<StatusChip status="inactive" />
<StatusChip status="pending" />
```

## Props

| Prop           | Type       | Default     | Description                                                                 |
| -------------- | ---------- | ----------- | --------------------------------------------------------------------------- |
| `status`       | `string`   | -           | Predefined status key (e.g., "active", "inactive")                          |
| `label`        | `string`   | -           | Custom label text                                                           |
| `variant`      | `string`   | `"default"` | Style variant: "default", "outlined", "filled", "pill", "square", "minimal" |
| `size`         | `string`   | `"md"`      | Size: "xs", "sm", "md", "lg", "xl"                                          |
| `showIcon`     | `boolean`  | `true`      | Whether to show the status icon                                             |
| `className`    | `string`   | `""`        | Additional CSS classes                                                      |
| `customConfig` | `object`   | `null`      | Custom configuration object                                                 |
| `onClick`      | `function` | `null`      | Click handler function                                                      |
| `disabled`     | `boolean`  | `false`     | Whether the chip is disabled                                                |

## Predefined Statuses

### Basic Statuses

- `active` - Green with dot icon
- `inactive` - Red with circle icon
- `pending` - Yellow with hourglass icon

### Success/Error Statuses

- `success` - Emerald green with checkmark
- `error` - Red with X icon
- `warning` - Orange with warning icon

### State Statuses

- `enabled` - Blue with dot icon
- `disabled` - Gray with circle icon

### Process Statuses

- `processing` - Purple with rotating arrow
- `completed` - Teal with checkmark
- `cancelled` - Slate gray with X

### Payment Statuses

- `paid` - Green with money bag
- `unpaid` - Red with credit card

### User Statuses

- `online` - Green with dot
- `offline` - Gray with circle

### Priority Statuses

- `high` - Red with red circle
- `medium` - Yellow with yellow circle
- `low` - Green with green circle

## Size Variants

```jsx
<StatusChip status="active" size="xs" />
<StatusChip status="active" size="sm" />
<StatusChip status="active" size="md" />
<StatusChip status="active" size="lg" />
<StatusChip status="active" size="xl" />
```

## Style Variants

```jsx
<StatusChip status="active" variant="default" />
<StatusChip status="active" variant="outlined" />
<StatusChip status="active" variant="filled" />
<StatusChip status="active" variant="pill" />
<StatusChip status="active" variant="square" />
<StatusChip status="active" variant="minimal" />
```

## Custom Configuration

### Using customConfig prop

```jsx
const customConfig = {
  label: "Premium",
  className:
    "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200",
  icon: "⭐",
};

<StatusChip customConfig={customConfig} />;
```

### Using createStatusConfig helper

```jsx
import { createStatusConfig } from "./shared/StatusChip";

const premiumConfig = createStatusConfig(
  "Premium",
  "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200",
  "⭐"
);

<StatusChip customConfig={premiumConfig} />;
```

## Interactive Examples

```jsx
// Clickable chip
<StatusChip
  status="active"
  onClick={(status, config) => console.log('Clicked:', status)}
  className="hover:shadow-md"
/>

// Disabled chip
<StatusChip status="active" disabled />

// Without icon
<StatusChip status="active" showIcon={false} />
```

## Usage Examples

### Payment Status Table

```jsx
const columns = [
  { field: "name", headerName: "Payment Method" },
  {
    field: "status",
    headerName: "Status",
    render: (value) => <StatusChip status={value} size="sm" />,
  },
];
```

### User Status List

```jsx
{
  users.map((user) => (
    <div key={user.id} className="flex items-center gap-2">
      <span>{user.name}</span>
      <StatusChip status={user.online ? "online" : "offline"} />
    </div>
  ));
}
```

### Priority Badges

```jsx
{
  tasks.map((task) => (
    <div key={task.id} className="flex items-center gap-2">
      <span>{task.title}</span>
      <StatusChip status={task.priority} size="xs" />
    </div>
  ));
}
```

## Customization

### Adding New Status Types

```jsx
import { STATUS_CONFIGS } from "./shared/StatusChip";

// Extend the configs
const extendedConfigs = {
  ...STATUS_CONFIGS,
  custom: {
    label: "Custom Status",
    className: "bg-indigo-100 text-indigo-800 border-indigo-200",
    icon: "🔮",
  },
};
```

### Custom Styling

```jsx
<StatusChip
  status="active"
  className="shadow-lg hover:shadow-xl transition-shadow"
/>
```

## Best Practices

1. **Consistent Usage**: Use the same status keys throughout your application
2. **Accessibility**: Always provide meaningful labels and consider screen readers
3. **Color Contrast**: Ensure sufficient contrast for text readability
4. **Responsive Design**: Use appropriate sizes for different screen sizes
5. **Performance**: The component is optimized with React.memo for better performance

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Tailwind CSS classes for styling
- Unicode icons for cross-platform compatibility

## Demo

Visit `/status-chip-demo` in your application to see all variants and examples in action!
