# NoisePollutionDetection
Attempt to collect and classify noises collected using multiple sources and visualize the heat map. 


### Idea:
* Track noise pollution for a city
* Attach microphones and GPS to public city bicycles, cache recordings of noise over a decibel threshold, load data when bike is returned to station (wifi enabled)
* ML sound classification
* Front-end app to present timestamped data (live heat map)

### Proof of Concept:
* Use Andriod phone app (GPS enabled with built in mic) to record audio
* Classify audio and store info obj (timestamp, geolocation, nise type, intensity) into database
* Front-end app gets data points from database on page load and opens websocket connection for instant updates
* Parse data into heatmap based on two factors: individual noise intensity and noise frequency in an area 
* Add ability to filter heatmap from data between time A and time B

### Extensions:
* Real world app could use the Bell Network enabled for IoT to get data in real time
* Detect emergency situations 
* Broaden scope: have people opt-in to putting the device on their cars, put the device on city transit
* Stationary placement works if the device is cheap to make and the area is high trafficked, but note the importance of putting it on a mobile object to gather data for all areas of city (optimize amount of sensors)
