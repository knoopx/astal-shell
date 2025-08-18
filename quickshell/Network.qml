import QtQuick 2.15

Item {
    id: network
    width: 90
    height: 32
    
    property real downloadSpeed: 2048 // Mock: 2 KB/s
    property real uploadSpeed: 512   // Mock: 0.5 KB/s
    property real threshold: 1024    // 1 KB/s threshold
    
    function formatBytes(bytes) {
        if (bytes === 0) return "0 B/s";
        const k = 1024;
        const sizes = ["B/s", "KB/s", "MB/s", "GB/s"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    }
    
    Column {
        anchors.centerIn: parent
        width: parent.width
        spacing: 2
        visible: downloadSpeed >= threshold || uploadSpeed >= threshold
        
        // Upload row
        Row {
            width: parent.width
            spacing: 4
            visible: uploadSpeed >= threshold
            
            Text {
                text: "▲"
                color: "#f38ba8" // error_color equivalent
                font.pixelSize: 8
                anchors.verticalCenter: parent.verticalCenter
            }
            
            Text {
                text: formatBytes(uploadSpeed)
                color: "#cdd6f4"
                font.pixelSize: 8
                opacity: 0.8
                anchors.verticalCenter: parent.verticalCenter
            }
        }
        
        // Download row
        Row {
            width: parent.width
            spacing: 4
            visible: downloadSpeed >= threshold
            
            Text {
                text: "▼"
                color: "#a6e3a1" // success_color equivalent
                font.pixelSize: 8
                anchors.verticalCenter: parent.verticalCenter
            }
            
            Text {
                text: formatBytes(downloadSpeed)
                color: "#cdd6f4"
                font.pixelSize: 8
                opacity: 0.8
                anchors.verticalCenter: parent.verticalCenter
            }
        }
    }
    
    // Mock animation for network activity
    Timer {
        interval: 1000
        running: true
        repeat: true
        onTriggered: {
            // Simulate varying network speeds
            downloadSpeed = Math.random() * 5000 + 500
            uploadSpeed = Math.random() * 2000 + 100
        }
    }
}
