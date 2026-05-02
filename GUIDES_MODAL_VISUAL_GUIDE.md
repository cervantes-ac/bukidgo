# Guides Page Modal - Visual Guide

## Modal Layout

### Full Modal View
```
┌─────────────────────────────────────────────────────────────┐
│                    GUIDE DETAIL MODAL                       │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ [Guide Photo]  Guide Name                            ❤️  ││
│ │ [Verified]     4 years experience  ★ 4.9             ││
│ ├──────────────────────────────────────────────────────────┤│
│ │                                                          ││
│ │ About                                                    ││
│ │ Passionate about Bukidnon's agricultural tourism and    ││
│ │ local history. I love sharing authentic experiences     ││
│ │ with travelers who want to connect with the land and    ││
│ │ people of our beautiful highlands.                      ││
│ │                                                          ││
│ │ Specialties                                             ││
│ │ [Agriculture] [History] [Farm Tours] [Cultural]         ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐  ││
│ │ │ Service / day    Platform fee                      │  ││
│ │ │ ₱250             ₱49                               │  ││
│ │ │ ─────────────────────────────────────────────────  │  ││
│ │ │ Total estimate: ₱299                              │  ││
│ │ └────────────────────────────────────────────────────┘  ││
│ │                                                          ││
│ │ Reviews (3)  [+ Add Review]                             ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐  ││
│ │ │ John Doe  ★★★★★                                   │  ││
│ │ │ Amazing Experience                                 │  ││
│ │ │ This guide was incredibly knowledgeable and        │  ││
│ │ │ friendly. Highly recommended!                      │  ││
│ │ │ 👍 Helpful (12)                                    │  ││
│ │ └────────────────────────────────────────────────────┘  ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐  ││
│ │ │ Jane Smith  ★★★★☆                                 │  ││
│ │ │ Great Guide                                        │  ││
│ │ │ Very professional and knows the area well.         │  ││
│ │ │ 👍 Helpful (8)                                     │  ││
│ │ └────────────────────────────────────────────────────┘  ││
│ │                                                          ││
│ ├──────────────────────────────────────────────────────────┤│
│ │ [📅 Book Guide Name]                                    ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Modal States

### 1. Default State (Guide Details)
```
┌─────────────────────────────────────┐
│ [Photo] Name                    ❤️  │
│ [Badge] Experience  Rating      │
├─────────────────────────────────────┤
│ About                               │
│ [Bio text]                          │
│                                     │
│ Specialties                         │
│ [Tags]                              │
│                                     │
│ Pricing Box                         │
│ Service: ₱250                       │
│ Fee: ₱49                            │
│ Total: ₱299                         │
│                                     │
│ Reviews                             │
│ [Review list]                       │
├─────────────────────────────────────┤
│ [Book Button]                       │
└─────────────────────────────────────┘
```

### 2. Review Form State
```
┌─────────────────────────────────────┐
│ [Same header]                       │
├─────────────────────────────────────┤
│ Reviews (3)  [+ Add Review]         │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Rating                          │ │
│ │ [★ ★ ★ ★ ★]                    │ │
│ │                                 │ │
│ │ [Review Title Input]            │ │
│ │ [Review Comment Textarea]       │ │
│ │                                 │ │
│ │ [Submit] [Cancel]               │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Existing reviews]                  │
├─────────────────────────────────────┤
│ [Book Button]                       │
└─────────────────────────────────────┘
```

### 3. Booking State
```
┌─────────────────────────────────────┐
│                                     │
│         ✓ Booked!                   │
│                                     │
│ Your request was sent to John.      │
│ They'll reply within 24 hours.      │
│                                     │
└─────────────────────────────────────┘
```

### 4. Loading State
```
┌─────────────────────────────────────┐
│ [Same header]                       │
├─────────────────────────────────────┤
│ [Content]                           │
├─────────────────────────────────────┤
│ [⟳ Booking...]                      │
└─────────────────────────────────────┘
```

---

## Header Section

### Structure
```
┌─────────────────────────────────────┐
│ [Photo] Name                    ❤️  │
│ [Badge] Experience  Rating      │
└─────────────────────────────────────┘
```

### Photo
- **Size**: 72x72px
- **Border Radius**: 8px
- **Object Fit**: Cover
- **Verified Badge**: 22x22px, bottom-right

### Name
- **Font**: Fraunces 900
- **Size**: 22px
- **Color**: #1A1208

### Experience & Rating
- **Font**: Outfit 400
- **Size**: 11px
- **Background**: Light color
- **Padding**: 4px 10px
- **Border Radius**: 4px

### Favorite Button
- **Icon**: Heart
- **Size**: 24x24px
- **Color**: #C4622D
- **Fill**: Conditional (filled if favorited)

---

## Content Section

### About
```
About
[Full bio text - 13px, Outfit 300]
```

### Specialties
```
Specialties
[Tag 1] [Tag 2] [Tag 3] [Tag 4]
```

### Pricing Box
```
┌─────────────────────────────────────┐
│ Service / day    Platform fee       │
│ ₱250             ₱49                │
│ ─────────────────────────────────── │
│ Total estimate: ₱299                │
└─────────────────────────────────────┘
```

### Reviews
```
Reviews (3)  [+ Add Review]

