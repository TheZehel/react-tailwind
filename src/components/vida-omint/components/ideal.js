import React, { useState } from 'react';
import { Skull, Ambulance, Syringe, Church, House, Apple, Shield, Dog, Laptop, Brain } from 'lucide-react';

const PrimeIdeal = () => {
    const [activeTab, setActiveTab] = useState('coverages');
    const [openCoverage, setOpenCoverage] = useState(null);

    const coverages = [
        {
            id: 1,
            title: 'Morte',
            description: "Garante o pagamento do capital segurado, de uma única vez, aos beneficiários em caso de morte do segurado por causas naturais ou acidentais, devidamente coberta pelo seguro, durante a vigência da apólice.",
            icon: <Skull className="w-6 h-6 text-bluePrime" />,
        },
        {
            id: 2,
            title: 'Morte acidental',
            description: "Garante o pagamento do capital segurado, de uma única vez, aos beneficiários em caso de morte do segurado durante a vigência da apólice exclusivamente decorrente de acidente pessoal coberto.",
            icon: <Skull className="w-6 h-6 text-bluePrime" />,
        },
        {
            id: 3,
            title: 'Invalidez Permanente Total ou Parcial por Acidente',
            description: "Garante o pagamento de indenização ao segurado, proporcional à incapacidade física permanente, total ou parcial, decorrente de acidente pessoal coberto.",
            icon: <Ambulance className="w-6 h-6 text-bluePrime" />,
        },
        {
            id: 4,
            title: 'Invalidez Funcional Permanente Total por Doença',
            description: "Garante a antecipação do capital segurado contratado para a cobertura de morte, em caso de invalidez funcional permanente e total por doença, que acarrete ao segurado a perda de suas funções autonômicas.",
            icon: <Syringe className="w-6 h-6 text-bluePrime" />,
        },
        {
            id: 5,
            title: 'Diagnóstico de Câncer',
            description: "Garante o pagamento do capital segurado contratado ao segurado no caso de diagnóstico de câncer coberto, durante a vigência da apólice, desde que sobreviva após 30 dias do referido diagnóstico.",
            icon: <Syringe className="w-6 h-6 text-bluePrime" />,
        },
        {
            id: 6,
            title: 'Funeral Individual',
            description: "Garante ao responsável pelo pagamento o reembolso das despesas incorridas com o funeral do segurado no caso de sua morte, por causas naturais ou acidentais, durante a vigência da apólice.",
            icon: <Church className="w-6 h-6 text-bluePrime" />,
        },
        {
            id: 7,
            title: 'Invalidez Permanente',
            description: 'Garante o pagamento de indenização complementar ao segurado em caso de lesão de determinados órgãos que determine a caracterização de invalidez permanente em virtude de acidente pessoal coberto. Cobertura disponível apenas para médicos, dentistas e enfermeiros.',
            icon: <Ambulance className="w-6 h-6 text-bluePrime" />,
        },
        {
            id: 8,
            title: 'Doeças graves',
            description: `Garante o pagamento do capital segurado contratado ao segurado no caso de diagnóstico definitivo de uma doença grave coberta ou da realização de um procedimento médico coberto, desde que sobreviva após 30 dias do referido diagnóstico ou procedimento.`,
            icon: <Syringe className="w-6 h-6 text-bluePrime" />,
        },
        {
            id: 9,
            title: 'Doenças Graves Ampliada',
            description: `Garante o pagamento do capital segurado contratado ao segurado no caso de diagnóstico definitivo de uma doença grave coberta ou da realização de um procedimento médico coberto, desde que sobreviva após 30 dias do referido diagnóstico ou procedimento. O rol de doenças graves e procedimentos médicos cobertos nesta garantia é mais amplo do que o previsto na cobertura de doenças graves.`,
            icon: <Syringe className="w-6 h-6 text-bluePrime" />,
        },
        {
            id: 10,
            title: 'Funeral Familiar',
            description: `Garante ao responsável pelo pagamento o reembolso das despesas incorridas com o funeral do segurado, seu cônjuge, filhos ou enteados no caso de morte, por causas naturais ou acidentais, durante a vigência da apólice. Como alternativa, poderá ser acionado o serviço de assistência funeral, pelo qual a prestadora de serviços de assistência, contratada pela Omint, assumirá as providências necessárias para a realização do funeral, como contratação dos serviços, registros em cartório, sepultamento/cremação, traslado, entre outros serviços.`,
            icon: <Church className="w-6 h-6 text-bluePrime" />,
        },
        {
            id: 11,
            title: 'Jazigo',
            description: `Garante ao responsável pelo pagamento o reembolso de despesas com aquisição de jazigo no caso de morte do segurado, por causas naturais ou acidentais, durante a vigência da apólice.`,
            icon: <Church className="w-6 h-6 text-bluePrime" />,
        },
    ];

    const assistances = [
        {
            id: 1,
            title: 'Residencial',
            description: 'Serviços emergenciais como encanador, chaveiro e eletricista.',
            icon: <House className="w-8 h-8 text-bluePrime" />,
        },
        {
            id: 2,
            title: 'Nutricional',
            description: 'Orientações sobre alimentação e rotina saudável.',
            icon: <Apple className="w-8 h-8 text-bluePrime" />,
        },
        {
            id: 3,
            title: 'Vítima de Crime',
            description: 'Serviços de remoção médica e assistência emergencial.',
            icon: <Shield className="w-8 h-8 text-bluePrime" />,
        },
        {
            id: 4,
            title: 'Pet',
            description: 'Serviços veterinários para cães e gatos.',
            icon: <Dog className="w-8 h-8 text-bluePrime" />,
        },
        {
            id: 5,
            title: 'Suporte a informática',
            description: 'Suporte telefônico ao Segurado para auxílio na utilização de computadores.',
            icon: <Laptop className="w-8 h-8 text-bluePrime" />,
        },
        {
            id: 6,
            title: 'Aconselhamento psicológico',
            description: 'Serviço de atendimento telefônico receptivo, prestado ao Segurado por psicólogo.',
            icon: <Brain className="w-8 h-8 text-bluePrime" />,
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="max-w-6xl mx-auto px-4 pt-20 pb-24">
                <h1 className="text-bluePrime text-xl sm:text-2xl text-center mb-6">Prime Ideal</h1>
                <p className=" text-gray-500 text-lg text-center mb-8 sm:mb-0 ">
                    Proteção financeira para você e sua família, com contratação simplificada
                    e capitais segurados até R$ 5 milhões.
                </p>
            </div>

            {/* Navigation */}
            <div className="border-t border-b border-gray-300">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex space-x-8 text-center items-center justify-center">
                        <button
                            className={`py-6 px-2 relative ${activeTab === 'coverages' ? 'text-bluePrime' : 'text-grayPrime'}`}
                            onClick={() => setActiveTab('coverages')}
                        >
                            Coberturas
                            {activeTab === 'coverages' && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-bluePrime"></div>
                            )}
                        </button>
                        <button
                            className={`py-6 px-2 relative ${activeTab === 'assistances' ? 'text-bluePrime' : 'text-grayPrime'}`}
                            onClick={() => setActiveTab('assistances')}
                        >
                            Assistências
                            {activeTab === 'assistances' && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-bluePrime"></div>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-4 py-24">
                {activeTab === 'coverages' && (
                    <div className="grid gap-4 xl:grid-cols-1 sm:w-[830px] mx-auto">
                        {coverages.map((coverage) => (
                            <div key={coverage.id} className="border border-gray-300 rounded-md w-full">
                                <button
                                    onClick={() => setOpenCoverage(openCoverage === coverage.id ? null : coverage.id)}
                                    className="w-full p-4 flex justify-between items-center"
                                >
                                    <span className="flex items-center space-x-3">
                                        {coverage.icon}
                                        <span className="text-lg font-medium text-grayPrime">{coverage.title}</span>
                                    </span>
                                    <span className={`transform transition-transform ${openCoverage === coverage.id ? 'rotate-45' : ''}`}>+</span>
                                </button>
                                {openCoverage === coverage.id && (
                                    <div className="p-4">
                                        <p className="text-sm text-gray-600">{coverage.description}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'assistances' && (
                    <div className="flex flex-wrap justify-center gap-4">
                        {assistances.map((assistance) => (
                            <div
                                key={assistance.id}
                                className="w-[300px] border border-gray-300 rounded-md p-4 bg-white shadow-sm"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="flex flex-col space-x-2 items-center mb-3">
                                        {assistance.icon}
                                        <h3 className="text-lg font-medium text-center mb-3">{assistance.title}</h3>
                                    </div>
                                    <p className="text-grayPrime text-center text-base">{assistance.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrimeIdeal;