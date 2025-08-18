import QtQuick 2.15
import Quickshell

PanelWindow {
    id: volumeOSD
    
    property int value: 50
    property bool muted: false
    property bool showing: false
    
    // Overlay configuration
    exclusiveZone: 0
    aboveWindows: true
    focusable: false
    color: "transparent"
    
    anchors {
        right: true
    }
    
    margins {
        right: 32
    }
    
    implicitWidth: 280
    implicitHeight: 120
    
    visible: showing
    
    // Auto-hide timer
    Timer {
        id: hideTimer
        interval: 2000
        onTriggered: volumeOSD.showing = false
    }
    
    onShowingChanged: {
        if (showing) {
            hideTimer.restart()
        }
    }
    
    Rectangle {
        anchors.fill: parent
        color: "#2d3142"
        radius: 8
        border.width: 1
        border.color: "#484b63"
        
        Column {
            anchors.centerIn: parent
            spacing: 12
            
            Row {
                anchors.horizontalCenter: parent.horizontalCenter
                spacing: 8
                
                Text {
                    text: volumeOSD.muted ? "🔇" : "🔊"
                    color: "#f9f9f9"
                    font.pixelSize: 24
                    anchors.verticalCenter: parent.verticalCenter
                }
                
                Text {
                    text: "Volume"
                    color: "#f9f9f9"
                    font.pixelSize: 16
                    anchors.verticalCenter: parent.verticalCenter
                }
            }
            
            Rectangle {
                width: 200
                height: 8
                color: "#484b63"
                radius: 4
                anchors.horizontalCenter: parent.horizontalCenter
                
                Rectangle {
                    width: (volumeOSD.value / 100) * parent.width
                    height: parent.height
                    color: volumeOSD.muted ? "#ef476f" : "#06d6a0"
                    radius: 4
                    
                    Behavior on width {
                        NumberAnimation { duration: 200; easing.type: Easing.OutQuad }
                    }
                    
                    Behavior on color {
                        ColorAnimation { duration: 200 }
                    }
                }
            }
            
            Text {
                text: volumeOSD.muted ? "Muted" : volumeOSD.value + "%"
                color: "#f9f9f9"
                font.pixelSize: 14
                anchors.horizontalCenter: parent.horizontalCenter
            }
        }
    }
    
    // Test function to show OSD
    function show() {
        showing = true
    }
}