# Advanced Screen Reader Testing Guide

## JobCompass - Screen Reader Compatibility & Testing

This guide provides comprehensive testing procedures and compatibility information for screen readers with JobCompass.

## Overview

JobCompass has been designed and tested to work seamlessly with major screen readers, providing equal access to all functionality for users who rely on assistive technology.

## Supported Screen Readers

### Primary Support (Fully Tested)

- **NVDA 2021.1+** (Windows) - Free, open-source
- **JAWS 2021+** (Windows) - Commercial
- **VoiceOver** (macOS 10.15+, iOS 14+) - Built-in
- **TalkBack** (Android 9+) - Built-in

### Secondary Support (Basic Compatibility)

- **Orca** (Linux) - Basic functionality verified
- **Dragon NaturallySpeaking** (Windows) - Voice control compatibility
- **Windows Narrator** (Windows 10+) - Basic compatibility

## Testing Methodology

### Automated Testing Tools

1. **axe-core** - Integrated into development workflow
2. **WAVE** - Manual testing for accessibility issues
3. **Lighthouse** - Accessibility audits in Chrome DevTools
4. **Pa11y** - Command-line accessibility testing

### Manual Testing Procedures

#### NVDA Testing (Windows)

##### Setup and Configuration

```
1. Download NVDA from https://www.nvaccess.org/
2. Configure speech rate: NVDA → Preferences → Settings → Speech
3. Enable browse mode: NVDA + Space (toggle as needed)
4. Set verbosity level: NVDA → Preferences → Settings → Speech → Symbol Level
```

##### Essential NVDA Commands for Testing

```
Navigation:
- NVDA + Space: Toggle browse/focus mode
- H / Shift + H: Next/previous heading
- K / Shift + K: Next/previous link
- B / Shift + B: Next/previous button
- F / Shift + F: Next/previous form field
- T / Shift + T: Next/previous table
- L / Shift + L: Next/previous list
- R / Shift + R: Next/previous region/landmark

Information:
- NVDA + T: Read window title
- NVDA + Tab: Read focused element
- NVDA + Up Arrow: Read current line
- NVDA + F12: Read date and time
- Insert + F7: Elements list (links, headings, etc.)

Forms:
- Tab: Next form field
- Enter: Activate button/submit
- Space: Toggle checkbox/radio button
- Arrow Keys: Navigate select options
```

##### NVDA Testing Checklist

- [ ] **Page Structure**: Headings hierarchy (H1 → H2 → H3) announced correctly
- [ ] **Navigation**: All main navigation items accessible and announced
- [ ] **Forms**: All form fields have proper labels and validation messages
- [ ] **Tables**: Table headers and data relationships announced
- [ ] **Images**: All images have appropriate alt text or marked decorative
- [ ] **Dynamic Content**: Live regions announce updates appropriately
- [ ] **Modal Dialogs**: Focus trapping works, Escape key closes modals

#### JAWS Testing (Windows)

##### Setup and Configuration

```
1. Install JAWS from Freedom Scientific
2. Configure speech rate: Insert + V (Voice adjustment)
3. Set verbosity: Insert + V → Verbosity → Custom
4. Configure web settings: Insert + F2 → Web/HTML/PDF
```

##### Essential JAWS Commands

```
Navigation:
- H / Shift + H: Next/previous heading
- K / Shift + K: Next/previous link
- B / Shift + B: Next/previous button
- F / Shift + F: Next/previous form field
- T / Shift + T: Next/previous table
- ; / Shift + ;: Next/previous region

Quick Lists:
- Insert + F6: Headings list
- Insert + F7: Links list
- Insert + F5: Form fields list
- Insert + F3: Virtual HTML features

Information:
- Insert + T: Window title
- Insert + Tab: Current control info
- Insert + Up Arrow: Say line
- Ctrl + Insert + Up: Say all from cursor
```

##### JAWS Testing Checklist

