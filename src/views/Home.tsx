import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

export const Home = () => {

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>WORDLE</Text>
            <Text style={styles.subtitle}>Trouvez le mot en {MAX_ATTEMPTS} essais</Text>

            <View style={styles.grid}>
                {Array.from({ length: MAX_ATTEMPTS }).map((_, row) => (
                    <View key={row} style={styles.row}>
                        {Array.from({ length: WORD_LENGTH }).map((_, index) => (
                            <View key={index} style={styles.cell}></View>

                        ))}
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C6AD94',
        alignItems: 'center',
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
        borderWidth: 2,
        borderColor: '#283044',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22
    }
});
