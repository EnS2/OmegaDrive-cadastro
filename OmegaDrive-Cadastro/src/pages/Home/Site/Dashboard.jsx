import { CalendarDays, Car, Plus, MapPin, Clock, Pencil, Trash2 } from "lucide-react";

function Dashboard() {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.toLocaleString("pt-BR", { month: "long" });
    const currentYear = today.getFullYear();
    const currentWeekday = today.toLocaleString("pt-BR", { weekday: "long" });

    // Dias no mês atual
    const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();

    return (
        <div className="flex h-screen bg-gray-100 text-gray-900">
            {/* Lateral */}
            <aside className="w-80 bg-gradient-to-r from-purple-700 to-blue-600 text-white p-6">
                <h1 className="text-2xl font-bold mb-1">Grupo Ômega</h1>
                <p className="text-sm opacity-80 mb-8">Controle de Quilometragem</p>

                {/* Calendário dinâmico */}
                <div className="bg-white text-gray-800 rounded-xl p-4">
                    <p className="font-semibold text-purple-700 capitalize">
                        {currentWeekday}, {currentDay} de {currentMonth}
                    </p>
                    <p className="text-sm mb-3 capitalize">{currentMonth} {currentYear}</p>

                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                        {[...Array(daysInMonth)].map((_, i) => (
                            <div
                                key={i}
                                className={`py-1 rounded ${i + 1 === currentDay
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-200"
                                    }`}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        <p className="text-sm">Viagens: <strong>2</strong></p>
                        <p className="text-sm">KM Total: <strong>300 km</strong></p>
                    </div>
                </div>
            </aside>

            {/* Conteúdo Principal */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                        Registros de {currentDay} de {currentMonth}
                    </h2>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2">
                        <Plus size={18} /> Novo Registro
                    </button>
                </div>

                {/* Lista de registros */}
                <div className="space-y-4">
                    {[1, 2].map((registro, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-md p-4">
                            <div className="flex justify-between items-center border-b pb-2 mb-2">
                                <h3 className="font-semibold flex items-center gap-2 text-purple-700">
                                    <Car size={20} /> {idx === 0 ? "Toyota Corolla" : "Honda Civic"}
                                </h3>
                                <span className="text-sm text-gray-600">{today.toLocaleDateString("pt-BR")}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p><strong>Nome:</strong> {idx === 0 ? "Carlos Oliveira" : "Ana Silva"}</p>
                                    <p><strong>RG:</strong> {idx === 0 ? "123.456.789-0" : "234.567.890-1"}</p>
                                    <p className="flex items-center gap-1">
                                        <MapPin size={14} /> {idx === 0 ? "CD - São Paulo" : "Escritório - Campinas"}
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <Clock size={14} /> {idx === 0 ? "08:00 - 10:30" : "13:00 - 15:30"}
                                    </p>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <div>
                                        <p><strong>Inicial:</strong> {idx === 0 ? "15000 km" : "22500 km"}</p>
                                        <p><strong>Final:</strong> {idx === 0 ? "15150 km" : "22650 km"}</p>
                                        <p><strong>Total:</strong> 150 km</p>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button className="text-sm px-2 py-1 border rounded text-blue-600 border-blue-600 flex items-center gap-1">
                                            <Pencil size={14} /> Editar
                                        </button>
                                        <button className="text-sm px-2 py-1 border rounded text-red-600 border-red-600 flex items-center gap-1">
                                            <Trash2 size={14} /> Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
