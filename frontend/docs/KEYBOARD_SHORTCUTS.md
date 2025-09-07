# Keyboard Shortcuts Guide

## JobCompass - Accessibility & Navigation

This document provides a comprehensive guide to keyboard shortcuts and accessibility features in JobCompass.

## Global Navigation

### Main Navigation

- **Tab**: Navigate forward through interactive elements
- **Shift + Tab**: Navigate backward through interactive elements
- **Enter / Space**: Activate buttons, links, and menu items
- **Escape**: Close modal dialogs, dropdowns, and overlays
- **Arrow Keys**: Navigate within menus, tabs, and lists

### Page Navigation

- **Alt + H**: Focus on main heading (Home page)
- **Alt + N**: Focus on navigation menu
- **Alt + M**: Focus on main content area
- **Alt + S**: Focus on search functionality (when available)

## Page-Specific Shortcuts

### Landing Page

- **Tab**: Navigate through hero section → features → CTA buttons
- **Enter**: Activate "Get Started" or "Learn More" buttons
- **Arrow Keys**: Navigate feature cards when focused

### Dashboard

- **Ctrl + D**: Focus on dashboard main navigation
- **1-6**: Quick navigate to dashboard sections (Analytics, Skills, Resources, etc.)
- **Tab**: Navigate through dashboard cards and widgets
- **Space**: Expand/collapse dashboard cards

### Skills Management (SkillMapping & Profile)

- **Ctrl + A**: Focus on "Add Skill" button
- **Ctrl + S**: Save current skill changes
- **Delete**: Remove selected skill (with confirmation)
- **F2**: Edit skill name/level inline
- **Arrow Keys**: Navigate skill grid

### TabiyaDatasetExplorer

- **Ctrl + F**: Focus on search/filter input
- **Ctrl + L**: Focus on items list
- **Ctrl + R**: Refresh dataset
- **Arrow Keys**: Navigate through dataset items
- **Enter**: View item details
- **Escape**: Return to list view from detail view

### Forms & Input Fields

- **Tab**: Move to next form field
- **Shift + Tab**: Move to previous form field
- **Enter**: Submit form (from submit buttons)
- **Escape**: Cancel form editing/clear field focus
- **Ctrl + Z**: Undo last input change

## Accessibility Features

### Screen Reader Support

- **NVDA, JAWS, VoiceOver Compatible**
- Proper ARIA labels and roles throughout
- Live regions for dynamic content updates
- Form validation announcements
- Navigation landmarks (main, navigation, complementary)

### Focus Management

- **Visible focus indicators** on all interactive elements
- **Focus trapping** in modal dialogs
- **Logical tab order** throughout the application
- **Focus restoration** when closing dialogs

### High Contrast & Theme Support

- **Dark/Light mode toggle**: Accessible via theme switcher
- **High contrast support** for improved visibility
- **Color-blind friendly** color choices
- **Scalable text** up to 200% without horizontal scrolling

## Component-Specific Navigation

### Navigation Menu

- **Arrow Keys**: Navigate menu items
- **Enter**: Open menu item or submenu
- **Escape**: Close submenu or main menu
- **Home**: Go to first menu item
- **End**: Go to last menu item

### Tabs Interface

- **Arrow Keys**: Navigate between tabs
- **Enter/Space**: Activate selected tab
- **Home**: Go to first tab
- **End**: Go to last tab
- **Ctrl + PageUp**: Previous tab
- **Ctrl + PageDown**: Next tab

### Data Tables

- **Arrow Keys**: Navigate table cells
- **Home**: Go to first cell in row
- **End**: Go to last cell in row
- **Ctrl + Home**: Go to first cell in table
- **Ctrl + End**: Go to last cell in table
- **Page Up/Down**: Navigate by page

### Modal Dialogs

- **Tab**: Navigate within modal
- **Escape**: Close modal
- **Enter**: Confirm action (on default button)
- **Focus trapped** within modal until closed

## Advanced Accessibility Testing

### Screen Reader Testing Commands

#### NVDA (Windows)

- **NVDA + Space**: Toggle browse/focus mode
- **H**: Navigate by headings
- **K**: Navigate by links
- **B**: Navigate by buttons
- **F**: Navigate by form fields
- **T**: Navigate by tables
- **L**: Navigate by lists
- **R**: Navigate by regions/landmarks

#### JAWS (Windows)

- **Insert + F6**: List headings
- **Insert + F7**: List links
- **Insert + F5**: List form fields
- **Insert + F3**: Virtual HTML features menu
- \*\*Insert + `;`: List regions/landmarks

#### VoiceOver (macOS)

- **VO + U**: Open rotor
- **VO + Command + H**: Navigate by headings
- **VO + Command + L**: Navigate by links
- **VO + Command + J**: Navigate by form controls
- **VO + Command + T**: Navigate by tables

### Testing Procedures

#### Manual Testing Checklist

1. **Keyboard-only navigation**
   - [ ] All interactive elements reachable via keyboard
   - [ ] Logical tab order maintained
   - [ ] No keyboard traps (except intended modal focus trapping)
   - [ ] All functionality available via keyboard

2. **Screen reader testing**
   - [ ] All images have appropriate alt text
   - [ ] Headings are properly structured (h1 → h2 → h3)
   - [ ] Form labels are properly associated
   - [ ] Live regions announce dynamic changes
   - [ ] Tables have proper headers and captions

3. **Focus management**
   - [ ] Focus visible on all interactive elements
   - [ ] Focus moves logically through page
   - [ ] Focus restored appropriately after modal close
   - [ ] Focus indicators meet contrast requirements

4. **Responsive design**
   - [ ] Functionality maintained at 200% zoom
   - [ ] No horizontal scrolling at standard zoom levels
   - [ ] Touch targets at least 44px × 44px
   - [ ] Content reflows properly on mobile devices

## Browser Support & Compatibility

### Supported Browsers

- **Chrome 90+**: Full support with all accessibility features
- **Firefox 88+**: Full support with all accessibility features
- **Safari 14+**: Full support with all accessibility features
- **Edge 90+**: Full support with all accessibility features

### Supported Screen Readers

- **NVDA 2021.1+** (Windows)
- **JAWS 2021+** (Windows)
- **VoiceOver** (macOS/iOS)
- **TalkBack** (Android)
- **Orca** (Linux)

## Reporting Accessibility Issues

If you encounter any accessibility issues:

1. **Document the issue**:
   - Browser and version
   - Screen reader and version (if applicable)
   - Steps to reproduce
   - Expected vs. actual behavior

2. **Contact information**:
   - Create an issue in the project repository
   - Include "accessibility" label
   - Provide detailed reproduction steps

## Additional Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Screen Reader Testing Guide](https://webaim.org/articles/screenreader_testing/)
- [Keyboard Navigation Testing](https://webaim.org/techniques/keyboard/)

---

_Last updated: [Current Date]_
_Version: 1.0_
