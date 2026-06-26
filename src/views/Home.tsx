import { StyleSheet, View, Text, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard } from "../components/Keyboard";
import { FallingLetters } from "../components/FallingLetters";
import { useEffect, useMemo, useState } from "react";
import { storage } from "../utils/storage";

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;
const API_URL = `https://random-word-api.herokuapp.com/word?length=${WORD_LENGTH}&lang=fr`

export const Home = () => {

    const [attempts, setAttempts] = useState<string[]>([]);
    const [currentWord, setCurrentWord] = useState('');
    const [wordToGuess, setWordToGuess] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [winstreak, setWinstreak] = useState(0)

    useEffect(() => {
        loadWord()
    }, [])

    const grid = useMemo(() => {
        const rows = [...attempts];
        if (rows.length < MAX_ATTEMPTS) {
            rows.push(currentWord)
        }
        while (rows.length < MAX_ATTEMPTS) {
            rows.push('');
        }
        return rows;
    }, [attempts, currentWord]);

    const onKeyPress = (key: string) => {
        if (key === 'DEL') {
            setCurrentWord(current => current.slice(0, -1));
            return;
        }
        if (key === 'ENT') {
            validateWord();
            return;
        }
        if (currentWord.length < WORD_LENGTH) {
            setCurrentWord(current => current + key);
        }
    }

    const validateWord = () => {
        if (currentWord.length !== WORD_LENGTH) {
            return;
        }
        const newAttempts = [...attempts, currentWord];
        setAttempts(newAttempts);
        const gamesPlayed = storage.getNumber('games.played') ?? 0;
        storage.set('games.played', gamesPlayed + 1)

        if (currentWord === wordToGuess) {
            Alert.alert('Félicitations!', 'Vous avez trouvé le mot!');
            setWinstreak(prev => prev + 1)
            const currentGamesWon = storage.getNumber('games.won') ?? 0;
            storage.set('games.won', currentGamesWon + 1)
            return;
        }

        if (newAttempts.length >= MAX_ATTEMPTS) {
            Alert.alert('Dommage!', `Vous avez utilisé tous vos essais. Le mot était: ${wordToGuess}`);
            setWinstreak(0);
            const currentGamesLost = storage.getNumber('games.lost') ?? 0;
            storage.set('games.lost', currentGamesLost + 1)
        }
        setCurrentWord('');
    }

    const getLettersStatus = (letter: string, index: number, word: string) => {

        if (!word || word.length < WORD_LENGTH || !attempts.includes(word)) return 'empty';

        if (wordToGuess[index] === letter) return 'correct';

        if (wordToGuess.includes(letter)) return 'present';

        return 'absent';
    }

    const resetGame = () => {
        setIsLoading(true)
        loadWord()
        setAttempts([]);
        setCurrentWord('');
    }
    const loadWord = async () => {
        try {
            const response = await fetch(API_URL)
            if (!response.ok) throw new Error("Erreur API")
            const data: string[] = await response.json()
            if (data.length > 1) throw new Error('Donnée manquantes')

            const randomWord = data[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
            setWordToGuess(randomWord)
            setIsLoading(false)
            console.log(randomWord);
        } catch (error) {
            Alert.alert('Erreur', "Une erreur réseaux c'est produite" + error)
        }
    }
    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', gap: 8 }]}>
                <ActivityIndicator size="large" />
                <Text style={[styles.subtitle, { color: '#030202F' }]}>Chargement...</Text>
            </SafeAreaView>)
    }

    return (
        <View style={styles.mainWrapper}>
            <SafeAreaView style={styles.container}>
                <FallingLetters />
                <Text style={styles.title}>WORDLE</Text>
                <Text style={styles.subtitle}>Trouvez le mot en {MAX_ATTEMPTS} essais</Text>
                <Text style={styles.subtitle}>Winstreak : {winstreak >= 1 ? winstreak : 0}</Text>
                <View style={styles.boardContainer}>
                    <View style={styles.grid}>
                        {grid.map((word, row) => (
                            <View key={row} style={styles.row}>
                                {Array.from({ length: WORD_LENGTH }).map((_, index) => {
                                    const letter = word[index] ?? '';
                                    const status = getLettersStatus(letter, index, word)
                                    return (
                                        <View key={index} style={[
                                            styles.cell, styles.shadow, styles[status]]}>
                                            <Text style={styles.cellText}>{letter}</Text>
                                        </View>
                                    )
                                })}
                            </View>
                        ))}
                    </View>
                </View>
                <TouchableOpacity style={styles.resetButton} onPress={() => resetGame()} >
                    <Text style={styles.resetButtonText}>
                        Nouvelle partie
                    </Text>
                </TouchableOpacity>
                <Keyboard onKeyPress={onKeyPress} />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#C6AD94',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 20,
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 4,
        marginTop: 70,
        marginBottom: 20,
    },
    subtitle: {
        color: '#ECE4E3',
        fontSize: 22,
        letterSpacing: 2,
    },
    boardContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    grid: {
        gap: 8,
        marginTop: 40
    },
    row: {
        flexDirection: 'row',
        gap: 8,
    },
    cell: {
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 22,
    },
    shadow: {
        shadowColor: "#2b2828",
        shadowOffset: { width: 0, height: 0 },
        elevation: 1,
    },
    cellText: {
        color: '#ECE4E3',
        fontSize: 30,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    resetButton: {
        backgroundColor: '#6b5151',
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 20
    },
    resetButtonText: {
        color: '#ebebeb',
        fontWeight: 'bold',
        fontSize: 12
    },
    correct: {
        backgroundColor: '#458144',
        borderColor: '#093f1b'
    },
    present: {
        backgroundColor: '#a9b500',
        borderColor: '#9ca105'
    },
    absent: {
        backgroundColor: '#9c0000',
        borderColor: '#621515'
    },
    empty: {
        backgroundColor: 'transparent'
    }
});
