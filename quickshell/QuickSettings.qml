import QtQuick 2.15

Item {
    id: quickSettings
    width: quickSettingsRow.width
    height: 32
    
    property real volume: 0.7
    property bool muted: false
    
    function getVolumeIcon(volume, muted) {
        if (muted || volume === 0) return "🔇"
        if (volume < 0.33) return "🔈"
        if (volume < 0.67) return "🔉"
        return "🔊"
    }
    
    Row {
        id: quickSettingsRow
        anchors.left: parent.left
        anchors.leftMargin: 8
        anchors.verticalCenter: parent.verticalCenter
        spacing: 8
        
        // Volume Control
        Row {
            spacing: 4
            anchors.verticalCenter: parent.verticalCenter
            
            Text {
                text: getVolumeIcon(volume, muted)
                font.pixelSize: 12
                color: "#cdd6f4"
                anchors.verticalCenter: parent.verticalCenter
            }
            
            Rectangle {
                width: 100
                height: 4
                color: "#313244"
                radius: 2
                anchors.verticalCenter: parent.verticalCenter
                
                Rectangle {
                    width: parent.width * (muted ? 0 : volume)
                    height: parent.height
                    color: muted ? "#6c7086" : "#89b4fa"
                    radius: parent.radius
                    
                    Behavior on width {
                        NumberAnimation { duration: 150 }
                    }
                    
                    Behavior on color {
                        ColorAnimation { duration: 150 }
                    }
                }
                
                MouseArea {
                    anchors.fill: parent
                    onClicked: {
                        volume = mouse.x / parent.width
                        muted = false
                    }
                }
            }
        }
        
        // Action Buttons
        Row {
            spacing: 4
            anchors.verticalCenter: parent.verticalCenter
            
            // Shutdown Button
            Rectangle {
                width: 24
                height: 24
                radius: 12
                color: Qt.rgba(1, 1, 1, 0.12)
                
                Text {
                    anchors.centerIn: parent
                    text: "⏻"
                    color: "#cdd6f4"
                    font.pixelSize: 12
                }
                
                MouseArea {
                    anchors.fill: parent
                    onClicked: {
                        console.log("Shutdown clicked")
                        // TODO: Add confirmation dialog
                    }
                }
            }
            
            // Reboot Button
            Rectangle {
                width: 24
                height: 24
                radius: 12
                color: Qt.rgba(1, 1, 1, 0.12)
                
                Text {
                    anchors.centerIn: parent
                    text: "🔄"
                    color: "#cdd6f4"
                    font.pixelSize: 12
                }
                
                MouseArea {
                    anchors.fill: parent
                    onClicked: {
                        console.log("Reboot clicked")
                        // TODO: Add confirmation dialog
                    }
                }
            }
            
            // Logout Button
            Rectangle {
                width: 24
                height: 24
                radius: 12
                color: Qt.rgba(1, 1, 1, 0.12)
                
                Text {
                    anchors.centerIn: parent
                    text: "🚪"
                    color: "#cdd6f4"
                    font.pixelSize: 12
                }
                
                MouseArea {
                    anchors.fill: parent
                    onClicked: {
                        console.log("Logout clicked")
                        // TODO: Add confirmation dialog
                    }
                }
            }
        }
    }
}
