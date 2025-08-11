# DeleteConfirmationModal Component

A reusable modal component for confirming delete actions with a clean, accessible design.

## Features

- 🎨 **Clean Design**: Modern, centered modal with proper spacing
- 🔧 **Customizable**: Configurable title, message, and button text
- 🎭 **Two Variants**: Danger (red) and Warning (yellow) themes
- 📱 **Responsive**: Works well on all screen sizes
- ♿ **Accessible**: Proper focus management and keyboard navigation
- ⏳ **Loading State**: Shows loading spinner during delete operation
- 🎯 **Item Name Display**: Shows the name of the item being deleted

## Props

| Prop          | Type       | Default                                        | Description                                      |
| ------------- | ---------- | ---------------------------------------------- | ------------------------------------------------ |
| `isOpen`      | `boolean`  | -                                              | Controls modal visibility                        |
| `onClose`     | `function` | -                                              | Called when modal is closed                      |
| `onConfirm`   | `function` | -                                              | Called when delete is confirmed                  |
| `title`       | `string`   | `"Confirm Deletion"`                           | Modal title                                      |
| `message`     | `string`   | `"Are you sure you want to delete this item?"` | Main message                                     |
| `itemName`    | `string`   | `""`                                           | Name of item being deleted (displayed in quotes) |
| `isLoading`   | `boolean`  | `false`                                        | Shows loading state on confirm button            |
| `confirmText` | `string`   | `"Yes, Delete"`                                | Text for confirm button                          |
| `cancelText`  | `string`   | `"Cancel"`                                     | Text for cancel button                           |
| `icon`        | `string`   | `"warning"`                                    | Icon type: `"warning"` or `"trash"`              |
| `variant`     | `string`   | `"danger"`                                     | Color variant: `"danger"` or `"warning"`         |

## Basic Usage

```jsx
import DeleteConfirmationModal from "./shared/DeleteConfirmationModal";

const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [itemToDelete, setItemToDelete] = useState(null);

const handleDelete = (item) => {
  setItemToDelete(item);
  setDeleteModalOpen(true);
};

const confirmDelete = async () => {
  if (!itemToDelete) return;

  try {
    await deleteMutation.mutateAsync(itemToDelete.id);
    setDeleteModalOpen(false);
    setItemToDelete(null);
  } catch (error) {
    console.error("Delete failed:", error);
  }
};

return (
  <>
    {/* Your component content */}

    <DeleteConfirmationModal
      isOpen={deleteModalOpen}
      onClose={() => {
        setDeleteModalOpen(false);
        setItemToDelete(null);
      }}
      onConfirm={confirmDelete}
      title="Delete Payment Method"
      message="Are you sure you want to delete this payment method?"
      itemName={itemToDelete?.name}
      isLoading={deleteMutation.isPending}
      icon="trash"
      variant="danger"
    />
  </>
);
```

## Variants

### Danger Variant (Default)

```jsx
<DeleteConfirmationModal
  variant="danger"
  icon="trash"
  // ... other props
/>
```

### Warning Variant

```jsx
<DeleteConfirmationModal
  variant="warning"
  icon="warning"
  // ... other props
/>
```

## Icon Options

### Warning Icon

- Uses `IoWarning` from react-icons
- Good for general confirmations

### Trash Icon

- Uses `FaTrash` from react-icons
- Perfect for delete confirmations

## Customization Examples

### Custom Button Text

```jsx
<DeleteConfirmationModal
  confirmText="Yes, Remove"
  cancelText="Keep"
  // ... other props
/>
```

### Custom Message

```jsx
<DeleteConfirmationModal
  title="Remove User"
  message="This user will lose access to the system immediately."
  itemName="john.doe@example.com"
  // ... other props
/>
```

### Warning Style for Non-Destructive Actions

```jsx
<DeleteConfirmationModal
  variant="warning"
  icon="warning"
  title="Archive Item"
  message="This item will be moved to the archive."
  confirmText="Yes, Archive"
  // ... other props
/>
```

## Integration with React Query

```jsx
import { useDeleteMutation } from "../hooks/useDeleteMutation";

const deleteMutation = useDeleteMutation();

const confirmDelete = async () => {
  if (!itemToDelete) return;

  try {
    await deleteMutation.mutateAsync(itemToDelete.id);
    setDeleteModalOpen(false);
    setItemToDelete(null);
  } catch (error) {
    // Error is handled by the mutation
  }
};

<DeleteConfirmationModal
  isLoading={deleteMutation.isPending}
  onConfirm={confirmDelete}
  // ... other props
/>;
```

## Best Practices

1. **Always show item name**: Helps users confirm they're deleting the right item
2. **Use appropriate variant**: Use "danger" for destructive actions, "warning" for others
3. **Handle loading state**: Show loading spinner during async operations
4. **Clear state on close**: Reset modal state when closing
5. **Accessible text**: Use clear, descriptive messages

## Accessibility

- Modal is properly focused when opened
- Escape key closes the modal
- Tab navigation works correctly
- Screen reader friendly with proper ARIA labels
- Loading state is announced to screen readers
