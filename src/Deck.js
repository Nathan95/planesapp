import React, { Component } from "react";
import { 
  TouchableOpacity, 
  Animated, 
  View, 
  PanResponder, 
  Dimensions, 
  Text, 
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
  //if a user doesn't assign anything to this prop it will use this default value
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {}
  };

  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe("right");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe("left");
        } else {
          this.resetPosition();
        }
      }
    });

    this.state = { panResponder, position, index: 0 };
  }

  //Swipe left or right
  forceSwipe(direction) {
    const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this.state.position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false 
    }).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index];

    direction === "right" ? onSwipeRight(item) : onSwipeLeft(item);
    this.state.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });
  }

  //makes the card bounce back to position
  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false 
    }).start();
  }

  //swipes the card left or right
  getCardStyle() {
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ["-120deg", "0deg", "120deg"]
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  }

  //Map over data
  renderCards() {
    if (this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards();
    }

    return this.props.data.map((item, i) => {
      if (i < this.state.index) {
        return null;
      }

      if (i === this.state.index) {
        return (
          <Animated.View
            key={item.id}
            style={[this.getCardStyle(), styles.cardStyle, {zIndex: 99, top: 10 * (i - this.state.index) }]}
            {...this.state.panResponder.panHandlers}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        );
      }

      return (
        <View key={item.id} style={[styles.cardStyle, { zIndex: 5 }]}>
          {this.props.renderCard(item)}
          <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.crossButton} onPress={()=> this.forceSwipe("left")}>
            <Text style={styles.crossButtonText}>x</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tickButton} onPress={()=> this.forceSwipe("right")}>
          <Text style={styles.tickButtonText}>✓</Text>
          </TouchableOpacity>
          </View>
        </View>
      );
    }).reverse();
  }

  render() {
    return <View>{this.renderCards()}</View>;
  }
}

const styles = {
  cardStyle: {
    borderRadius: 100,
    position: "absolute",
    width: SCREEN_WIDTH,
    top: 20
  },
  crossButton: {
    marginLeft: 20,
    marginTop: 20,
    borderRadius: 100,
    width:70,
    height:70,
    borderColor: 'red',
    borderStyle: 'solid',
    borderWidth: 2,
  },
  tickButton: {
    marginTop: 20,
    marginRight: 20,
    borderRadius: 100,
    width:70,
    height:70,
    borderColor: 'green',
    borderStyle: 'solid',
    borderWidth: 2,
  },
  crossButtonText: {
    textAlign: 'center',
    marginTop:6,
    color: 'red',
    fontSize: 30
  },
  tickButtonText: {
    textAlign: 'center',
    marginTop:8,
    color: 'green',
    fontSize: 30
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between' 
  }
};

export default Deck;
