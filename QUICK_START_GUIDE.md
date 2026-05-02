# BukidGo Production-Ready Components - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Import Global Styles
Add this to your `src/main.tsx`:
```tsx
import './styles/global.css'
```

### Step 2: Wrap Your App with ErrorBoundary
```tsx
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  )
}
```

### Step 3: Add Toast Container
```tsx
import { useToast, ToastContainer } from './components/Toast'

function YourPage() {
  const { toasts, addToast, removeToast } = useToast()

  return (
    <>
      {/* Your content */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  )
}
```

---

## 📦 Component Quick Reference

### Button
```tsx
import { Button } from './components/Button'
import { Send } from 'lucide-react'

<Button 
  variant="primary" 
  size="md"
  icon={<Send style={{ width: 16, height: 16 }} />}
  onClick={handleClick}
>
  Send
</Button>
```

**Variants**: primary, secondary, outline, ghost
**Sizes**: sm, md, lg
**Props**: isLoading, icon, disabled

---

### FormInput
```tsx
import { FormInput } from './components/FormInput'

<FormInput
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  helperText="We'll never share your email"
  required
/>
```

**Props**: label, error, helperText, required

---

### Badge
```tsx
import { Badge } from './components/Badge'
import { CheckCircle2 } from 'lucide-react'

<Badge variant="success" size="md" icon={<CheckCircle2 />}>
  Verified
</Badge>
```

**Variants**: primary, success, warning, error, info
**Sizes**: sm, md

---

### Toast Notifications
```tsx
const { addToast } = useToast()

// Success
addToast('Operation successful!', 'success')

// Error
addToast('Something went wrong', 'error')

// Info
addToast('Here\'s some information', 'info')

// Warning
addToast('Be careful!', 'warning')
```

---

### Modal
```tsx
import { Modal } from './components/Modal'

const [isOpen, setIsOpen] = useState(false)

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
>
  <p>Are you sure?</p>
  <Button onClick={() => setIsOpen(false)}>Cancel</Button>
</Modal>
```

**Sizes**: sm, md, lg

---

### Pagination
```tsx
import { Pagination } from './components/Pagination'

<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  totalItems={items.length}
  itemsPerPage={10}
/>
```

---

### PageHeader
```tsx
import { PageHeader } from './components/PageHeader'

<PageHeader
  subtitle="Section"
  title="Page Title"
  description="Optional description"
  action={<Button>Action</Button>}
/>
```

---

### FilterBar
```tsx
import { FilterBar } from './components/FilterBar'

<FilterBar
  searchValue={search}
  onSearchChange={setSearch}
  onReset={handleReset}
  hasActiveFilters={hasFilters}
  placeholder="Search..."
>
  {/* Additional filter controls */}
</FilterBar>
```

---

### EmptyState
```tsx
import { EmptyState } from './components/EmptyState'
import { Users } from 'lucide-react'

<EmptyState
  icon={Users}
  title="No Results"
  description="Try adjusting your filters"
  action={<Button onClick={handleReset}>Reset Filters</Button>}
/>
```

---

### SkeletonLoader
```tsx
import { SkeletonLoader } from './components/SkeletonLoader'

{loading ? (
  <SkeletonLoader count={5} type="row" />
) : (
  <YourContent />
)}
```

**Types**: card, row, text

---

### LoadingSpinner
```tsx
import { LoadingSpinner } from './components/LoadingSpinner'

<LoadingSpinner 
  size="md" 
  message="Loading..." 
  fullScreen={false}
/>
```

**Sizes**: sm, md, lg

---

### Card
```tsx
import { Card } from './components/Card'

<Card hoverable onClick={handleClick}>
  <img src="..." alt="..." />
  <h3>Title</h3>
  <p>Description</p>
</Card>
```

---

## 🔧 Utility Functions

### Form Validation
```tsx
import { validationRules, validateForm } from './utils/validation'

// Single field
const emailError = validationRules.email(email)

// Multiple fields
const { isValid, errors } = validateForm(data, {
  email: validationRules.email,
  password: validationRules.password,
  phone: validationRules.phone
})

// Custom validation
const minLength = validationRules.minLength(8)
const error = minLength(value)
```

**Available Rules**:
- `validationRules.email`
- `validationRules.password`
- `validationRules.phone`
- `validationRules.required`
- `validationRules.minLength(n)`
- `validationRules.maxLength(n)`

---

### Error Messages
```tsx
import { formatErrorMessage, getFirebaseErrorMessage } from './utils/errorMessages'

// Format any error
const message = formatErrorMessage(error)

// Firebase specific
const fbMessage = getFirebaseErrorMessage('auth/user-not-found')

// Network detection
if (isNetworkError(error)) {
  // Handle network error
}

// Timeout detection
if (isTimeoutError(error)) {
  // Handle timeout
}
```

