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
    const d = new Date(data);
    d.setHours(12, 0, 0, 0);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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
                dataMarcada:
                    registro.dataMarcada || formatarDataISO(dataSelecionada),
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
            "horaInicio",
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

        const dadosFormatados = {
            ...dados,
            kmIda: parseFloat(dados.kmIda),
            kmVolta: parseFloat(dados.kmVolta),
            dataMarcada: dados.dataMarcada || formatarDataISO(dataSelecionada),
        };

        onSalvar(dadosFormatados);
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
                                style={[styles.input, { marginRight: 10 }]}
                                placeholder="Condutor"
                                placeholderTextColor="#000"
                                value={dados.condutor}
                                onChangeText={(v) => handleChange("condutor", v)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="RG"
                                placeholderTextColor="#000"
                                value={dados.rgCondutor}
                                onChangeText={(v) => handleChange("rgCondutor", v)}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <TextInput
                                style={[styles.input, { marginRight: 10 }]}
                                placeholder="Veículo"
                                placeholderTextColor="#000"
                                value={dados.veiculo}
                                onChangeText={(v) => handleChange("veiculo", v)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Placa"
                                placeholderTextColor="#000"
                                value={dados.placa}
                                onChangeText={(v) => handleChange("placa", v)}
                            />
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Destino"
                            placeholderTextColor="#000"
                            value={dados.destino}
                            onChangeText={(v) => handleChange("destino", v)}
                        />

                        <View style={styles.inputGroup}>
                            <TextInput
                                style={[styles.input, { marginRight: 10 }]}
                                placeholder="Km Inicial"
                                placeholderTextColor="#000"
                                keyboardType="numeric"
                                value={dados.kmIda}
                                onChangeText={(v) => handleChange("kmIda", v)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Km Final"
                                placeholderTextColor="#000"
                                keyboardType="numeric"
                                value={dados.kmVolta}
                                onChangeText={(v) => handleChange("kmVolta", v)}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <TextInput
                                style={[styles.input, { marginRight: 10 }]}
                                placeholder="Hora Início"
                                placeholderTextColor="#000"
                                value={dados.horaInicio}
                                onChangeText={(v) => handleChange("horaInicio", v)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Hora Saída"
                                placeholderTextColor="#000"
                                value={dados.horaSaida}
                                onChangeText={(v) => handleChange("horaSaida", v)}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setMostrarDataPicker(true)}
                        >
                            <Text style={{ color: "#000" }}>
                                {dados.dataMarcada
                                    ? (() => {
                                        const [ano, mes, dia] = dados.dataMarcada.split("-").map(Number);
                                        return `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}/${ano}`;
                                    })()
                                    : "Selecione a data"}
                            </Text>
                        </TouchableOpacity>

                        {mostrarDataPicker && (
                            <DateTimePicker
                                value={
                                    dados.dataMarcada
                                        ? (() => {
                                            const [ano, mes, dia] = dados.dataMarcada.split("-").map(Number);
                                            return new Date(ano, mes - 1, dia, 12);
                                        })()
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
                            placeholderTextColor="#000"
                            value={dados.editadoPor}
                            onChangeText={(v) => handleChange("editadoPor", v)}
                        />

                        <TextInput
                            style={[styles.input, styles.textarea]}
                            placeholder="Observações (opcional)"
                            placeholderTextColor="#000"
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
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 16,
        width: "92%",
        maxHeight: "90%",
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
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
        justifyContent: "space-between",
    },
    input: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: "#ddd",
        color: "#000", // 🔹 Texto preto
    },
    textarea: {
        minHeight: 80,
        textAlignVertical: "top",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 12,
    },
    cancel: {
        padding: 10,
        borderRadius: 6,
        backgroundColor: "#e5e7eb",
        marginRight: 10,
    },
    save: {
        padding: 10,
        borderRadius: 6,
        backgroundColor: "#7b2ff7",
    },
});
