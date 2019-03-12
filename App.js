import React, { Component } from "react";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";
import { Constants } from "expo";
import { Timer, vibrate } from "./utils";
const default_work_time = 1;
const default_break_time = 5;
const minToSec = mins => mins * 60;
const Countdown = props => {
  const totalSecs = Math.round(props.timeRemaining / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  const paddedZero = secs < 10 ? "0" : "";
  return (
    <Text style={styles.countText}>
      {mins}:{paddedZero}
      {secs}
    </Text>
  );
};

function RoundButton({ title, color, background, onPress }) {
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={[styles.button, { backgroundColor: background }]}
    >
      <View style={[styles.button, { backgroundColor: background }]}>
        <View style={styles.buttonBorder}>
          <Text style={[styles.buttonTitle, { color }]}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
function ButtonsRow({ children }) {
  return <View style={styles.buttonsRow}>{children}</View>;
}
function TextRow({ children }) {
  return <View style={styles.TextRow}>{children}</View>;
}

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      workTime: 25,
      breakTime: 5,
      isRunning: false,
      timeRemaining: minToSec(default_work_time * 1000),
      status: "WORK",
      currentMins: 1,
      currentSecs: 0,
      minutesC: 1,
      secondsC: 0,
      toggleStatus: "Start"
    };
  }

  dec = () => {
    if (this.state.isRunning) {
      if (this.state.timeRemaining === 0) {
        this.toggle();
      }
      secondsRem = +this.state.timeRemaining;
      minsRem = Math.floor(secondsRem / 60000);
      secondsRem = (secondsRem / 1000) % 60;
      this.setState(prevState => ({
        timeRemaining: prevState.timeRemaining - 1000
        //currentMins: minsRem,
        //currentSecs: secondsRem
      }));
      if (this.state.timeRemaining === 0) {
        vibrate();
      }
    }
  };
  toggle = () => {
    if (this.state.timeRemaining === 0 && this.state.status === "WORK") {
      this.setState({
        timeRemaining: minToSec(default_break_time * 1000),
        status: "BREAK"
      });
    } else if (
      this.state.timeRemaining === 0 &&
      this.state.status === "BREAK"
    ) {
      this.setState({
        timeRemaining: minToSec(default_work_time * 1000),
        status: "WORK"
      });
    }
  };

  componentDidMount() {
    setInterval(this.dec, 1000);
    this.setState({
      minutes: minToSec(default_work_time * 1000)
    });
  }
  start = () => {
    this.setState(prevState => ({
      //timeRemaining: this.state.minutes,
      timeRemaining: +this.state.minutesC * 60000 + this.state.secondsC * 1000,
      isRunning: true,
      status: "WORK",
      toggleStatus: "Reset"
    }));
  };

  pause = () => {
    this.setState(prevState => ({
      isRunning: !prevState.isRunning
    }));
    //vibrate();
  };

  handleSecChange = seconds => {
    this.setState({
      isRunning: false,
      secondsC: seconds,
      timeRemaining: +this.state.minutesC * 60000 + +seconds * 1000
    });
  };

  handleMinChange = minutes => {
    const mins = +minutes;
    //this.props.onChange(mins * 60000 + this.state.seconds);
    const time = mins * 60000;
    this.setState({
      minutesC: minutes,
      isRunning: false,
      timeRemaining: time + +this.state.secondsC * 1000
    });
  };

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.appContainer}>
        <Text style={styles.titleText}>{this.state.status} TIMER</Text>
        <Countdown timeRemaining={this.state.timeRemaining} />
        <ButtonsRow>
          <RoundButton
            title={this.state.toggleStatus}
            color="#50D167"
            background="#1B361F"
            onPress={this.start}
          />
          <RoundButton
            title="Pause"
            color="#E33935"
            background="#3C1715"
            onPress={this.pause}
          />
        </ButtonsRow>
        <TextRow>
          <Text style={styles.minsSecText}>MINUTES: </Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            defaultValue={`${this.state.currentMins}`}
            onChangeText={this.handleMinChange}
            //value={this.state.timeRemaining}
          />
          <Text style={styles.minsSecText}>SECONDS: </Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            defaultValue={`${this.state.currentSecs}`}
            onChangeText={this.handleSecChange}
            //value={this.state.timeRemaining}
          />
        </TextRow>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20
  },
  titleText: {
    fontSize: 20,
    fontWeight: "200",
    color: "#000000",
    fontWeight: "200",
    height: Constants.statusBarHeight
  },
  countText: {
    fontSize: 76,
    fontWeight: "200",
    color: "#000000",
    fontWeight: "200"
  },
  minsSecText: {
    fontSize: 20,
    fontWeight: "bold"
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonTitle: {
    fontSize: 18
  },
  buttonBorder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonsRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20
  },
  TextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 80,
    marginBottom: 30
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    marginRight: 10,
    paddingHorizontal: 5,
    minWidth: 50
  }
});
