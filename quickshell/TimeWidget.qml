import QtQuick 2.15

Item {
    id: timeWidget
    width: timeText.width
    height: timeText.height
    
    property string timeFormat: "hh:mm" // Qt time format equivalent to "%H:%M"
    
    Text {
        id: timeText
        text: Qt.formatTime(new Date(), timeFormat)
        color: "#bac2de"
        font.pixelSize: 11
        font.weight: Font.Normal
        opacity: 0.8
        horizontalAlignment: Text.AlignHCenter
        anchors.top: parent.top
        anchors.topMargin: -8 // margin-top: -8px equivalent
    }
    
    MouseArea {
        anchors.fill: parent
        cursorShape: Qt.PointingHandCursor
        // No click action in original implementation
    }
    
    // Update time every second
    Timer {
        interval: 1000 // 1 second
        running: true
        repeat: true
        onTriggered: {
            timeText.text = Qt.formatTime(new Date(), timeFormat)
        }
    }
}