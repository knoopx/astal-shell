import QtQuick 2.15

Item {
    id: weatherWidget
    width: weatherText.width
    height: weatherText.height
    
    property string weather: "🌤️ 24°C"
    property bool isDay: true
    
    // Moon phases mapping
    property var moonIcons: ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"]
    
    function getMoonPhase() {
        // Simplified moon phase calculation for demo
        var date = new Date()
        var phase = Math.floor((date.getDate() / 29.53) * 8) % 8
        return moonIcons[phase]
    }
    
    function openWeatherWMOToEmoji(weatherCode, daylight) {
        if (typeof daylight === 'undefined') daylight = true
        
        switch (weatherCode) {
            case 0: return daylight ? "☀️" : "🌙"
            case 1: return daylight ? "🌤️" : "🌤️🌙"
            case 2: return "☁️"
            case 3: return daylight ? "🌥️" : "☁️🌙"
            case 45: return "🌫️"
            case 48: return "🌫️❄️"
            case 51:
            case 53:
            case 55: return "🌧️"
            case 56:
            case 57: return "🌨️"
            case 61: return "🌦️"
            case 63:
            case 65:
            case 66:
            case 67: return "🌧️"
            case 71:
            case 73:
            case 75:
            case 77: return "🌨️"
            case 80: return "🌦️"
            case 81: return "🌧️🌧️"
            case 82: return "🌧️🌧️🌧️"
            case 85: return "🌨️"
            case 86: return "🌨️🌨️"
            case 95: return "🌩️"
            case 96: return "⛈️"
            case 99: return "⛈️🌨️"
            default: return "🤷‍♂️"
        }
    }
    
    function updateWeather() {
        // Mock weather data for demonstration
        var mockWeatherData = {
            current: {
                temperature_2m: 24 + Math.random() * 10,
                is_day: new Date().getHours() >= 6 && new Date().getHours() < 18,
                weather_code: [0, 1, 2, 3, 61, 63][Math.floor(Math.random() * 6)]
            }
        }
        
        var emoji = mockWeatherData.current.is_day
            ? openWeatherWMOToEmoji(mockWeatherData.current.weather_code, true)
            : getMoonPhase()
        
        var temp = Math.round(mockWeatherData.current.temperature_2m)
        weather = emoji + " " + temp + "°C"
        isDay = mockWeatherData.current.is_day
    }
    
    Text {
        id: weatherText
        text: weather
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
        onClicked: {
            // Open weather application
            console.log("Opening weather app...")
            // In real implementation: niri.toggleOverview() and subprocess("gnome-weather")
        }
    }
    
    // Update weather every 5 minutes (300 seconds)
    Timer {
        interval: 300000 // 5 minutes
        running: true
        repeat: true
        onTriggered: updateWeather()
    }
    
    // Initialize weather on component creation
    Component.onCompleted: updateWeather()
}