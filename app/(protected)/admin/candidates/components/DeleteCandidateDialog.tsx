"use client";

import React, { useState } from "react";

interface DeleteCandidateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string, customReason?: string) => Promise<void>;
    candidateName: string;
    isDeleting: boolean;
}

const PREDEFINED_REASONS = [
    { id: "POSITION_FILLED", label: "Posición ya cubierta" },
    { id: "RECRUITMENT_PAUSED", label: "Proceso de reclutamiento pausado" },
    { id: "PROFILE_MISMATCH", label: "Perfil no se ajusta a los requerimientos actuales" },
    { id: "CUSTOM", label: "Otro motivo..." },
];

export const DeleteCandidateDialog: React.FC<DeleteCandidateDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    candidateName,
    isDeleting,
}) => {
    const [selectedReason, setSelectedReason] = useState("");
    const [customReason, setCustomReason] = useState("");

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!selectedReason) return;
        onConfirm(selectedReason, selectedReason === "CUSTOM" ? customReason : undefined);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Eliminar Candidato</h3>
                <p className="text-gray-600 mb-6">
                    Estás por eliminar permanentemente a <span className="font-bold text-gray-900">{candidateName}</span>.
                    Esta acción no se puede deshacer y el candidato será notificado por correo electrónico.
                </p>

                <div className="space-y-4 mb-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Motivo de la eliminación:</label>
                        <select
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-red-500 outline-none transition"
                        >
                            <option value="">-- Seleccionar --</option>
                            {PREDEFINED_REASONS.map((r) => (
                                <option key={r.id} value={r.id}>{r.label}</option>
                            ))}
                        </select>
                    </div>

                    {selectedReason === "CUSTOM" && (
                        <div className="animate-in slide-in-from-top-2 duration-200">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Especificar motivo:</label>
                            <textarea
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Escribe el motivo aquí..."
                                className="w-full p-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-red-500 outline-none transition h-24 resize-none"
                            />
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedReason || (selectedReason === "CUSTOM" && !customReason) || isDeleting}
                        className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2"
                    >
                        {isDeleting ? "Eliminando..." : "Confirmar Eliminación"}
                    </button>
                </div>
            </div>
        </div>
    );
};