- [ ] **Virtual Buffer**: Page loads correctly in virtual mode
- [ ] **Quick Navigation**: All quick nav keys work as expected
- [ ] **Forms Mode**: Automatic switching to forms mode for input fields
- [ ] **Tables**: Table navigation with Ctrl+Alt+Arrow keys
- [ ] **Landmarks**: Region navigation works properly
- [ ] **Live Regions**: Dynamic updates announced appropriately

#### VoiceOver Testing (macOS)

##### Setup and Configuration

```
1. Enable VoiceOver: System Preferences → Accessibility → VoiceOver
2. Configure speech rate: VO + Command + Right/Left Arrow
3. Set web navigation: VO + Shift + Down Arrow → Web
4. Configure rotor: VO + U (customize rotor options)
```

##### Essential VoiceOver Commands

```
Basic Navigation:
- VO + Right/Left Arrow: Next/previous item
- VO + Command + H: Next/previous heading
- VO + Command + L: Next/previous link
- VO + Command + J: Next/previous form control
- VO + Command + T: Next/previous table

Web Navigation:
- VO + U: Open rotor (navigation menu)
- VO + Space: Activate item
- VO + Shift + Space: Click item
- Control + Option + Command + H: Navigate headings
- Control + Option + Command + L: Navigate links

Information:
- VO + F1: Get help
- VO + F2: Show VoiceOver menu
- VO + Shift + I: Get item information
- VO + F: Read from current position to end
```

##### VoiceOver Testing Checklist

- [ ] **Rotor Navigation**: All content types appear in rotor
- [ ] **Web Spots**: Important elements marked as web spots
- [ ] **Table Navigation**: Table mode works for data tables
- [ ] **Form Controls**: All inputs, buttons, selects work properly
- [ ] **Live Regions**: Updates announced without user intervention
- [ ] **Gestures**: Touch gestures work on iOS devices

#### TalkBack Testing (Android)

##### Setup and Configuration

```
1. Enable TalkBack: Settings → Accessibility → TalkBack
2. Configure speech rate: TalkBack settings → Speech rate
3. Set reading controls: TalkBack settings → Reading controls
4. Configure gestures: TalkBack settings → Gestures
```

##### Essential TalkBack Gestures

```
Navigation:
- Swipe Right: Next item
- Swipe Left: Previous item
- Double Tap: Activate item
- Two-finger Swipe Up: Read from top
- Two-finger Swipe Down: Read from current position

Web Navigation:
- Swipe Up then Right: Next heading
- Swipe Down then Right: Previous heading
- Swipe Up then Left: Next link
- Swipe Down then Left: Previous link

Controls:
- Volume Up + Volume Down: Enable/disable TalkBack
- Explore by Touch: Touch screen to hear items
- Double Tap and Hold: Long press gesture
```

##### TalkBack Testing Checklist

- [ ] **Touch Exploration**: All elements discoverable by touch
- [ ] **Gesture Navigation**: Standard gestures work as expected
- [ ] **Web Content**: HTML content reads properly in mobile browsers
- [ ] **Form Inputs**: Virtual keyboard and input methods work
- [ ] **Notifications**: App notifications read appropriately
- [ ] **Responsive Design**: Mobile layout accessible via TalkBack

## Page-Specific Testing Procedures

### Landing Page Testing

```
1. Verify page title is announced on load
2. Check hero section heading structure (H1 → H2)
3. Test feature cards navigation and descriptions
4. Verify CTA buttons are properly labeled
5. Check footer links are accessible
6. Test theme toggle accessibility
```

### Dashboard Testing

```
1. Verify dashboard main heading (H1)
2. Test navigation between dashboard sections
3. Check data visualization accessibility (charts, graphs)
4. Test widget interaction and keyboard navigation
5. Verify dynamic content updates are announced
6. Check responsive behavior with screen reader
```

### Forms Testing (Profile, Skills, Security)

```
1. Test form field labels and descriptions
2. Verify error message announcements
3. Check required field indicators
4. Test form validation feedback
5. Verify successful submission announcements
6. Check password visibility toggle accessibility
```

### Data Tables Testing (TabiyaDatasetExplorer)

