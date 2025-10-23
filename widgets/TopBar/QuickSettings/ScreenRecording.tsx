import { createState, onCleanup, With } from "ags";
import { execAsync } from "ags/process";
import ActionButton from "./ActionButton";
import { getCurrentTheme } from "../../../support/theme";

const sendNotification = async (
  summary: string,
  body: string,
  icon?: string,
  urgency?: "low" | "normal" | "critical"
) => {
  try {
    const params = ["notify-send", summary, body, "-a", "astal-shell"];

    if (icon) {
      params.push("-i", icon);
    }

    if (urgency) {
      params.push("-u", urgency);
    }

    await execAsync(params);
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
};

export default () => {
  const [isRecording, setIsRecording] = createState(false);
  const [currentFile, setCurrentFile] = createState<string | null>(null);
  const [processId, setProcessId] = createState<number | null>(null);

  // Clean up resources when component is destroyed
  onCleanup(() => {
    if (processId.get()) {
      try {
        execAsync(["kill", processId.get().toString()]);
      } catch (error) {
        console.error("Failed to cleanup recording process:", error);
      }
    }
  });



  const startRecording = async () => {
    try {
      // Check if wf-recorder is available
      try {
        await execAsync(["which", "wf-recorder"]);
      } catch (error) {
        throw new Error(
          "wf-recorder is not installed. Please install it first."
        );
      }

      // Get actual home directory
      const homeDir = await execAsync(["sh", "-c", "echo $HOME"]);
      const cleanHomeDir = homeDir.trim();

      // Generate filename with timestamp
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, -5);
      const filename = `${cleanHomeDir}/Videos/screen-recording-${timestamp}.mp4`;

      // Ensure Videos directory exists
      await execAsync(["mkdir", "-p", `${cleanHomeDir}/Videos`]);

      // Verify the directory is writable
      try {
        await execAsync(["test", "-w", `${cleanHomeDir}/Videos`]);
      } catch (error) {
        throw new Error(
          `Videos directory is not writable: ${cleanHomeDir}/Videos`
        );
      }

      // Store the current file path
      setCurrentFile(filename);

      // Start wf-recorder
      await execAsync([
        "sh",
        "-c",
        `wf-recorder -f "${filename}" > /dev/null 2>&1 &`,
      ]);

      // Wait a moment and find the wf-recorder process
      await new Promise((resolve) => setTimeout(resolve, 500));

      const pidOutput = await execAsync([
        "sh",
        "-c",
        `pgrep -f "wf-recorder -f ${filename}" | head -1`,
      ]);

      const pid = parseInt(pidOutput.trim());
      if (isNaN(pid)) {
        throw new Error("Failed to find wf-recorder process");
      }

      setProcessId(pid);

      // Only set recording state after successful start
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      // Reset state on failure
      setProcessId(null);
      setIsRecording(false);
      setCurrentFile(null);
      // Send notification about failure
      await sendNotification(
        "Screen Recording",
        "Failed to start recording",
        "media-record-symbolic",
        "critical"
      );
    }
  };

  const stopRecording = async () => {
    if (processId.get() && isRecording.get()) {
      try {
        // Kill the wf-recorder process by PID
        await execAsync(["kill", processId.get().toString()]);

        // Check if the file was actually created
        const filePath = currentFile.get();
        if (filePath) {
          try {
            await execAsync(["test", "-f", filePath]);
            await sendNotification(
              "Screen Recording Complete",
              `Recording saved to: ${filePath}`,
              "media-record-symbolic",
              "normal"
            );
          } catch (error) {
            await sendNotification(
              "Screen Recording",
              "Recording process stopped but file was not created",
              "media-record-symbolic",
              "critical"
            );
          }
        }

        // Clean up
        setProcessId(null);
        setIsRecording(false);
        setCurrentFile(null);
      } catch (error) {
        console.error("Failed to stop recording:", error);
        await sendNotification(
          "Screen Recording",
          "Failed to stop recording",
          "media-record-symbolic",
          "critical"
        );
      }
    }
  };

  const handleClick = () => {
    if (isRecording.get()) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <With value={isRecording}>
      {(recording) => (
        <ActionButton
          icon={
            recording
              ? "media-playback-stop-symbolic"
              : "media-record-symbolic"
          }
          tooltipText={
            recording ? "Stop Recording" : "Start Screen Recording"
          }
          onClicked={handleClick}
          css={
            recording
              ? `
                  background-color: ${getCurrentTheme().status.error};
                  border: 1px solid ${getCurrentTheme().status.error.replace('0.8', '0.5')};
                `
              : ""
          }
        />
      )}
    </With>
  );
};
