import QtQuick 2.15

Item {
    id: volumeProgress
    width: 80
    height: 120
    property int value: 60
    property string iconName: "audio-volume-high"

    Rectangle {
        anchors.fill: parent
        color: "#222222CC"
        radius: 32
        border.color: "transparent"
        
        Column {
            anchors.centerIn: parent
            spacing: 12
            
            // Volume bar (vertical)
            Rectangle {
                width: 24
                height: 80
                color: "#444"
                radius: 12
                
                Rectangle {
                    width: parent.width - 4
                    height: (parent.height - 4) * volumeProgress.value / 100
                    y: parent.height - height - 2
                    x: 2
                    color: "#448aff"
                    radius: 10
                    
                    Behavior on height { NumberAnimation { duration: 150 } }
                }
            }
            
            // Volume icon
            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: volumeProgress.iconName === "audio-volume-muted" ? "🔇" : "🔊"
                font.pixelSize: 24
                color: "#fff"
            }
        }
    }
}
