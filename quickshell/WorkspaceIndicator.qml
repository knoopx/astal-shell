import QtQuick 2.15

Item {
    id: workspaceIndicator
    width: 6
    height: childrenRect.height
    
    // Mock workspaces data - matches original niri workspaces
    property var workspaces: [
        { idx: 1, is_focused: true },
        { idx: 2, is_focused: false },
        { idx: 3, is_focused: false },
        { idx: 4, is_focused: false },
        { idx: 5, is_focused: false }
    ]
    
    function focusWorkspace(idx) {
        // Mock workspace focusing - would call niri.focusWorkspace(idx) in real implementation
        for (var i = 0; i < workspaces.length; i++) {
            workspaces[i].is_focused = (workspaces[i].idx === idx)
        }
        workspacesChanged()
        console.log("Focusing workspace:", idx)
    }

    Rectangle {
        anchors.fill: parent
        color: "transparent"
        radius: 2
        
        Column {
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.top: parent.top
            anchors.topMargin: 4
            anchors.bottom: parent.bottom
            anchors.bottomMargin: 4
            spacing: 6
            
            Repeater {
                model: workspaceIndicator.workspaces
                
                Rectangle {
                    width: 6
                    height: 24
                    radius: 3
                    color: modelData.is_focused ? "#89b4fa" : Qt.rgba(1, 1, 1, 0.9)
                    
                    Behavior on color {
                        ColorAnimation { duration: 200; easing.type: Easing.OutQuad }
                    }
                    
                    MouseArea {
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        
                        onClicked: {
                            workspaceIndicator.focusWorkspace(modelData.idx)
                        }
                        
                        onEntered: {
                            parent.color = modelData.is_focused ? 
                                "#89b4fa" : Qt.rgba(1, 1, 1, 1.0)
                        }
                        
                        onExited: {
                            parent.color = modelData.is_focused ? 
                                "#89b4fa" : Qt.rgba(1, 1, 1, 0.9)
                        }
                    }
                }
            }
        }
    }
    
    // Mock timer to simulate workspace switching
    Timer {
        interval: 5000
        running: true
        repeat: true
        onTriggered: {
            // Simulate automatic workspace switching for demo
            var currentFocused = -1
            for (var i = 0; i < workspaces.length; i++) {
                if (workspaces[i].is_focused) {
                    currentFocused = i
                    break
                }
            }
            var nextWorkspace = (currentFocused + 1) % workspaces.length
            focusWorkspace(workspaces[nextWorkspace].idx)
        }
    }
}
