import QtQuick 2.15

Item {
    id: centerWidgets
    width: centerColumn.width
    height: centerColumn.height

    Column {
        id: centerColumn
        anchors.centerIn: parent
        spacing: 4
        
        // Date Widget
        DateWidget {
            id: dateWidget
            anchors.horizontalCenter: parent.horizontalCenter
        }
        
        // Time and Weather Row
        Row {
            spacing: 2
            anchors.horizontalCenter: parent.horizontalCenter
            
            TimeWidget {
                id: timeWidget
            }
            
            WeatherWidget {
                id: weatherWidget
            }
        }
    }
}