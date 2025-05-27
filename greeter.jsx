import { App, Astal, Gtk } from "astal/gtk3";
import Greet from "gi://AstalGreet";
import Gdk from "gi://Gdk";

const details = {
    USER: "",
    PASSWORD: "",
};

const state = {
    error: "",
    isLoggingIn: false,
};

const css = `
    .login-container {
        background: @theme_bg_color;
    }

    .login-card {
        background: @card_bg_color;
        border-radius: 12px;
        border: 1px solid @borders;
        padding: 24px;
        margin: 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .input-field {
        border-radius: 6px;
        padding: 12px;
        margin: 6px 0;
        min-height: 32px;
    }

    .avatar {
        font-size: 48px;
        margin: 12px;
    }

    .time-display {
        margin-bottom: 24px;
    }

    .time {
        font-size: 36px;
        font-weight: 200;
        margin-bottom: 4px;
    }

    .date {
        font-size: 16px;
        opacity: 0.7;
    }

    .input-container {
        margin: 12px 0;
    }

    .input-label {
        font-size: 13px;
        margin-bottom: 6px;
        font-weight: 500;
    }

    .error-message {
        color: @error_color;
        background: alpha(@error_color, 0.1);
        border: 1px solid alpha(@error_color, 0.3);
        border-radius: 6px;
        padding: 12px;
        margin: 12px 0;
        font-size: 13px;
    }

    .login-button {
        border-radius: 6px;
        padding: 12px;
        margin: 12px 0;
        min-height: 32px;
        background: @theme_selected_bg_color;
        color: @theme_selected_fg_color;
    }

    .login-button:disabled {
        opacity: 0.5;
    }
`;

// Apply CSS
try {
    const provider = new Gtk.CssProvider();
    provider.load_from_data(css);
    Gtk.StyleContext.add_provider_for_screen(
        Gdk.Screen.get_default(),
        provider,
        Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
    );
} catch (e) {
    print("CSS loading failed:", e);
}

function login() {
    const { USER, PASSWORD } = details;

    if (!USER || !PASSWORD) {
        state.error = "Please enter both username and password";
        App.get_window("lockscreen")?.queue_draw();
        return;
    }

    state.error = "";
    state.isLoggingIn = true;
    App.get_window("lockscreen")?.queue_draw();

    Greet.login(USER, PASSWORD, "niri-session", (_, res) => {
        try {
            Greet.login_finish(res);
            App.quit();
            execAsync(["niri", "msg", "action", "quit", "-s"]);
        } catch (err) {
            state.error = err.message || "Authentication failed. Please check your credentials.";
            state.isLoggingIn = false;
            App.get_window("lockscreen")?.queue_draw();
            printerr(err);
        }
    });
}

const TimeDisplay = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <box className="time-display" vertical={true} halign={Gtk.Align.CENTER}>
            <label className="time" label={timeStr} />
            <label className="date" label={dateStr} />
        </box>
    );
};

const Avatar = () => {
    return (
        <box halign={Gtk.Align.CENTER}>
            <label className="avatar" label="👤" />
        </box>
    );
};

const ErrorDisplay = () => {
    if (!state.error) {
        return null;
    }

    return (
        <box className="input-container" vertical={true}>
            <label
                className="error-message"
                label={state.error}
                wrap={true}
                halign={Gtk.Align.FILL}
            />
        </box>
    );
};

const Username = () => {
    return (
        <box className="input-container" vertical={true}>
            <label className="input-label" label="Username" />
            <entry
                className="input-field"
                placeholder_text="Enter your username"
                onChanged={(self) => {
                    details.USER = self.text;
                    // Clear error when user starts typing
                    if (state.error) {
                        state.error = "";
                        App.get_window("lockscreen")?.queue_draw();
                    }
                }}
                onActivate={() => {
                    // Focus password field when Enter is pressed
                }}
            />
        </box>
    );
};

const Password = () => {
    return (
        <box className="input-container" vertical={true}>
            <label className="input-label" label="Password" />
            <entry
                className="input-field"
                placeholder_text="Enter your password"
                visibility={false}
                onChanged={(self) => {
                    details.PASSWORD = self.text;
                    // Clear error when user starts typing
                    if (state.error) {
                        state.error = "";
                        App.get_window("lockscreen")?.queue_draw();
                    }
                }}
                onActivate={() => {
                    login();
                }}
            />
        </box>
    );
};

const LoginButton = () => {
    return (
        <box className="input-container" vertical={true}>
            <button
                className="login-button"
                label={state.isLoggingIn ? "Signing in..." : "Sign In"}
                sensitive={!state.isLoggingIn}
                onClicked={() => {
                    login();
                }}
            />
        </box>
    );
};

const Greeter = () => {
    const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor;
    return (
        <window
            monitor={0}
            anchor={TOP | LEFT | RIGHT | BOTTOM}
            keymode={Astal.Keymode.ON_DEMAND}
            className="login-container"
        >
            <box
                vertical={true}
                hexpand={true}
                vexpand={true}
                halign={Gtk.Align.CENTER}
                valign={Gtk.Align.CENTER}
            >
                <TimeDisplay />

                <box
                    className="login-card"
                    vertical={true}
                    halign={Gtk.Align.CENTER}
                    valign={Gtk.Align.CENTER}
                >
                    <Avatar />

                    <ErrorDisplay />
                    <Username />
                    <Password />
                    <LoginButton />
                </box>
            </box>
        </window>
    );
};

App.start({
      instanceName: "lockscreen",
    main() {
        Greeter();
    },
});