---

## 📋 Common Patterns

### Form with Validation
```tsx
import { FormInput } from './components/FormInput'
import { Button } from './components/Button'
import { useToast } from './components/Toast'
import { validateForm, validationRules } from './utils/validation'

function MyForm() {
  const [data, setData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate
    const { isValid, errors: validationErrors } = validateForm(data, {
      email: validationRules.email,
      password: validationRules.password
    })
    
    if (!isValid) {
      setErrors(validationErrors.reduce((acc, err) => ({
        ...acc,
        [err.field]: err.message
      }), {}))
      return
    }

    // Submit
    setIsSubmitting(true)
    try {
      await submitForm(data)
      addToast('Success!', 'success')
    } catch (error) {
      addToast(formatErrorMessage(error), 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Email"
        type="email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        error={errors.email}
        required
      />
      <FormInput
        label="Password"
        type="password"
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
        error={errors.password}
        required
      />
      <Button type="submit" isLoading={isSubmitting}>
        Submit
      </Button>
    </form>
  )
}
```

---

### List with Pagination
```tsx
import { Pagination } from './components/Pagination'
import { SkeletonLoader } from './components/SkeletonLoader'
import { EmptyState } from './components/EmptyState'

function MyList() {
  const [page, setPage] = useState(1)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 10

  useEffect(() => {
    fetchItems()
  }, [page])

  const totalPages = Math.ceil(items.length / itemsPerPage)
  const paginatedItems = items.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  return (
    <>
      {loading ? (
        <SkeletonLoader count={5} type="card" />
      ) : items.length === 0 ? (
        <EmptyState title="No items found" />
      ) : (
        <>
          <div>
            {paginatedItems.map(item => (
              <div key={item.id}>{item.name}</div>
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={items.length}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}
    </>
  )
}
```

---

### Error Handling
```tsx
import { ErrorBoundary } from './components/ErrorBoundary'
import { useToast } from './components/Toast'
import { formatErrorMessage } from './utils/errorMessages'

function MyComponent() {
  const { addToast } = useToast()

  const handleOperation = async () => {
    try {
      await riskyOperation()
      addToast('Success!', 'success')
    } catch (error) {
      const message = formatErrorMessage(error)
      addToast(message, 'error')
      console.error('Operation failed:', error)
    }
  }

  return (
    <ErrorBoundary>
      <button onClick={handleOperation}>Do Something</button>
    </ErrorBoundary>
  )
}
```

---

## 🎨 CSS Variables

Use these in your custom styles:

```css
/* Colors */
var(--color-primary)
var(--color-secondary)
var(--color-success)
var(--color-error)
var(--color-background)
var(--color-border)

/* Typography */
var(--font-family-serif)
var(--font-family-sans)
var(--font-family-mono)

/* Spacing */
var(--spacing-sm)
var(--spacing-md)
var(--spacing-lg)

/* Shadows */
var(--shadow-md)
var(--shadow-lg)

/* Transitions */
var(--transition-fast)
var(--transition-base)
```

---

## 🧪 Testing Components

### Unit Test Example
```tsx
import { render, screen } from '@testing-library/react'
import { Button } from './components/Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    screen.getByText('Click').click()
    expect(handleClick).toHaveBeenCalled()
  })

  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

---

## 📱 Responsive Tips

Use CSS variables for responsive design:

```css
/* Mobile first */
.container {
  padding: var(--spacing-md);
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: var(--spacing-lg);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: var(--spacing-xl);
  }
}
```

---

## ♿ Accessibility Checklist

- [ ] All buttons have descriptive text
- [ ] All form inputs have labels
- [ ] All images have alt text
- [ ] Color contrast is 4.5:1
- [ ] Interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Error messages are announced
- [ ] Loading states are announced

---

## 🐛 Troubleshooting

### Components not styled
**Solution**: Import `src/styles/global.css` in main.tsx

### Toast not appearing
**Solution**: Add `<ToastContainer>` to your page

### Accessibility warnings
**Solution**: Add ARIA labels and semantic HTML

### Performance issues
**Solution**: Use pagination and memoization

---

## 📚 Full Documentation

See `PRODUCTION_READY_GUIDE.md` for comprehensive documentation.

---

## 🎯 Next Steps

1. ✅ Import global styles
2. ✅ Wrap app with ErrorBoundary
3. ✅ Add Toast container
4. ✅ Start using components
5. ✅ Test on mobile
6. ✅ Run accessibility audit
7. ✅ Deploy to production

---

**Happy coding! 🚀**
