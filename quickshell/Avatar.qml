import QtQuick 2.15
import Quickshell

Item {
    id: avatar
    width: 32
    height: 32
    signal clicked()
    property string avatarSource: {
        // Try user's system avatar first, fall back to default
        let userAvatar = "/home/" + Quickshell.env.USER + "/.face";
        return Qt.resolvedUrl("default-avatar.png");
    }
    property bool hovered: mouseArea.containsMouse

    Rectangle {
        anchors.fill: parent
        radius: width / 2
        color: "#313244"
        border.width: hovered ? 2 : 1
        border.color: hovered ? "#89b4fa" : "#6c7086"
        
        Behavior on border.width {
            NumberAnimation { duration: 150 }
        }
        
        Behavior on border.color {
            ColorAnimation { duration: 150 }
        }

        Image {
            id: avatarImage
            anchors.fill: parent
            anchors.margins: 2
            source: avatar.avatarSource
            fillMode: Image.PreserveAspectCrop
            smooth: true
            clip: true
            
            layer.enabled: true
            layer.effect: Item {
                Rectangle {
                    anchors.fill: parent
                    radius: width / 2
                    color: "transparent"
                    border.width: 0
                }
            }
            
            onStatusChanged: {
                if (avatarImage.status === Image.Error) {
                    avatarImage.source = Qt.resolvedUrl("default-avatar.png");
                }
            }
        }
        
        MouseArea {
            id: mouseArea
            anchors.fill: parent
            hoverEnabled: true
            onClicked: avatar.clicked()
            cursorShape: Qt.PointingHandCursor
        }
    }
}
