import LabeledMeter from "./LabeledMeter";
import nvidiaPoll from "./nvidiaPoll";

export default () => (
  <LabeledMeter value={nvidiaPoll((v) => v.utilization / 100)} label="GPU" />
);
