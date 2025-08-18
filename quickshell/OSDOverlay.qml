import QtQuick 2.15
import Quickshell

FloatingWindow {
    id: osdOverlay
    
    width: 300
    height: 100
    visible: true
    color: "transparent"
    
    flags: Qt.WindowStaysOnTopHint | Qt.WindowDoesNotAcceptFocus | Qt.WindowTransparentForInput
    
    screen: Quickshell.screens[0]
    
    x: (screen.geometry.width - width) / 2
    y: (screen.geometry.height - height) / 2
    
    // Volume OSD
    VolumeOSD {
        id: volumeOSD
        anchors.centerIn: parent
    }
    
    // Brightness OSD  
    BrightnessOSD {
        id: brightnessOSD
        anchors.centerIn: parent
    }
}