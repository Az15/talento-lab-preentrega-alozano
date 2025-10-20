# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
This is a responsive e-commerce website project for "Toribio Encantado" - a tennis ball store. The site is built with vanilla HTML, CSS, and uses modern CSS techniques like flexbox and media queries for responsiveness.

## File Structure
- `index.html` - Main product showcase page
- `flex.html` - Flexbox testing/demo page
- `css/index.css` - Main stylesheet with responsive design
- `css/flex.css` - Flexbox demo styles
- `img/` - Image assets (logo, welcome image, product images)

## Development Commands
This is a static HTML/CSS project with no build system. To work with it:

**Local development:**
```
# Open files directly in browser or use a simple HTTP server
python -m http.server 8000
# or
npx serve .
```

**Validation:**
```
# HTML validation (if needed)
npx html-validate *.html
```

## Architecture & Design Patterns

### Responsive Design Strategy
- **Mobile-first approach**: Base styles optimized for 360px width
- **Breakpoints**: Supports screens from 320px (mobile) to 2048px (desktop)
- **Flexbox layout**: Used extensively for product grid and navigation
- **Media queries**: Key breakpoint at 320px-768px for mobile adjustments

### CSS Organization
- Uses CSS imports for Google Fonts (Montserrat, BBH Sans family)
- Modular CSS with clear section separations
- CSS custom properties would benefit future development
- Color scheme: Pink/coral theme (#f799d0, #dd8cc9, lightcoral)

### Component Structure
- **Header/Navigation**: Responsive menu with logo (currently hidden)
- **Hero Section**: Welcome image with container-based centering
- **Product Grid**: Flexbox-based responsive card layout
- **Contact Form**: Hidden section with centered form layout
- **Footer**: Social media icons (currently commented out)

### Current Issues (from ToDo.md)
- Logo needs sizing adjustments for tablet/desktop
- Text and title spacing needs improvement  
- Card spacing in product grid needs adjustment
- Footer links and icons need centering

## Key Technical Details
- **Language**: Spanish (lang="es")
- **Icons**: Font Awesome 6.3.0 CDN
- **Images**: PNG/JPG format, stored in `/img/` directory
- **Hidden elements**: Contact form and footer use `hidden` attribute
- **Styling approach**: BEM-like naming conventions in some areas

## Common Tasks
When working on this project, you'll typically:
1. Adjust responsive breakpoints in media queries
2. Modify product card layouts in `.prod-container` and `.prod-item`
3. Update color schemes using the pink/coral theme variables
4. Work with flexbox properties for layout adjustments
5. Manage hidden/visible sections using the `hidden` attribute