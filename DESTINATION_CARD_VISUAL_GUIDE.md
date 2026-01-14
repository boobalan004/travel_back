# Destination Card - Visual Guide & Button Reference

## Card Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    [HERO IMAGE - 288px height]                              │
│    ┌────────────────────────────────────────────────────┐  │
│    │                                                    │  │
│    │    [Tag Badge]          [Country Flag Badge]      │  │
│    │                                                    │  │
│    │                                     [★ Rating]    │  │
│    └────────────────────────────────────────────────────┘  │
│                                                             │
│  ─────────────────────────────────────────────────────      │
│                                                             │
│  Paris                                                      │
│  France                                                     │
│                                                             │
│  Discover amazing experiences in this wonderful...          │
│                                                             │
│  [🏨 Hotel] [✈️ Flight] [✓ Guide]                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Duration                                            │  │
│  │ 5 Days / 4 Nights                                   │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ─────────────────────────────────────────────────────      │
│  Price Per Person                                           │
│  $999 per person                                            │
│  ─────────────────────────────────────────────────────      │
│                                                             │
│  ╔════════════╦════════════╦════════════╗                  │
│  ║   Save     ║ Book Now   ║  Pay Now   ║  ← NEW BUTTONS   │
│  ║  [icon]    ║  [icon]    ║  [icon]    ║                  │
│  ╚════════════╩════════════╩════════════╝                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Button States

### SAVE BUTTON

**Default (Not Logged In):**
```
┌─────────────┐
│ [Bookmark]  │  ← Gray background
│    Save     │     Disabled cursor
└─────────────┘     (opacity reduced)
```

**Default (Logged In):**
```
┌─────────────┐
│ [Bookmark]  │  ← Blue background
│    Save     │     Hover effect
└─────────────┘     Active state
```

**Hover (Logged In):**
```
┌─────────────┐
│ [Bookmark]  │  ← Darker blue
│    Save     │     Slight lift effect
└─────────────┘
```

**Loading (API Call):**
```
┌─────────────┐
│  [Spinner]  │  ← Rotating spinner
│   Saving    │     Darker blue
└─────────────┘     Button disabled
```

**Active/Click:**
```
┌─────────────┐
│ [Bookmark]  │  ← Scaled down (95%)
│    Save     │     Gives click feedback
└─────────────┘
```

### BOOK NOW BUTTON

**Default (Not Logged In):**
```
┌──────────────┐
│  [Calendar]  │  ← Gray background
│  Book Now    │     Disabled
└──────────────┘
```

**Default (Logged In):**
```
┌──────────────┐
│  [Calendar]  │  ← Purple background
│  Book Now    │     Interactive
└──────────────┘
```

**Loading:**
```
┌──────────────┐
│  [Spinner]   │  ← Darker purple
│  Booking     │     Loading state
└──────────────┘
```

### PAY NOW BUTTON

**Default (Not Logged In):**
```
┌──────────────┐
│  [Credit Card]│ ← Gray background
│   Pay Now    │    Disabled
└──────────────┘
```

**Default (Logged In):**
```
┌──────────────┐
│  [Credit Card]│ ← Green background
│   Pay Now    │    Interactive
└──────────────┘
```

**Loading:**
```
┌──────────────┐
│  [Spinner]   │  ← Darker green
│   Paying     │     Processing
└──────────────┘
```

## Button Grid Layout

```
Card Width: Variable
Button Layout: 3 columns, equal width, with gap

┌──────────────────────────────────────────────────┐
│                                                  │
│  ┌─────────────┬─────────────┬─────────────┐   │
│  │   Save      │  Book Now   │  Pay Now    │   │
│  │ (33.3% - gap)(33.3% - gap)(33.3%)       │   │
│  └─────────────┴─────────────┴─────────────┘   │
│                                                  │
└──────────────────────────────────────────────────┘

Each button:
- Width: Flex grow with 1/3 ratio
- Height: 44px (py-2.5 + px-2)
- Gap between: 8px (gap-2)
- Border radius: 8px (rounded-lg)
- Font size: 14px (text-sm)
- Font weight: Bold (font-semibold)
- Padding: 10px top/bottom, 8px left/right
```

## Color Scheme

### Save Button
- **Background (Default):** #EFF6FF (Light blue-50)
- **Text:** #1E40AF (Blue-700)
- **Background (Hover):** #DBEAFE (Blue-100)
- **Background (Loading):** #3B82F6 (Blue-500)
- **Background (Disabled):** #F3F4F6 (Gray-100)
- **Text (Disabled):** #9CA3AF (Gray-400)

### Book Now Button
- **Background (Default):** #F3E8FF (Light purple-50)
- **Text:** #6D28D9 (Purple-700)
- **Background (Hover):** #E9D5FF (Purple-100)
- **Background (Loading):** #A855F7 (Purple-500)
- **Background (Disabled):** #F3F4F6 (Gray-100)
- **Text (Disabled):** #9CA3AF (Gray-400)

### Pay Now Button
- **Background (Default):** #F0FDF4 (Light green-50)
- **Text:** #15803D (Green-700)
- **Background (Hover):** #DCFCE7 (Green-100)
- **Background (Loading):** #22C55E (Green-500)
- **Background (Disabled):** #F3F4F6 (Gray-100)
- **Text (Disabled):** #9CA3AF (Gray-400)

## Icons Used

