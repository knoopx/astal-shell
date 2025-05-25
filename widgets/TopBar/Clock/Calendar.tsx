import { Gtk, astalify, ConstructProps } from "astal/gtk3";
import { GObject } from "astal";

export default class Calendar extends astalify(Gtk.Calendar) {
  static {
    GObject.registerClass(this);
  }

  constructor(props: ConstructProps<Calendar, Gtk.Calendar.ConstructorProps>) {
    super(props as any);
  }
}
