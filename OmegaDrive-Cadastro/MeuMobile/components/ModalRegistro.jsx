import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const formatarDataISO = (data) => {
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
};

const ModalRegistro = ({
    visible,
    onClose,
    onSalvar,
    registro,
    dataSelecionada,
}) => {
    const [dados, setDados] = useState({
        condutor: "",
        rgCondutor: "",
        veiculo: "",
        placa: "",
        destino: "",
        kmIda: "",
        kmVolta: "",
        horaSaida: "",
        horaInicio: "",
        dataMarcada: "",
        editadoPor: "",
        observacao: "",
    });

    const [mostrarDataPicker, setMostrarDataPicker] = useState(false);

    useEffect(() => {
        if (registro) {
            setDados({
                ...registro,
                kmIda: registro.kmIda?.toString() ?? "",
                kmVolta: registro.kmVolta?.toString() ?? "",
            });
        } else {
            setDados((prev) => ({
                ...prev,
                dataMarcada: formatarDataISO(dataSelecionada),
            }));
        }
    }, [registro, dataSelecionada]);

    const handleChange = (campo, valor) => {
        setDados((prev) => ({ ...prev, [campo]: valor }));
    };

    const validar = () => {
        const obrigatorios = [
            "condutor",
            "rgCondutor",
            "veiculo",
            "placa",
            "kmIda",
            "kmVolta",
            "horaSaida",
        ];
        for (let campo of obrigatorios) {
            if (!dados[campo]) return false;
        }
        return true;
    };

    const handleSalvar = () => {
        if (!validar()) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        onSalvar({
            ...dados,
            kmIda: parseFloat(dados.kmIda),
            kmVolta: parseFloat(dados.kmVolta),
        });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.header}>
                        {registro ? "Editar Registro" : "Novo Registro"}
                    </Text>
                    <Text style={styles.subheader}>Preencha os dados da viagem</Text>

                    <ScrollView contentContainerStyle={styles.form}>
                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="Condutor"
                                value={dados.condutor}
                                onChangeText={(v) => handleChange("condutor", v)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="RG"
                                value={dados.rgCondutor}
                                onChangeText={(v) => handleChange("rgCondutor", v)}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="Veículo"
                                value={dados.veiculo}
                                onChangeText={(v) => handleChange("veiculo", v)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Placa"
                                value={dados.placa}
                                onChangeText={(v) => handleChange("placa", v)}
                            />
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Destino"
                            value={dados.destino}
                            onChangeText={(v) => handleChange("destino", v)}
                        />

                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="Km Inicial"
                                keyboardType="numeric"
                                value={dados.kmIda}
                                onChangeText={(v) => handleChange("kmIda", v)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Km Final"
                                keyboardType="numeric"
                                value={dados.kmVolta}
                                onChangeText={(v) => handleChange("kmVolta", v)}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="Hora Saída"
                                value={dados.horaSaida}
                                onChangeText={(v) => handleChange("horaSaida", v)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Hora Início"
                                value={dados.horaInicio}
                                onChangeText={(v) => handleChange("horaInicio", v)}
                            />
                        </View>

                        {/* Seletor de Data */}
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setMostrarDataPicker(true)}
                        >
                            <Text style={{ color: dados.dataMarcada ? "#000" : "#888" }}>
                                {dados.dataMarcada
                                    ? new Date(dados.dataMarcada).toLocaleDateString()
                                    : "Selecione a data"}
                            </Text>
                        </TouchableOpacity>

                        {mostrarDataPicker && (
                            <DateTimePicker
                                value={
                                    dados.dataMarcada
                                        ? new Date(dados.dataMarcada)
                                        : new Date()
                                }
                                mode="date"
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                onChange={(event, selectedDate) => {
                                    if (Platform.OS !== "ios") setMostrarDataPicker(false);
                                    if (selectedDate) {
                                        handleChange("dataMarcada", formatarDataISO(selectedDate));
                                    }
                                }}
                            />
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="Editado por (opcional)"
                            value={dados.editadoPor}
                            onChangeText={(v) => handleChange("editadoPor", v)}
                        />

                        <TextInput
                            style={[styles.input, styles.textarea]}
                            placeholder="Observações (opcional)"
                            multiline
                            numberOfLines={4}
                            value={dados.observacao}
                            onChangeText={(v) => handleChange("observacao", v)}
                        />
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancel} onPress={onClose}>
                            <Text>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.save} onPress={handleSalvar}>
                            <Text style={{ color: "#fff" }}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ModalRegistro;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "#00000099",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 16,
        width: "92%",
        maxHeight: "90%",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#7b2ff7",
        marginBottom: 4,
    },
    subheader: {
        fontSize: 14,
        marginBottom: 12,
        color: "#555",
    },
    form: {
        paddingBottom: 10,
    },
    inputGroup: {
        flexDirection: "row",
        gap: 10,
        justifyContent: "space-between",
    },
    input: {
        flex: 1,
        backgroundColor: "#f3f4f6",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginVertical: 6,
    },
    textarea: {
        minHeight: 80,
        textAlignVertical: "top",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 12,
    },
    cancel: {
        padding: 10,
        borderRadius: 6,
        backgroundColor: "#e5e7eb",
    },
    save: {
        padding: 10,
        borderRadius: 6,
        backgroundColor: "#7b2ff7",
    },
});
