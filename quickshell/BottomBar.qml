import QtQuick 2.15
import Quickshell

PanelWindow {
    id: bottomBar

    // Overlay configuration
    exclusiveZone: 0
    aboveWindows: true
    focusable: false
    color: "transparent"
    
    anchors {
        left: true
        right: true
        bottom: true
    }
    
    margins {
        left: 300
        right: 300
        bottom: 100
    }

    ListModel {
        id: windowModel
        
        Component.onCompleted: {
            append({ "title": "Terminal", "icon": "terminal", "focused": true, "pos": 2 })
            append({ "title": "Browser", "icon": "browser", "focused": false, "pos": 1 })
            append({ "title": "Editor", "icon": "editor", "focused": false, "pos": 3 })
        }
    }

    function sortWindows() {
        let windows = [];
        for (let i = 0; i < windowModel.count; i++) {
            windows.push(windowModel.get(i));
        }
        windows.sort((a, b) => a.pos - b.pos);
        
        windowModel.clear();
        for (let window of windows) {
            windowModel.append(window);
        }
    }

    Component.onCompleted: sortWindows()

    Rectangle {
        anchors.fill: parent
        color: "transparent"
        
        // Center section only - matching Astal centerbox layout
        Row {
            anchors.centerIn: parent
            spacing: 8
            
            Repeater {
                model: windowModel
                
                Rectangle {
                    width: 40
                    height: 32
                    radius: 6
                    color: model.focused ? "#313244" : "#1e1e2e"
                    border.width: model.focused ? 2 : 1
                    border.color: model.focused ? "#89b4fa" : "#45475a"
                    
                    Behavior on color {
                        ColorAnimation { duration: 200 }
                    }
                    
                    Behavior on border.color {
                        ColorAnimation { duration: 200 }
                    }
                    
                    Text {
                        anchors.centerIn: parent
                        text: model.icon
                        color: "#cdd6f4"
                        font.pixelSize: 16
                    }
                    
                    MouseArea {
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        
                        onClicked: {
                            // Focus this window
                            for (let i = 0; i < windowModel.count; i++) {
                                windowModel.setProperty(i, "focused", i === index);
                            }
                        }
                    }
                }
            }
        }
    }
}