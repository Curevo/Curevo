import React from 'react'

const AboutHero = () => {
return (
    <div className="bg-[#edf7fc] px-4 py-8 md:px-16">
        <div className="max-w-7xl mx-auto">
            {/* Heading Section */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-4 leading-tight">
            A legacy of trust, excellence & innovation <br className="hidden sm:block" /> in healthcare solutions
            </h1>
            <p className="text-sm text-gray-600 mb-2">
            Today, we stand as a trusted name in the industry, known for our advanced facilities,
            dedicated professionals & unwavering commitment to improving lives.
            </p>
            <p className="text-sm text-gray-900 text-right mb-3">
            • Caring for life, Researching for health
            </p>

            {/* Main Image */}
            <div className="rounded-lg overflow-hidden mb-8">
            <img
                src="/src/assets/about1.jpg"
                alt="Healthcare team in operation"
                className="w-full object-cover max-h-[500px]"
            />
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 ">
            {/* Card 1 */}
                <div className="relative rounded overflow-hidden">
                    <img
                    src="/src/assets/about2.jpg"
                    alt="First aid kit"
                    className="w-full h-52 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4">
                    <p className="text-white text-lg mb-2">
                        Shaping a healthier tomorrow through <br /> compassion and innovation
                    </p>
                    </div>
                </div>

            {/* Card 2 */}
            <div className="relative rounded overflow-hidden">
                <img
                src="/src/assets/about3.jpg"
                alt="Doctors in discussion"
                className="w-full h-52 object-cover"
                />
                {/* Optional overlay or text if needed */}
            </div>

            {/* Card 3 */}
            <div className="relative rounded overflow-hidden">
                <img
                src="/src/assets/about4.jpg"
                alt="Patient-centric care"
                className="w-full h-52 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
                <p className="text-white text-lg">
                    Leading the way in transformative and <br /> patient-centric care
                </p>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}

export default AboutHero