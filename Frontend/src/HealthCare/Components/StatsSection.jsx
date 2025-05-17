import React from 'react';

const stats = [
    {
        value: '16+',
        description: 'Vaxet has been a trusted provider of exceptional healthcare services.',
    },
    {
        value: '6000+',
        description: 'We are proud to serve over 6,000+ patient visits annually.',
    },
    {
        value: '75k+',
        description: 'We take pride in the trust your health & happiness are our top priorities.',
    },
    {
        value: '20+',
        description: 'Each bringing a wealth of knowledge & expertise to provide you.',
    },
];

const StatsSection = () => {
    return (
        <section className=" text-gray-900 py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
            {/* Header */}
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
            A data-driven approach to better healthcare
            </h2>
            <p className="text-sm md:text-base text-gray-900 max-w-2xl mx-auto mb-12">
            From the number of consultations to our patient satisfaction rates, we are committed to
            delivering the best possible outcomes for every individual.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {stats.map((stat, index) => (
                <div
                key={index}
                className="w-64 h-64 bg-white border-4 border-gray-200 rounded-full flex flex-col justify-center items-center text-center p-6 shadow-md"
                >
                <h3 className="text-3xl font-semibold text-black mb-2">{stat.value}</h3>
                <p className="text-sm text-gray-700">{stat.description}</p>
                </div>
            ))}
            </div>
        </div>
        </section>
    );
};

export default StatsSection;
