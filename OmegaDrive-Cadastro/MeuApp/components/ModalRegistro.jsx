import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";

const parseDate = (dateValue) => {
    if (!dateValue) return "";
    const d = new Date(dateValue);
    return isNaN(d) ? "" : d.toISOString().split("T")[0];
};

const ModalRegistro = ({ visible, registro, onClose, onSalvar, dataSelecionada }) => {
    const [formData, setFormData] = useState({
        condutor: "",
        rgCondutor: "",    // nome atualizado para rgCondutor (igual ao dashboard)
        veiculo: "",
        placa: "",
        destino: "",
        kmIda: "",         // renomeado para kmIda (igual ao dashboard)
        kmVolta: "",       // renomeado para kmVolta
        horaInicio: "",
        horaSaida: "",
        editadoPor: "",
        observacoes: "",
    });

    useEffect(() => {
        if (registro) {
            setFormData({
                condutor: registro.condutor || "",
                rgCondutor: registro.rgCondutor || "",   // alinhado com dashboard
                veiculo: registro.veiculo || "",
                placa: registro.placa || "",
                destino: registro.destino || "",
                kmIda: registro.kmIda !== undefined ? String(registro.kmIda) : "",
                kmVolta: registro.kmVolta !== undefined ? String(registro.kmVolta) : "",
                horaInicio: registro.horaInicio || "",
                horaSaida: registro.horaSaida || "",
                editadoPor: registro.editadoPor || "",
                observacoes: registro.observacoes || "",
            });
        } else {
            setFormData({
                condutor: "",
                rgCondutor: "",
                veiculo: "",
                placa: "",
                destino: "",
                kmIda: "",
                kmVolta: "",
                horaInicio: "",
                horaSaida: "",
                editadoPor: "",
                observacoes: "",
            });
        }
    }, [registro]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validar = () => {
        const obrigatorios = [
            "condutor",
            "rgCondutor",
            "veiculo",
            "placa",
            "destino",
            "kmIda",
            "kmVolta",
            "horaInicio",
            "horaSaida",
        ];
        for (let campo of obrigatorios) {
            if (!formData[campo].trim()) {
                Alert.alert("Atenção", `Preencha o campo "${campo}" corretamente.`);
                return false;
            }
        }
        if (parseFloat(formData.kmVolta) < parseFloat(formData.kmIda)) {
            Alert.alert("Erro", "Km final não pode ser menor que o Km inicial.");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validar()) return;

        const payload = {
            id: registro?.id || null,
            condutor: formData.condutor,
            rgCondutor: formData.rgCondutor,
            dataMarcada: parseDate(dataSelecionada), // data do dia selecionado no dashboard
            horaInicio: formData.horaInicio,
            horaSaida: formData.horaSaida,
            destino: formData.destino,
            kmIda: parseFloat(formData.kmIda),
            kmVolta: parseFloat(formData.kmVolta),
            observacoes: formData.observacoes || null,
            editadoPor: formData.editadoPor || null,
            veiculo: formData.veiculo,
            placa: formData.placa,
        };

        try {
            if (onSalvar) await onSalvar(payload);
            Alert.alert(
                "Sucesso",
                registro ? "Registro atualizado com sucesso!" : "Registro salvo com sucesso!"
            );
            onClose();
        } catch (error) {
            Alert.alert("Erro", "Erro ao salvar: " + (error.message || "Erro desconhecido"));
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>{registro ? "Editar Registro" : "Novo Registro"}</Text>
                    <ScrollView>
                        {/* Campos do formulário */}
                        {[
                            { id: "condutor", label: "Condutor" },
                            // Atualizado id
                            { id: "rgCondutor", label: "RG" },
                            { id: "veiculo", label: "Veículo" },
                            { id: "placa", label: "Placa" },
                            { id: "destino", label: "Destino" },
                            // Atualizado
                            { id: "kmIda", label: "Km Inicial", keyboardType: "numeric" },
                            // Atualizado
                            { id: "kmVolta", label: "Km Final", keyboardType: "numeric" },
                            { id: "horaInicio", label: "Hora de Início" },
                            { id: "horaSaida", label: "Hora de Saída" },
                            { id: "editadoPor", label: "Editado por" },
                        ].map(({ id, label, keyboardType = "default" }) => (
                            <TextInput
                                key={id}
                                style={styles.input}
                                placeholder={label}
                                value={formData[id]}
                                onChangeText={(value) => handleChange(id, value)}
                                keyboardType={keyboardType}
                                autoCapitalize="none"
                            />
                        ))}

                        {/* Mostrar data como texto separado */}
                        <View style={{ marginVertical: 10 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 16, color: "#333" }}>
                                Data: {parseDate(dataSelecionada)}
                            </Text>
                        </View>

                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Observações"
                            value={formData.observacoes}
                            onChangeText={(value) => handleChange("observacoes", value)}
                            multiline
                            numberOfLines={4}
                        />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onClose}>
                                <Text style={[styles.buttonText, { color: "#444" }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default ModalRegistro;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    modal: {
        backgroundColor: "#fff",
        borderRadius: 20,
        width: "95%",
        maxHeight: "85%",
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.25,
        shadowRadius: 30,
        elevation: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#4b0082",
        marginBottom: 8,
        textAlign: "center",
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: "#333",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 2,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: "top",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 24,
        gap: 12,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        flex: 1,
        marginHorizontal: 4,
    },
    cancel: {
        backgroundColor: "#e0e0e0",
    },
    save: {
        backgroundColor: "#7b2ff7",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "500",
        fontSize: 16,
    },
});
