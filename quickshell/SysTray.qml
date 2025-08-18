import QtQuick 2.15
import Quickshell
import Quickshell.Services.SystemTray

Row {
    spacing: 4
    
    Repeater {
        model: SystemTray.items
        
        Rectangle {
            width: 28
            height: 28
            color: "transparent"
            
            Rectangle {
                anchors.centerIn: parent
                width: 20
                height: 20
                color: "transparent"
                
                Image {
                    anchors.fill: parent
                    source: modelData.icon
                    fillMode: Image.PreserveAspectFit
                    smooth: true
                }
                
                MouseArea {
                    anchors.fill: parent
                    onClicked: {
                        if (mouse.button == Qt.LeftButton) {
                            modelData.activate()
                        } else if (mouse.button == Qt.RightButton) {
                            modelData.menu.open()
                        }
                    }
                }
            }
        }
    }
}