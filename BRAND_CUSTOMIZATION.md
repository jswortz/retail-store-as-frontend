# Brand Customization Guide

This application supports dynamic branding that can be easily customized for different organizations.

## Current Brands Available

1. **Google** - Google's Material Design colors and styling
2. **Microsoft** - Microsoft's Fluent Design colors
3. **Amazon** - Amazon's brand colors
4. **Ulta** - Ulta Beauty's signature pink and clean styling
5. **Walmart** - Blue and yellow with spark logo
6. **McDonald's** - Golden arches with red and yellow theme
7. **Wendy's** - Red primary with blue accents
8. **Kroger** - Deep blue with red accents
9. **Jewel-Osco** - Blue and orange dual-tone design
10. **Custom** - Your own brand configuration

## How to Switch Brands

1. Open `public/brand-config.js`
2. Find the line: `const ACTIVE_BRAND = 'ulta';`
3. Change it to one of: `'google'`, `'microsoft'`, `'amazon'`, `'ulta'`, `'walmart'`, `'mcdonalds'`, `'wendys'`, `'kroger'`, `'jewelosco'`, or `'custom'`
4. Refresh the page

## How to Add Your Own Brand

1. Open `public/brand-config.js`
2. Edit the `custom` configuration or add a new brand:

```javascript
mybrand: {
    name: 'My Company',
    logo: {
        url: '/my-logo.png',  // Place logo in public folder
        width: '120px',
        height: '40px'
    },
    favicon: '/my-favicon.ico',
    colors: {
        primary: '#your-primary-color',
        primaryHover: '#your-primary-hover',
        secondary: '#your-secondary-color',
        accent: '#your-accent-color',
        danger: '#your-danger-color',
        background: '#ffffff',
        surface: '#f5f5f5',
        text: '#333333',
        textSecondary: '#666666',
        border: '#e0e0e0'
    },
    fonts: {
        primary: '"Your Font", Arial, sans-serif',
        secondary: 'Arial, sans-serif'
    }
}
```

3. Set `ACTIVE_BRAND` to your brand key
4. Add your logo and favicon files to the `public` folder

## Brand Elements Affected

- **Logo** - Displayed in the header
- **Favicon** - Browser tab icon
- **Colors** - All UI elements use the brand color palette
- **Fonts** - Primary font for headings, secondary for body text
- **Page Title** - Includes brand name

## CSS Variables

All colors are exposed as CSS variables that can be used in custom styles:

- `--color-primary`
- `--color-primaryHover`
- `--color-secondary`
- `--color-accent`
- `--color-danger`
- `--color-background`
- `--color-surface`
- `--color-text`
- `--color-textSecondary`
- `--color-border`

## Example: Quick Brand Switch

To quickly test different brands without editing files:

1. Open browser console (F12)
2. Run: `ACTIVE_BRAND = 'microsoft'; applyBrand(); location.reload();`

## Tips

- Use high-contrast colors for better accessibility
- Keep logos under 200px width for best display
- Test on both light and dark backgrounds
- Consider providing both PNG and SVG versions of logos
- Favicon should be 32x32px or 16x16px for best compatibility