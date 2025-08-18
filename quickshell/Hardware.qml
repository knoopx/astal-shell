import QtQuick 2.15

Item {
    id: hardware
    width: hardwareRow.width
    height: 32
    
    // Mock hardware data
    property real cpuLoad: 0.25
    property real ramUsage: 0.45
    property real diskUsage: 0.60
    property real batteryLevel: 0.85
    property bool hasNvidiaGpu: false
    property bool hasBattery: true
    
    function getLevelColor(value, invert) {
        if (invert) {
            if (value > 0.75) return "#a6e3a1" // low/good (green)
            if (value > 0.25) return "#f9e2af" // medium (yellow)
            return "#f38ba8" // high/bad (red)
        } else {
            if (value > 0.75) return "#f38ba8" // high (red)
            if (value > 0.25) return "#f9e2af" // medium (yellow)
            return "#a6e3a1" // low (green)
        }
    }
    
    Row {
        id: hardwareRow
        anchors.left: parent.left
        anchors.leftMargin: 8
        anchors.verticalCenter: parent.verticalCenter
        spacing: 8
        
        // CPU Meter
        Row {
            anchors.verticalCenter: parent.verticalCenter
            spacing: 2
            
            Rectangle {
                width: 8
                height: 24
                radius: 2
                color: "#313244"
                border.width: 1
                border.color: "#45475a"
                anchors.verticalCenter: parent.verticalCenter
                
                Rectangle {
                    anchors.bottom: parent.bottom
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: parent.width - 2
                    height: (parent.height - 2) * cpuLoad
                    radius: 1
                    color: getLevelColor(cpuLoad, false)
                    
                    Behavior on height {
                        NumberAnimation { duration: 300 }
                    }
                    
                    Behavior on color {
                        ColorAnimation { duration: 300 }
                    }
                }
            }
            
            Text {
                text: "CPU"
                font.pixelSize: 6
                font.weight: Font.Bold
                color: "#cdd6f4"
                anchors.verticalCenter: parent.verticalCenter
                rotation: 90
                transformOrigin: Item.Center
            }
        }
        
        // RAM Meter
        Row {
            anchors.verticalCenter: parent.verticalCenter
            spacing: 2
            
            Rectangle {
                width: 8
                height: 24
                radius: 2
                color: "#313244"
                border.width: 1
                border.color: "#45475a"
                anchors.verticalCenter: parent.verticalCenter
                
                Rectangle {
                    anchors.bottom: parent.bottom
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: parent.width - 2
                    height: (parent.height - 2) * ramUsage
                    radius: 1
                    color: getLevelColor(ramUsage, false)
                    
                    Behavior on height {
                        NumberAnimation { duration: 300 }
                    }
                    
                    Behavior on color {
                        ColorAnimation { duration: 300 }
                    }
                }
            }
            
            Text {
                text: "RAM"
                font.pixelSize: 6
                font.weight: Font.Bold
                color: "#cdd6f4"
                anchors.verticalCenter: parent.verticalCenter
                rotation: 90
                transformOrigin: Item.Center
            }
        }
        
        // Disk Meter
        Row {
            anchors.verticalCenter: parent.verticalCenter
            spacing: 2
            
            Rectangle {
                width: 8
                height: 24
                radius: 2
                color: "#313244"
                border.width: 1
                border.color: "#45475a"
                anchors.verticalCenter: parent.verticalCenter
                
                Rectangle {
                    anchors.bottom: parent.bottom
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: parent.width - 2
                    height: (parent.height - 2) * diskUsage
                    radius: 1
                    color: getLevelColor(diskUsage, false)
                    
                    Behavior on height {
                        NumberAnimation { duration: 300 }
                    }
                    
                    Behavior on color {
                        ColorAnimation { duration: 300 }
                    }
                }
            }
            
            Text {
                text: "DSK"
                font.pixelSize: 6
                font.weight: Font.Bold
                color: "#cdd6f4"
                anchors.verticalCenter: parent.verticalCenter
                rotation: 90
                transformOrigin: Item.Center
            }
        }
        
        // Battery Meter (if available)
        Row {
            anchors.verticalCenter: parent.verticalCenter
            spacing: 2
            visible: hasBattery
            
            Rectangle {
                width: 8
                height: 24
                radius: 2
                color: "#313244"
                border.width: 1
                border.color: "#45475a"
                anchors.verticalCenter: parent.verticalCenter
                
                Rectangle {
                    anchors.bottom: parent.bottom
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: parent.width - 2
                    height: (parent.height - 2) * batteryLevel
                    radius: 1
                    color: getLevelColor(batteryLevel, true) // inverted for battery
                    
                    Behavior on height {
                        NumberAnimation { duration: 300 }
                    }
                    
                    Behavior on color {
                        ColorAnimation { duration: 300 }
                    }
                }
            }
            
            Text {
                text: "BAT"
                font.pixelSize: 6
                font.weight: Font.Bold
                color: "#cdd6f4"
                anchors.verticalCenter: parent.verticalCenter
                rotation: 90
                transformOrigin: Item.Center
            }
        }
    }
    
    // Mock animation for hardware monitoring
    Timer {
        interval: 2000
        running: true
        repeat: true
        onTriggered: {
            // Simulate varying hardware usage
            cpuLoad = Math.random() * 0.8 + 0.1
            ramUsage = Math.random() * 0.6 + 0.2
            diskUsage = Math.random() * 0.4 + 0.4
            batteryLevel = Math.max(0.1, batteryLevel - (Math.random() * 0.02)) // slowly drain
        }
    }
    
    MouseArea {
        anchors.fill: parent
        onClicked: {
            // Open system monitor
            console.log("Opening system monitor...")
        }
    }
}
