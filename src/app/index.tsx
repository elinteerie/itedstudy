import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
import FirstImage from '../assets/image/itedStudy.png';
import SecondImage from '../assets/image/itedStudy3.png';
import ThirdImage from '../assets/image/itedStudy2.png'; 
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const screens = [
    {
      image: FirstImage,
      title: 'Welcome to Uni E-study',
      subtitle: 'Unlock your potential—\nevery lesson is a step closer to your dreams!'
    },
    {
      image: SecondImage,
      title: 'All your best goals in one\nplace',
      subtitle: 'Welcome to your gateway of knowledge—\nlet\'s make every moment count!'
    },
    {
      image: ThirdImage,
      title: 'Congrats!!',
      subtitle: 'Sit back, relax, and get ready to learn.\nYou are just moments away from\nsetting up your personalized course.'
    },
  ];

 const panResponder = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 10;
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 30 && currentScreen > 0) {
        // Swipe right - go back
        setCurrentScreen(currentScreen - 1);
      } else if (gestureState.dx < -30 && currentScreen < screens.length - 1) {
        // Swipe left - go forward
        setCurrentScreen(currentScreen + 1);
      }
    },
  })
).current;

const handleNext = () => {
  if (currentScreen < screens.length - 1) {
    setCurrentScreen(currentScreen + 1);
  } else {
    // Navigate to login when on last screen
    router.push('/auth/login');
  }
};

  const current = screens[currentScreen];
  const buttonText = currentScreen === 0 ? 'Take a Step' : currentScreen === 1 ? 'Next' : 'Finish';

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content} {...panResponder.panHandlers}>
        <Image 
          source={current.image} 
          style={styles.image}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.subtitle}>{current.subtitle}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
          <View style={styles.arrowCircle}>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.pagination}>
          {screens.map((_, index) => (
            <View 
              key={index}
              style={[
                styles.dot,
                index === currentScreen && styles.activeDot
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#001f3f',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  arrowCircle: {
    backgroundColor: '#fff',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    color: '#001f3f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  activeDot: {
    backgroundColor: '#001f3f',
    width: 24,
  },
});