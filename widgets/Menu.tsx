import GObject from "gi://GObject";
import { Gtk, astalify, type ConstructProps } from "astal/gtk3";

export class Menu extends astalify(Gtk.Menu) {
  static {
    GObject.registerClass(this);
  }

  constructor(props: ConstructProps<Menu, Gtk.Menu.ConstructorProps>) {
    super(props as any);
  }
}

export class MenuItem extends astalify(Gtk.MenuItem) {
  static {
    GObject.registerClass(this);
  }

  constructor(
    props: ConstructProps<
      MenuItem,
      Gtk.MenuItem.ConstructorProps,
      { submenu: Gtk.Widget }
    >
  ) {
    super(props as any);
  }
}