```
1. Verify table has proper caption/summary
2. Test column header associations
3. Check row/column navigation
4. Verify sorting controls accessibility
5. Test filtering and search functionality
6. Check pagination controls
```

## Common Issues and Solutions

### Issue: Missing Form Labels

**Problem**: Screen reader can't identify form purpose
**Solution**: Add `aria-label` or associate with `<label>` element

```html
<!-- Good -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email" />

<!-- Also Good -->
<input type="email" aria-label="Email Address" name="email" />
```

### Issue: Dynamic Content Not Announced

**Problem**: Live updates don't reach screen reader users
**Solution**: Use ARIA live regions

```html
<div aria-live="polite" aria-atomic="true">
  <p id="status">Status updates appear here</p>
</div>
```

### Issue: Focus Management in Modals

**Problem**: Focus escapes modal dialog
**Solution**: Implement focus trapping

```javascript
// Focus first element in modal
modal.querySelector('button, input, select, textarea').focus();

// Trap focus within modal
modal.addEventListener('keydown', trapFocus);
```

### Issue: Insufficient Color Contrast

**Problem**: Text not readable for users with visual impairments
**Solution**: Ensure minimum 4.5:1 contrast ratio

```css
/* Good contrast examples */
.text-primary {
  color: #1f2937;
} /* Dark text */
.bg-white {
  background-color: #ffffff;
} /* White background */
```

## Testing Scripts and Automation

### Basic Accessibility Test Script

```bash
#!/bin/bash
# Run automated accessibility tests

echo "Running axe-core tests..."
npm run test:accessibility

echo "Running Lighthouse audit..."
npm run lighthouse:accessibility

echo "Running Pa11y tests..."
npm run pa11y:test

echo "Generating accessibility report..."
npm run accessibility:report
```

### Screen Reader Testing Checklist Script

```javascript
// Automated checks for common screen reader issues
const accessibilityChecks = {
  headingStructure: () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    // Check for proper heading hierarchy
  },

  imageAltText: () => {
    const images = document.querySelectorAll('img');
    // Verify all images have alt text or role="presentation"
  },

  formLabels: () => {
    const inputs = document.querySelectorAll('input, select, textarea');
    // Check all form controls have labels
  },

  focusManagement: () => {
    // Test tab order and focus visibility
  },
};
```

## Performance Considerations

### Screen Reader Performance Tips

1. **Minimize DOM complexity** for faster navigation
2. **Use semantic HTML** to reduce cognitive load
3. **Optimize ARIA usage** - don't over-label
4. **Implement lazy loading** for large data sets
5. **Cache screen reader friendly content**

### Testing Performance

```javascript
// Measure screen reader performance
const measureAccessibility = () => {
  const start = performance.now();

  // Simulate screen reader navigation
  simulateScreenReaderNavigation();

  const end = performance.now();
  console.log(`Navigation took ${end - start} milliseconds`);
};
```

## Compliance and Standards

### WCAG 2.1 Compliance

- **Level AA**: All features meet Level AA requirements
- **Level AAA**: Selected features meet Level AAA where feasible
- **Regular Audits**: Monthly accessibility compliance reviews

### Legal Compliance

- **ADA Compliance**: Meets Americans with Disabilities Act requirements
- **Section 508**: Complies with US federal accessibility standards
- **EN 301 549**: Meets European accessibility standard
- **AODA**: Complies with Accessibility for Ontarians with Disabilities Act

## Resources and Training

### Screen Reader Resources

- [NVDA User Guide](https://www.nvaccess.org/userguides/)
- [JAWS Documentation](https://support.freedomscientific.com/)
- [VoiceOver User Guide](https://support.apple.com/guide/voiceover/)
- [TalkBack Help](https://support.google.com/accessibility/android/topic/3529932)

### Testing Tools

- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [Lighthouse Accessibility](https://developers.google.com/web/tools/lighthouse)
- [Pa11y Command Line Tool](https://pa11y.org/)

### Training Materials

- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Deque University](https://dequeuniversity.com/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

_This guide is continuously updated based on user feedback and new assistive technology developments._

_Last updated: [Current Date]_
_Version: 1.0_
