import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const KEYBOARD_LAYOUT = [
    ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
    ['ENT', 'W', 'X', 'C', 'V', 'B', 'N', 'DEL'],
];
type KeyboardProps = {
    onKeyPress: (key: string) => void;
}
export const Keyboard = ({ onKeyPress }: KeyboardProps) => {
    return (<View style={styles.keyboard}>
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keyboardRow}>
                {row.map((key) => (
                    <TouchableOpacity
                        key={key}
                        style={styles.key}
                        onPress={() => onKeyPress(key)}>
                        <Text style={styles.keyText}>{key}</Text>
                    </TouchableOpacity>))}
            </View>
        ))}
    </View>)
}

const styles = StyleSheet.create({
    keyboard: {
        gap: 8
    },
    keyboardRow: {
        gap: 8,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    key: {
        backgroundColor: '#f1eeee',
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 8,
        minWidth: 30,
        alignItems: 'center',
    },
    keyText: {
        color: '#221e1e',
        fontSize: 18,
        fontWeight: 'bold',
    }

})