# @core-rv/components

A Vue.js component library providing a consistent design system for RV projects.

## Features

- ✨ Vue 3 with Composition API and `<script setup>`
- 🎨 Tailwind CSS for styling
- 📦 TypeScript support with full type definitions
- 🔧 Tree-shakable ESM exports
- 🎯 Lightweight and performant
- 📱 Responsive design components

## Installation

```bash
# In your project
pnpm add @core-rv/components

# Peer dependencies (if not already installed)
pnpm add vue@^3.4.0
```

## Usage

### Basic Import

```vue
<script setup lang="ts">
import { RvButton, RvCard, RvInput } from '@core-rv/components';
import '@core-rv/components/style.css';
</script>

<template>
  <RvCard title="Hello World" elevated>
    <RvInput v-model="message" label="Enter message" />
    <RvButton @click="handleClick">Submit</RvButton>
  </RvCard>
</template>
```

### Global Registration

```ts
// main.ts
import { createApp } from 'vue';
import * as RvComponents from '@core-rv/components';
import '@core-rv/components/style.css';

const app = createApp(App);

// Register all components globally
Object.entries(RvComponents).forEach(([name, component]) => {
  if (name !== 'default') {
    app.component(name, component);
  }
});

app.mount('#app');
```

## Components

### RvButton

A versatile button component with multiple variants and states.

```vue
<template>
  <!-- Basic usage -->
  <RvButton>Click me</RvButton>

  <!-- With variants -->
  <RvButton variant="primary">Primary</RvButton>
  <RvButton variant="secondary">Secondary</RvButton>
  <RvButton variant="danger">Danger</RvButton>

  <!-- With sizes -->
  <RvButton size="small">Small</RvButton>
  <RvButton size="medium">Medium</RvButton>
  <RvButton size="large">Large</RvButton>

  <!-- With states -->
  <RvButton disabled>Disabled</RvButton>
  <RvButton loading>Loading</RvButton>
</template>
```

**Props:**

- `variant?: 'primary' | 'secondary' | 'danger'` - Button style variant
- `size?: 'small' | 'medium' | 'large'` - Button size
- `disabled?: boolean` - Disable the button
- `loading?: boolean` - Show loading state

**Events:**

- `@click` - Emitted when button is clicked

### RvCard

A container component for grouping related content.

```vue
<template>
  <!-- Basic card -->
  <RvCard>
    <p>Card content</p>
  </RvCard>

  <!-- With title -->
  <RvCard title="Card Title">
    <p>Card content with title</p>
  </RvCard>

  <!-- Elevated with custom padding -->
  <RvCard elevated padding="large">
    <p>Elevated card with large padding</p>
  </RvCard>
</template>
```

**Props:**

- `title?: string` - Optional card title
- `elevated?: boolean` - Add shadow elevation
- `padding?: 'none' | 'small' | 'medium' | 'large'` - Internal padding

### RvInput

A form input component with validation support.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const error = ref('');
</script>

<template>
  <!-- Basic input -->
  <RvInput v-model="email" label="Email" type="email" />

  <!-- With validation -->
  <RvInput
    v-model="password"
    label="Password"
    type="password"
    :error="error"
    required
  />

  <!-- Disabled input -->
  <RvInput
    v-model="value"
    label="Disabled"
    disabled
    placeholder="Cannot edit"
  />
</template>
```

**Props:**

- `modelValue?: string` - Input value (v-model)
- `label?: string` - Input label
- `type?: 'text' | 'email' | 'password'` - Input type
- `placeholder?: string` - Placeholder text
- `disabled?: boolean` - Disable the input
- `required?: boolean` - Show required indicator
- `error?: string` - Error message to display

**Events:**

- `@update:modelValue` - Emitted when value changes

## Styling

The components use Tailwind CSS for styling. Make sure to include the component styles:

```css
/* In your main CSS file */
@import '@core-rv/components/style.css';
```

Or import in your Vue component:

```vue
<style>
@import '@core-rv/components/style.css';
</style>
```

## TypeScript

Full TypeScript support is included with exported prop interfaces:

```ts
import type { ButtonProps, CardProps, InputProps } from '@core-rv/components';

// Use props interfaces in your components
const props: ButtonProps = {
  variant: 'primary',
  size: 'large',
  disabled: false,
};
```

## Development

### Setup

```bash
# Install dependencies
pnpm install

# Build the library
pnpm build

# Watch mode for development
pnpm dev

# Type checking
pnpm typecheck
```

### Build Output

The build process generates:

- `dist/index.js` - ESM module
- `dist/index.d.ts` - TypeScript declarations
- `dist/style.css` - Component styles

## Contributing

1. Add new components in `src/components/`
2. Export them in `src/index.ts`
3. Follow the existing patterns for props and events
4. Include TypeScript interfaces
5. Use Tailwind CSS for styling
6. Test with the development server

## License

MIT