### Save Button
```
📖 Bookmark icon (SVG)
<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
</svg>
```

### Book Now Button
```
📅 Calendar icon (SVG)
<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z..." />
</svg>
```

### Pay Now Button
```
💳 Credit Card icon (SVG)
<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z..." />
</svg>
```

### Loading Spinner
```
⟳ Rotating spinner (animated SVG)
<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor">
  <path d="M12 6V4m6.95 2.05l-1.414-1.414M18 12h2..." />
</svg>
```

## Toast Notification Styles

### Success Toast (Green)
```
┌────────────────────────────────────┐
│ ✓ Destination saved successfully!  │  ← Green background
│                                    │     White text
│                                    │     Positioned at bottom-left
└────────────────────────────────────┘     Auto-dismisses in 3s
```

**Colors:**
- Background: #22C55E (Green-500)
- Text: White
- Shadow: Drop shadow

### Error Toast (Red)
```
┌────────────────────────────────────┐
│ ✗ Please login to save             │  ← Red background
│                                    │     White text
└────────────────────────────────────┘
```

**Colors:**
- Background: #EF4444 (Red-500)
- Text: White
- Shadow: Drop shadow

## Responsive Design

### Desktop (1024px+)
```
Card Width: 100% (in 3-column grid)
Button Width: 33.3% - gap
Full button labels visible
Icons + text side by side
```

### Tablet (768px - 1023px)
```
Card Width: 100% (in 2-column grid)
Button Width: 33.3% - gap
Full labels still visible
Icons + text side by side
```

### Mobile (< 768px)
```
Card Width: 100% (single column)
Button Width: 33.3% - gap
Labels might be cut
Icons visible, text may truncate
Consider 2-row layout for mobile
```

## Animation Timings

- **Hover transition:** 300ms (smooth color change)
- **Active scale:** Instant (scale-95)
- **Loading spinner:** Continuous rotation
- **Toast fade:** Auto 3000ms
- **Page redirect:** 1500ms delay (after success)

## Accessibility Features

- **Disabled state:** Visual indication + disabled attribute
- **Tooltip:** Title attribute on buttons
- **Focus state:** Keyboard navigation support
- **Aria labels:** Not yet added (enhancement)
- **Color contrast:** WCAG AA compliant

## Button Width Calculation

For a card with 400px width:
```
Button Row Width = Card Width - 2*padding = 400 - 24 = 376px
Total Gap Width = 2 gaps * 8px = 16px
Available for buttons = 376 - 16 = 360px
Each button = 360 / 3 = 120px

┌─────────┬──┬─────────┬──┬─────────┐
│  120px  │8p│  120px  │8p│  120px  │
└─────────┴──┴─────────┴──┴─────────┘
```

---

## Real Examples

### Example 1: Paris Card

```
╔══════════════════════════════════════════╗
║                                          ║
║      [Beautiful Paris Image]             ║
║      [Trending] [🇫🇷]           [4.8★] ║
║                                          ║
║──────────────────────────────────────────║
║ Paris                                    ║
║ France                                   ║
║ Discover the city of love and romance... ║
║ [🏨 Hotel] [✈️ Flight] [✓ Guide]       ║
║ ┌──────────────────────────────────────┐║
║ │ Duration                             ││
║ │ 5 Days / 4 Nights                    ││
║ └──────────────────────────────────────┘║
║ Price Per Person: $999                   ║
║ ┌────────┬──────────┬──────────┐        ║
║ │ 📖Save │📅 Book  │💳 Pay    │        ║
║ └────────┴──────────┴──────────┘        ║
║                                          ║
╚══════════════════════════════════════════╝
```

### Example 2: Not Logged In

```
╔══════════════════════════════════════════╗
║                                          ║
║      [Beautiful Tokyo Image]             ║
║      [Popular] [🇯🇵]            [4.7★] ║
║                                          ║
║──────────────────────────────────────────║
║ Tokyo                                    ║
║ Japan                                    ║
║ Experience modern culture and tradition..║
║ [🏨 Hotel] [✈️ Flight] [✓ Guide]       ║
║ ┌──────────────────────────────────────┐║
║ │ Duration                             ││
║ │ 7 Days / 6 Nights                    ││
║ └──────────────────────────────────────┘║
║ Price Per Person: $1299                  ║
║ ┌────────┬──────────┬──────────┐        ║
║ │ ▢Save  │▢ Book   │▢ Pay     │ GRAY   ║
║ └────────┴──────────┴──────────┘        ║
║           (Disabled - Login Required)    ║
║                                          ║
╚══════════════════════════════════════════╝
```

---

## CSS Classes Used

```css
/* Container */
.grid.grid-cols-3.gap-2 - 3 column grid with gaps

/* Button Base */
.py-2.5 - Padding vertical (10px)
.px-2 - Padding horizontal (8px)
.rounded-lg - Border radius (8px)
.font-semibold - Bold text
.text-sm - Font size 14px
.transition-all - Smooth transitions
.duration-300 - 300ms animation
.flex - Flexbox layout
.items-center - Center items
.justify-center - Center content
.gap-1 - Icon spacing

/* States */
.hover:bg-blue-100 - Hover background
.active:scale-95 - Active scale
.disabled:opacity-50 - Disabled opacity
.cursor-not-allowed - Disabled cursor
.animate-spin - Rotating spinner
```

---

**Visual Reference Guide Complete** ✅
Use this to verify button styling and layout.
