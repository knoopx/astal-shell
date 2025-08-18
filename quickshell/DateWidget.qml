import QtQuick 2.15

Item {
    id: dateWidget
    width: dateText.width
    height: dateText.height
    
    property string dateFormat: "ddd dd MMM" // Qt date format equivalent to "%a %d %b"
    
    Text {
        id: dateText
        text: Qt.formatDate(new Date(), dateFormat)
        color: "#cdd6f4"
        font.pixelSize: 14
        font.weight: Font.Bold
        horizontalAlignment: Text.AlignHCenter
    }
    
    MouseArea {
        anchors.fill: parent
        cursorShape: Qt.PointingHandCursor
        onClicked: {
            // Open calendar application
            console.log("Opening calendar...")
            // In real implementation: niri.toggleOverview() and subprocess("gnome-calendar")
        }
    }
    
    // Update date every minute
    Timer {
        interval: 60000 // 60 seconds
        running: true
        repeat: true
        onTriggered: {
            dateText.text = Qt.formatDate(new Date(), dateFormat)
        }
    }
}