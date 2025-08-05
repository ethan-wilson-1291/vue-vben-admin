# Shopify RV Embedded App

A Shopify embedded application built with Vue.js and the `@core-rv/components` library, packaged as a Web Component for easy integration.

## Features

- ✨ Built with Vue.js 3 and Composition API
- 🎨 Uses the `@core-rv/components` design system library
- 🌐 Packaged as a Web Component for universal usage
- 🛍️ Optimized for Shopify theme integration
- 📱 Responsive design with Tailwind CSS
- 🔧 TypeScript support

## Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm typecheck
```

### Development URL

The development server runs at `http://localhost:5173`

## Usage as Web Component

After building the project, you'll get a `shopify-rv-app.umd.js` file that can be used as a Web Component.

### Basic HTML Usage

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <!-- Include the web component script -->
    <script src="./shopify-rv-app.umd.js"></script>

    <!-- Use the custom element -->
    <shopify-rv-app></shopify-rv-app>
  </body>
</html>
```

### Shopify Theme Integration

1. Upload the built `shopify-rv-app.umd.js` file to your theme's `assets` folder
2. Include it in your liquid template:

```liquid
{% comment %} In your theme's liquid file {% endcomment %}
{{ 'shopify-rv-app.umd.js' | asset_url | script_tag }}
<shopify-rv-app></shopify-rv-app>
```

### Advanced Integration

The web component is self-contained and doesn't require external dependencies. It includes:

- All Vue.js runtime code
- Complete `@core-rv/components` library
- Tailwind CSS styles
- Application logic

## Component Library

This project uses the `@core-rv/components` library which provides:

- `RvButton` - Customizable button component
- `RvCard` - Card container component
- `RvInput` - Form input component
- Consistent design system
- TypeScript support

## Project Structure

```text
src/
├── App.vue              # Main Vue application
├── main.ts              # Development entry point
├── web-component.ts     # Web component entry point
├── style.css            # Global styles
└── components/          # Additional components

public/
├── demo.html           # Web component demo page
└── ...

dist/                   # Built files
├── shopify-rv-app.umd.js  # Web component bundle
└── ...
```

## Building

The build process creates two outputs:

1. **Standard SPA build** - For development and testing
2. **Web Component build** - UMD bundle for embedding

```bash
# Build both outputs
pnpm build
```

## Demo

Open `public/demo.html` in your browser after building to see the web component in action.

## Contributing

1. Make changes to the components or application
2. Test in development mode with `pnpm dev`
3. Build and test the web component with `pnpm build`
4. Verify integration with the demo page

## License

MIT
