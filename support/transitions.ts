import GLib from "gi://GLib";

interface TransitionOptions {
  fadeInDuration?: number;
  fadeOutDuration?: number;
  fadeInDelay?: number;
}

const defaultOptions: Required<TransitionOptions> = {
  fadeInDuration: 300,
  fadeOutDuration: 60,
  fadeInDelay: 10,
};

function animateOpacity(
  widget: any,
  duration: number,
  easeFn: (progress: number) => number,
  onComplete?: () => void,
) {
  const startTime = Date.now();

  const step = () => {
    const progress = Math.min((Date.now() - startTime) / duration, 1);
    widget.set_opacity(easeFn(progress));

    if (progress < 1) {
      GLib.timeout_add(GLib.PRIORITY_DEFAULT, 16, () => {
        step();
        return false;
      });
    } else {
      onComplete?.();
    }
    return false;
  };

  step();
}

export function applyOpacityTransition(
  widget: any,
  visible: boolean,
  options: TransitionOptions = {},
) {
  const opts = { ...defaultOptions, ...options };

  if (visible) {
    widget.set_visible(true);
    widget.set_opacity(0);

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, opts.fadeInDelay, () => {
      animateOpacity(
        widget,
        opts.fadeInDuration,
        (p) => 1 - Math.pow(1 - p, 3),
      );
      return false;
    });
  } else {
    animateOpacity(
      widget,
      opts.fadeOutDuration,
      (p) => 1 - Math.pow(p, 3),
      () => widget.set_visible(false),
    );
  }
}
