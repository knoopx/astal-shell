import LabeledMeter from "./LabeledMeter";
import nvidiaPoll from "./nvidiaPoll";

export default () => (
  <LabeledMeter
    value={nvidiaPoll((v) =>
      v.memoryTotal > 0 ? v.memoryUsed / v.memoryTotal : 0,
    )}
    label="VRAM"
  />
);
