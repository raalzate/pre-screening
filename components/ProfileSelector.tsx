"use client";

import React from 'react';

interface Profile {
    name: string;
    code: string;
    requirements: string;
    step: string;
    form_id: string;
}

interface ProfileSelectorProps {
    profiles: Profile[];
    onSelect: (requirements: string, formId: string) => void;
}

const NIVELS = {
    "jr": "Júnior",
    "ssr": "Semi-Senior",
    "sr": "Senior"
}

export default function ProfileSelector({ profiles, onSelect }: ProfileSelectorProps) {
    return (
        <div className="w-full max-w-md space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Selecciona tu Perfil</h2>
                <p className="mt-2 text-gray-600">
                    Tienes múltiples procesos activos. Por favor selecciona con cuál perfil deseas continuar.
                </p>
            </div>

            <div className="space-y-4">
                {profiles.map((profile) => (
                    <button
                        key={`${profile.requirements}-${profile.form_id}`}
                        onClick={() => onSelect(profile.requirements, profile.form_id)}
                        className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group text-left"
                    >
                        <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                                {profile.form_id.toUpperCase().replace('-', ' ') + " - " + (NIVELS[profile.requirements.split('-').at(-1) as keyof typeof NIVELS] ?? 'Desconocido')}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Estado: <span className="capitalize">{profile.step.replace('_', ' ')}</span>
                            </p>
                        </div>
                        <div className="text-gray-400 group-hover:text-blue-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
