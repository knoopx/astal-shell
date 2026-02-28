import { createPoll } from "ags/time";
import { exec } from "ags/process";

interface NvidiaStats {
  temperature: number;
  utilization: number;
  memoryUsed: number;
  memoryTotal: number;
}

const nvidiaPoll = createPoll<NvidiaStats>(
  { temperature: 0, utilization: 0, memoryUsed: 0, memoryTotal: 0 },
  2000,
  () => {
    try {
      const out = exec([
        "bash",
        "-c",
        "nvidia-smi --query-gpu=temperature.gpu,utilization.gpu,memory.used,memory.total --format=csv,noheader,nounits",
      ]);
      const [temperature, utilization, memoryUsed, memoryTotal] = out
        .split(", ")
        .map(Number);
      return { temperature, utilization, memoryUsed, memoryTotal };
    } catch {
      return { temperature: 0, utilization: 0, memoryUsed: 0, memoryTotal: 0 };
    }
  },
);

export default nvidiaPoll;
