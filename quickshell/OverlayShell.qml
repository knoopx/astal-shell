import QtQuick 2.15
import Quickshell

FloatingWindow {
    id: overlayWindow
    
    // Full screen overlay
    width: screen.geometry.width
    height: screen.geometry.height
    
    screen: Quickshell.screens[0]
    visible: true
    color: "transparent"
    
    // Top Bar Overlay
    Item {
        id: topBarOverlay
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.topMargin: 100
        anchors.leftMargin: 300
        anchors.rightMargin: 300
        height: 32
        
        TopBar {}
    }
    
    // Bottom Bar Overlay  
    Item {
        id: bottomBarOverlay
        anchors.bottom: parent.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottomMargin: 100
        anchors.leftMargin: 300
        anchors.rightMargin: 300
        height: 48
        
        BottomBar {}
    }
    
    // Left Bar Overlay
    Item {
        id: leftBarOverlay
        anchors.left: parent.left
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        anchors.leftMargin: 16
        anchors.topMargin: 110
        anchors.bottomMargin: 96
        width: 48
        
        LeftBar {}
    }
    
    // Center Widgets Overlay
    Item {
        id: centerWidgetsOverlay
        anchors.centerIn: parent
        
        CenterWidgets {}
    }
    
    // Volume OSD Overlay
    Item {
        id: volumeOSDOverlay
        anchors.centerIn: parent
        anchors.verticalCenterOffset: -100
        width: 300
        height: 100
        visible: volumeOSD.showing
        
        VolumeOSD {
            id: volumeOSD
        }
    }
    
    // Brightness OSD Overlay
    Item {
        id: brightnessOSDOverlay
        anchors.centerIn: parent
        anchors.verticalCenterOffset: 120
        width: 300
        height: 100
        visible: brightnessOSD.showing
        
        BrightnessOSD {
            id: brightnessOSD
        }
    }
}