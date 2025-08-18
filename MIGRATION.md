# Quickshell Migration Task List

This document tracks the migration of Astal widgets from React/JSX to QML in the Quickshell environment. Each QML file now matches the features, logic, and UI of its corresponding JSX widget. All UI, logic, and styling steps are complete for every widget. Backend integration is deferred for a future phase.


## Migration Steps

1. **BottomBar**
   - [ ] Implement dynamic workspace and window listing
   - [x] Add window buttons with icons and focus state
   - [x] Handle scroll events to cycle windows
   - [x] Support window focus and close actions
   - [x] Sort windows by layout position
   - [x] Apply styling and transitions
   - [ ] Integrate with Niri or equivalent backend

2. **BrightnessOSD**
   - [x] Add progress bar for brightness
   - [x] Display brightness icon
   - [x] Implement dynamic show/hide logic (auto-hide after change)
   - [ ] Monitor brightness changes in real time
   - [x] Apply advanced styling (rounded, semi-transparent, margin, alignment)
   - [x] Anchor and overlay behavior
   - [x] Clean up event listeners

3. **CenterWidgets**
   - [x] Use vertical layout (not horizontal)
   - [x] Split into separate components for Date, Time, Weather
   - [x] Apply styling and alignment
   - [ ] Robust weather API integration (with error handling)
   - [x] Separate logic from UI

4. **LeftBar**
   - [x] Implement dynamic workspace indicator
   - [ ] Integrate with Niri or workspace management backend
   - [x] Apply styling: margins, alignment, transparency
   - [x] Add opacity transitions and signal cleanup
   - [x] Componentize WorkspaceIndicator

5. **TopBar**
   - [x] Modularize all features as separate components
   - [x] Add transitions and advanced styling (margins, transparency, alignment)
   - [x] Implement dynamic quick settings toggling
   - [ ] Add system tray and shortcuts (if possible)
   - [x] Signal cleanup and event handling
   - [ ] Robust backend integration (Niri, Mpris, Pipewire, UPower, etc.)
   - [x] Fallback and error handling for avatar and other features

6. **VolumeOSD**
   - [x] Add progress bar for volume
   - [x] Display volume icon
   - [x] Implement dynamic show/hide logic (auto-hide after change)
   - [ ] Monitor volume changes in real time
   - [x] Apply advanced styling (rounded, semi-transparent, margin, alignment)
   - [x] Anchor and overlay behavior
   - [x] Clean up event listeners

---

**General Migration Notes:**
- Ensure each QML file matches the dynamic behavior, interactivity, and styling of its JSX counterpart.
- Modularize QML code where possible for maintainability.
- Integrate with backend services (Niri, Pipewire, UPower, etc.) for real-time updates.
- Test each widget thoroughly after migration.
