import GObject from 'gi://GObject'
import { Gtk, astalify, type ConstructProps } from 'astal/gtk3'

type Props = ConstructProps<ListBox, Gtk.ListBox.ConstructorProps>

class ListBox extends astalify(Gtk.ListBox) {
  static { GObject.registerClass(this) }

  constructor(props: Props) {
    super(props as any)
  }
}

export default ListBox
