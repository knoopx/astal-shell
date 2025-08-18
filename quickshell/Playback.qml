import QtQuick 2.15

Item {
    id: playback
    width: playbackRow.width
    height: 36
    
    property var mockPlayer: {
        "artist": "Glass Animals",
        "title": "Heat Waves",
        "coverArt": "",
        "isPlaying": true,
        "canPlay": true,
        "canGoNext": true
    }
    
    Row {
        id: playbackRow
        spacing: 0
        anchors.verticalCenter: parent.verticalCenter
        
        // Album Art with Play/Pause Overlay
        Item {
            width: 36
            height: 36
            
            Rectangle {
                anchors.fill: parent
                radius: 4
                border.width: 2
                border.color: Qt.rgba(1, 1, 1, 0.2)
                color: "#313244"
                
                // Album artwork background
                Rectangle {
                    anchors.fill: parent
                    anchors.margins: 2
                    radius: 3
                    color: "#45475a"
                    
                    Text {
                        anchors.centerIn: parent
                        text: "🎵"
                        font.pixelSize: 16
                        color: "#cdd6f4"
                    }
                }
                
                // Play/Pause button overlay
                Rectangle {
                    anchors.centerIn: parent
                    width: 24
                    height: 24
                    radius: 12
                    color: Qt.rgba(0, 0, 0, 0.6)
                    visible: mouseArea.containsMouse
                    
                    Text {
                        anchors.centerIn: parent
                        text: mockPlayer.isPlaying ? "⏸" : "▶"
                        color: "#cdd6f4"
                        font.pixelSize: 12
                    }
                }
                
                MouseArea {
                    id: mouseArea
                    anchors.fill: parent
                    hoverEnabled: true
                    onClicked: {
                        // Toggle play/pause
                        mockPlayer.isPlaying = !mockPlayer.isPlaying
                    }
                }
            }
        }
        
        // Track Info
        Item {
            width: 176  // 160 + 8 + 8 for margins
            height: parent.height
            
            Column {
                width: 160
                anchors.left: parent.left
                anchors.leftMargin: 8
                anchors.right: parent.right
                anchors.rightMargin: 8
                anchors.verticalCenter: parent.verticalCenter
                spacing: 2
            
            Text {
                text: mockPlayer.artist
                color: "#cdd6f4"
                font.pixelSize: 11
                font.weight: Font.Bold
                width: parent.width
                elide: Text.ElideRight
                visible: text.length > 0
            }
            
            Text {
                text: mockPlayer.title
                color: "#bac2de"
                font.pixelSize: 10
                opacity: 0.8
                width: parent.width
                elide: Text.ElideRight
            }
        }
        }
        
        // Next button
        Rectangle {
            width: 24
            height: 24
            anchors.verticalCenter: parent.verticalCenter
            color: "transparent"
            visible: mockPlayer.canGoNext
            
            Text {
                anchors.centerIn: parent
                text: "⏭"
                color: "#cdd6f4"
                font.pixelSize: 12
            }
            
            MouseArea {
                anchors.fill: parent
                onClicked: {
                    // Next track
                    console.log("Next track")
                }
            }
        }
    }
}
