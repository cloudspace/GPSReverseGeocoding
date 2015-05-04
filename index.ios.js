
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  StatusBarIOS
} = React;

var _granularities = ["Country", "State", "City", "Street"];

var _mock_data_country = {location: 'United States'};
var _mock_data_state = {location: 'Florida'};
var _mock_data_city = {location: 'Orlando'};
var _mock_data_street = {location: '55 University Blvd'};

var _mock_location_granularity = {Country: _mock_data_country, State: _mock_data_state, City: _mock_data_city, Street:_mock_data_street};

var fetchUrl = "http://127.0.0.1:123/api/";

var GranularityButton = React.createClass({
  render: function() {
    return (
      <TouchableHighlight style={[styles.row, styles.color2]} onPress={() => this.props.onPress(this.props.text)}>
          <View style={styles.buttonStyle}>
              <Text style = {styles.buttonText}>
                {this.props.text}
              </Text>
          </View>
      </TouchableHighlight>
    );
  }
});

var GPSReverseGeocoding = React.createClass({
  watchID: (null: ?number),

  getInitialState: function() {
    return {
      locationText: 'No Location Available.',
      lastPosition: 'unknown',
    };
  },

  fetchData: function(granularity: string) {

    if (!this.state.lastPosition) {
      this.state.locationText = "No Location Available."
      return;
    }

    var coords = this.state.lastPosition.coords;
    if (!coords) {
      this.state.locationText = "No Location Available."
      return;
    }

    var requestUrl = fetchUrl + "?granularity=" + granularity + "&lat=" + coords['latitude'] + "&lng=" + coords['longitude'];

    console.log(requestUrl);

    this.state.locationText = "Your current location is: " + _mock_location_granularity[granularity]['location'] + ".";

    // fetch(REQUEST_URL)
    //   .then((response) => response.json())
    //   .then((responseData) => {
    //     this.setState({
    //       dataSource: this.state.dataSource.cloneWithRows(responseData.movies),
    //       loaded: true,
    //     });
    //   })
    //   .done();
  },

  _onPressButton: function(buttonName: string) {
    this.fetchData(buttonName);
  },

  granularityButtons: function() {
    var returnValue = [];
    for (var i = 0; i < _granularities.length; i++) {

      var buttonName = _granularities[i];
      returnValue.push (
        <GranularityButton text={buttonName} onPress={this._onPressButton} />
      )
      // returnValue.push(
      //
      // //if we dont set a key we get a warning
      // <TouchableHighlight key={i} style={[styles.row, styles.color2]} onPress={() => this._onPressButton("test")}>
      //     <View style={styles.buttonStyle}>
      //         <Text style = {styles.buttonText}>
      //           {buttonName}
      //         </Text>
      //     </View>
      // </TouchableHighlight>
      //
      // );
    }
    return returnValue;
  },

  getCurrentCoordinatesString: function() {

    var coordinatesString = "";

    if (!this.state.lastPosition)
      return coordinatesString;

    var coords = this.state.lastPosition.coords;
    if (!coords)
      return coordinatesString;

    coordinatesString += coords['latitude'] + ", " + coords['longitude'];
    return coordinatesString;
  },

  render: function() {
    StatusBarIOS.setStyle(StatusBarIOS.Style['lightContent']);

    return (
      <View style={styles.windowStyle}>
        <View style={[styles.container, styles.screenNoStatusBar]}>
          <View style={styles.viewHeader}>
            <Text style={styles.welcome}>
              Welcome to React Native!
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.regularText}>
                Your current coordinates: {this.getCurrentCoordinatesString()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.regularText}>
              {this.state.locationText}
            </Text>
          </View>
          <View style={[styles.color2, styles.elementList]}>
            <Text style={[styles.bigText, styles.viewFooter]}>
              See where you are:
            </Text>
            {this.granularityButtons()}
          </View>
        </View>
      </View>
    );
  },
  componentDidMount: function() {
    // navigator.geolocation.getCurrentPosition (
    //   (initialPosition) => this.setState({initialPosition}),
    //   (error) => console.error(error),
    //   {enableHighAccuracy: true, timeout: 100, maximumAge: 1000}
    // );
    this.watchID = navigator.geolocation.watchPosition(
      (lastPosition) => this.setState({lastPosition}),
      (error) => console.error(error),
      {enableHighAccuracy: true, timeout: 100, maximumAge: 1000});
  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchID);
  },
});

var styles = StyleSheet.create({
  windowStyle: {
    flex: 1,
    backgroundColor: '#222222',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
  },
  screenNoStatusBar: {
    flex: 1,
    marginTop:20
  },
  row: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  regularText: {
    fontSize: 12,
    color: '#DDDDDD',
  },
  bigText: {
    fontSize: 26,
    color: '#DDDDDD',
  },
  color1: {
    backgroundColor: '#FF00FF',
  },
  color2: {
    backgroundColor: '#222222',
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 0,
    color: '#DDDDDD',
  },
  buttonStyle: {
    flex: 1,
    backgroundColor: '#1265C9',
    alignSelf: 'stretch',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    margin: 4
  },
  buttonText: {
    fontSize: 26,
    textAlign: 'center',
    color: '#DDDDDD',
  },
  elementList: {
    padding: 4,
    height:268,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  viewHeader: {
    padding: 8,
    //backgroundColor: '#003322',
    alignSelf: 'stretch',
  },
  viewFooter: {
    //backgroundColor: '#006600',
    alignSelf: 'stretch',
    padding: 8,
  }
});

AppRegistry.registerComponent('GPSReverseGeocoding', () => GPSReverseGeocoding);
