import QtQuick 2.15
import Quickshell

ShellRoot {
    TopBar {}
    BottomBar {}
    LeftBar {}
    CenterWidgets {}
    
    // OSD overlays using PopupWindow
    VolumeOSD {
        id: volumeOSD
    }
    
    BrightnessOSD {
        id: brightnessOSD
    }
}
