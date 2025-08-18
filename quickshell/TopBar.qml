import QtQuick 2.15
import Quickshell
import Quickshell.Services.SystemTray

PanelWindow {
    id: topBar
    
    property bool showQuickSettings: false
    
    // Overlay configuration
    exclusiveZone: 0
    aboveWindows: true
    focusable: false
    color: "transparent"
    
    anchors {
        left: true
        right: true
        top: true
    }
    
    margins {
        left: 300
        right: 300
        top: 100
    }
    
    Rectangle {
        anchors.fill: parent
        color: "transparent"
        
        // Three-section layout matching Astal centerbox
        Item {
            anchors.fill: parent
            
            // Left Section - Playback (START alignment)
            Row {
                anchors.left: parent.left
                anchors.verticalCenter: parent.verticalCenter
                spacing: 8
                
                Playback {
                    anchors.verticalCenter: parent.verticalCenter
                }
            }
            
            // Center Section - CenterWidgets (CENTER alignment)
            Item {
                anchors.centerIn: parent
                
                CenterWidgets {
                    anchors.centerIn: parent
                }
            }
            
            // Right Section - SysTray, Network/Hardware, QuickSettings, Avatar (END alignment)
            Row {
                anchors.right: parent.right
                anchors.rightMargin: 4  // margin-right: 4px from Astal
                anchors.verticalCenter: parent.verticalCenter
                spacing: 8
                
                // SysTray
                SysTray {
                    anchors.verticalCenter: parent.verticalCenter
                }
                
                // Sliding Network/Hardware and QuickSettings container
                Item {
                    width: Math.max(networkHardwareRow.width, quickSettingsLoader.width)
                    height: 32
                    clip: true
                    
                    // Network/Hardware - slides RIGHT when QuickSettings opens
                    Row {
                        id: networkHardwareRow
                        spacing: 8
                        anchors.verticalCenter: parent.verticalCenter
                        
                        x: topBar.showQuickSettings ? -width : 0
                        
                        Behavior on x {
                            NumberAnimation { duration: 300; easing.type: Easing.OutQuad }
                        }
                        
                        Network {
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        
                        Hardware {
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }
                    
                    // QuickSettings - slides LEFT when opened
                    Loader {
                        id: quickSettingsLoader
                        anchors.verticalCenter: parent.verticalCenter
                        
                        x: topBar.showQuickSettings ? 0 : parent.width
                        active: true
                        
                        Behavior on x {
                            NumberAnimation { duration: 300; easing.type: Easing.OutQuad }
                        }
                        
                        sourceComponent: QuickSettings {}
                    }
                }
                
                Avatar {
                    width: 32
                    height: 32
                    anchors.verticalCenter: parent.verticalCenter
                    onClicked: topBar.showQuickSettings = !topBar.showQuickSettings
                }
            }
        }
    }
}