[Review 1]
[Review 2]
[Review 3]
```

---

## Review Card

### Structure
```
┌─────────────────────────────────────┐
│ John Doe  ★★★★★                    │
│ Amazing Experience                  │
│ This guide was incredibly           │
│ knowledgeable and friendly.         │
│ 👍 Helpful (12)                     │
└─────────────────────────────────────┘
```

### Elements
- **Name**: 12px, fontWeight 700
- **Rating**: 5 stars, 11px
- **Title**: 11px, fontWeight 600, color #C4622D
- **Comment**: 11px, lineHeight 1.5
- **Helpful**: 10px, color #B8B0A4

---

## Review Form

### Structure
```
┌─────────────────────────────────────┐
│ Rating                              │
│ [★ ★ ★ ★ ★]                        │
│                                     │
│ [Review Title Input]                │
│ [Review Comment Textarea]           │
│                                     │
│ [Submit] [Cancel]                   │
└─────────────────────────────────────┘
```

### Rating Stars
- **Size**: 20x20px
- **Color**: #D4A853
- **Fill**: Conditional (filled up to selected rating)
- **Clickable**: Each star selects that rating

### Title Input
- **Placeholder**: "Review title"
- **Width**: 100%
- **Padding**: 8px 12px
- **Border**: 1px solid #DDD6C8
- **Border Radius**: 2px
- **Font Size**: 12px

### Comment Textarea
- **Placeholder**: "Share your experience..."
- **Width**: 100%
- **Padding**: 8px 12px
- **Border**: 1px solid #DDD6C8
- **Border Radius**: 2px
- **Font Size**: 12px
- **Min Height**: 80px
- **Resize**: None

### Buttons
- **Submit**: 
  - Background: #C4622D
  - Color: #fff
  - Disabled when form incomplete
- **Cancel**:
  - Background: #DDD6C8
  - Color: #1A1208

---

## Footer Section

### Book Button
```
┌─────────────────────────────────────┐
│ [📅 Book Guide Name]                │
└─────────────────────────────────────┘
```

### Styling
- **Width**: 100%
- **Padding**: 16px
- **Background**: #C4622D
- **Color**: #fff
- **Border**: None
- **Border Radius**: 2px
- **Font Size**: 14px
- **Font Weight**: 700
- **Cursor**: Pointer

### Loading State
- **Icon**: Spinning circle
- **Text**: "Booking..."
- **Disabled**: true

---

## Animations

### Modal Entrance
```
Initial:
  opacity: 0
  scale: 0.95
  y: 20

Animate:
  opacity: 1
  scale: 1
  y: 0

Duration: 0.3s
Easing: Default (ease-out)
```

### Modal Exit
```
Exit:
  opacity: 0
  scale: 0.95
  y: 20

Duration: 0.3s
Easing: Default (ease-in)
```

### Backdrop
```
Initial:
  opacity: 0

Animate:
  opacity: 1

Exit:
  opacity: 0

Duration: 0.3s
```

---

## Interactions

### Opening Modal
1. User clicks "View Details" button
2. Backdrop fades in
3. Modal scales up and fades in
4. Content is scrollable if needed

### Closing Modal
1. User clicks outside modal (backdrop)
2. User clicks close button (if present)
3. Backdrop fades out
4. Modal scales down and fades out

### Adding Review
1. User clicks "Add Review"
2. Review form appears
3. User fills in rating, title, comment
4. User clicks "Submit"
5. Form submits to Firebase
6. Form closes
7. New review appears in list

### Booking Guide
1. User clicks "Book" button
2. Loading spinner appears
3. Booking request sent to Firebase
4. "Booked!" confirmation shown
5. Modal auto-closes after 3 seconds

---

## Responsive Design

### Desktop (1024px+)
- **Max Width**: 600px
- **Max Height**: 90vh
- **Centered**: Yes
- **Scrollable**: Content area

### Tablet (640px - 1024px)
- **Max Width**: 90%
- **Max Height**: 90vh
- **Centered**: Yes
- **Scrollable**: Content area

### Mobile (< 640px)
- **Max Width**: 90%
- **Max Height**: 90vh
- **Centered**: Yes
- **Scrollable**: Content area

---

## Color Scheme

### Background
- **Modal**: #fff
- **Backdrop**: rgba(0, 0, 0, 0.5)
- **Content**: #F5F0E8

### Text
- **Primary**: #1A1208
- **Secondary**: #7A6E61
- **Tertiary**: #B8B0A4

### Accents
- **Primary**: #1E4D2B
- **Secondary**: #C4622D
- **Success**: #2D7A4A

### Borders
- **Default**: #DDD6C8
- **Light**: #F5F0E8

---

## Summary

The modal provides:
- ✅ Complete guide information
- ✅ Smooth animations
- ✅ Review system
- ✅ Booking functionality
- ✅ Responsive design
- ✅ Accessibility support
- ✅ Error handling
- ✅ Loading states

