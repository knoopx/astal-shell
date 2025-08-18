import QtQuick 2.15
import Quickshell

PanelWindow {
    id: leftBar

    // Overlay configuration
    exclusiveZone: 0
    aboveWindows: true
    focusable: false
    color: "transparent"
    
    anchors {
        left: true
        top: true
        bottom: true
    }
    
    margins {
        left: 16
        top: 110
        bottom: 96
    }

    Rectangle {
        anchors.fill: parent
        color: "transparent"
        
        // Vertical box matching Astal layout
        WorkspaceIndicator {
            id: workspaceIndicator
            anchors.centerIn: parent
            width: parent.width
        }
    }
}