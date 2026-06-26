import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { height, width } = Dimensions.get('window');
const ALPHABET = 'AZERTYUIOPQSDFGHJKLMWXCVBN';
const SHAPES = ['□', '■', '△', '▲', '○', '●', '◇', '◆', '☆'];

const ALL_ELEMENTS = [...ALPHABET.split(''), ...SHAPES];

const Letter = ({ delay, startX, speed, char, scale, rotation }) => {
    const translateY = useRef(new Animated.Value(-50)).current;
    const isLetter = ALPHABET.includes(char);
    useEffect(() => {
        Animated.loop(
            Animated.timing(translateY, {
                toValue: height + 50,
                duration: speed,
                delay: delay,
                useNativeDriver: true,
            })
        ).start();
    }, [delay, speed, translateY]);

    return (
        <Animated.Text
            style={[
                styles.floatingText,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                    left: startX,
                    transform: [{ translateY },
                    { scale: scale },
                    { rotate: rotation }],
                    fontWeight: isLetter ? 'bold' : 'normal',
                    fontSize: isLetter ? 40 : 30,
                },
            ]}
        >
            {char}
        </Animated.Text >
    );
};

export const FallingLetters = () => {
    const lettersConfig = useRef(
        Array.from({ length: 30 }).map(() => ({
            id: Math.random().toString(),
            char: ALL_ELEMENTS[Math.floor(Math.random() * ALL_ELEMENTS.length)],
            startX: Math.random() * (width - 10), // Position X aléatoire
            delay: Math.random() * 9000,          // Délai avant de tomber
            speed: 4000 + Math.random() * 6000,   // Vitesse de chute (4 à 6s)
            scale: 0.4 + Math.random() * 0.8,
            rotation: `${Math.random() * 360}deg`,
        }))
    ).current;

    return (
        // absoluteFillObject permet à la vue de prendre tout l'écran en arrière-plan
        <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="none">
            {lettersConfig.map((config) => (
                <Letter key={config.id} {...config} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        zIndex: -1,
    },
    floatingText: {
        position: 'absolute',
        fontSize: 40,
        fontWeight: 'bold',
        color: 'rgba(236, 228, 227, 0.281)',
    },
});