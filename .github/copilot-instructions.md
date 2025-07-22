# AGS/Astal Gnim Shell

**[First Widgets](https://aylur.github.io/ags/guide/first-widgets.html)**:

- Introduction to creating widgets using JSX.
- Covers entry points, nesting widgets, displaying data, conditional rendering, and state management.
- Explains how to use JSX syntax for widget creation and nesting.
- Demonstrates dynamic rendering, list rendering, and handling widget signal events.
- Provides examples of state management using signals like `createState` and `createBinding`.

**[App and CLI](https://aylur.github.io/ags/guide/app-cli.html)**:

- Guide to starting applications and managing multiple instances.
- Explains how to define unique instance names and interact with instances via CLI messaging.
- Details toggling windows by their names and registering them with the application.
- Includes examples of client-server interactions and handling requests using `requestHandler`.
- Covers running JavaScript code from the CLI using `eval()` and managing main and client blocks.

**[Utilities](https://aylur.github.io/ags/guide/utilities.html)**:

- Built-in utilities for file operations, timeouts, intervals, and subprocess management.
- Explains file reading, writing, and monitoring with examples.
- Demonstrates creating timeouts, intervals, and idle callbacks for scheduling tasks.
- Provides examples of executing external commands and scripts using `exec` and `subprocess`.
- Includes HTTP request handling with `fetch` and creating dynamic signals with `createPoll`.

**[Resources](https://aylur.github.io/ags/guide/resources.html)**:

- Links to GJS and Astal libraries for extended functionality.
- References tools for authentication, battery management, media control, and more.
- Highlights libraries like `astal-auth`, `astal-battery`, `astal-mpris`, and `astal-network`.
- Provides links to external resources like GJS documentation and guides for deeper understanding.

**[Intrinsics](https://aylur.github.io/ags/guide/intrinsics.html)**:

- Overview of built-in intrinsic elements for GTK3 and GTK4.
- Lists widgets like buttons, labels, sliders, windows, and their properties.
- Includes examples of using intrinsic elements like `<box>`, `<button>`, `<label>`, and `<slider>`.
- Explains how to use intrinsic elements without explicit imports and their compatibility with JSX.

**[AGS GitHub Repository](https://github.com/Aylur/ags/)**:

- Source code, documentation, and community contributions.
- Provides access to issues, pull requests, discussions, and the latest releases.
- Includes links to the AGS wiki, contributors, and project sponsors.
- Highlights the repository's focus on scaffolding CLI tools for Astal and Gnim projects.

**[Migration Guide](https://aylur.github.io/ags/guide/migration-guide.html)**:

- Provides a comprehensive guide for migrating from older versions of AGS.
- Details changes in APIs, widgets, and utilities.
- Includes examples and best practices for updating existing projects.

**[FAQ](https://aylur.github.io/ags/guide/faq.html)**:

- Frequently asked questions about AGS.
- Covers common issues, troubleshooting, and best practices.
- Provides quick solutions and links to detailed guides.

# GTK3 Documentation

**[GTK3 Main Documentation](https://docs.gtk.org/gtk3/)**

- Official API reference and guides for GTK3.
- Includes Getting Started, Widget Gallery, Classes Hierarchy, and detailed API docs.

**[Getting Started with GTK3](https://docs.gtk.org/gtk3/getting_started.html)**

- Step-by-step C examples for windows, buttons, layouts, signals, and application structure.
- Shows how to use GtkBuilder for UI files and event handling.

**[Widget Gallery](https://docs.gtk.org/gtk3/visual_index.html)**

- Visual index of all GTK3 widgets, each linking to detailed documentation.
- Useful for quickly finding widget types and their properties.

**[Classes Hierarchy](https://docs.gtk.org/gtk3/classes_hierarchy.html)**

- Inheritance tree for all GTK3 classes.
- Helps understand widget relationships and base classes.

**[Classes API Reference](https://docs.gtk.org/gtk3/#classes)**

- Detailed documentation for every GTK3 class, including properties, methods, and signals.
- Use this for in-depth reference on any GTK3 widget or object.

- [GNOME Adwaita Color Palette (SCSS)](https://gitlab.gnome.org/GNOME/gtk/-/blob/gtk-3-22/gtk/theme/Adwaita/_colors-public.scss) — Official GNOME palette color reference used in Adwaita themes.
