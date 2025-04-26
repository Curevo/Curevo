import product1 from "../assets/product1.png";
import product2 from "../assets/product2.png";
import product3 from "../assets/product3.png";

const Hero = () => {
    return (
        <div className="w-full h-auto flex items-center justify-center">
        <section className="w-[95%] md:w-[90%] h-[50vh] md:h-[90vh] relative bg-gradient-to-b from-white to-[#E4FF46] py-20 md:py-32 overflow-hidden rounded-3xl">
            {/* Content */}
            <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 leading-snug md:leading-tight">
                Your pathway to <span className="text-green-700">wellness</span> <br className="hidden sm:block" /> begins here
            </h1>
            <p className="mt-4 text-sm md:text-base text-gray-900 font-semibold ">
                Personalized treatments made with Rx ingredients and supplements.
            </p>
            <button className="mt-6 px-5 py-2 md:px-6 md:py-3 bg-white text-black rounded-full shadow-md hover:shadow-lg transition">
                Shop now
            </button>
            </div>

            {/* Floating Bottles */}
            <img
            src={product2}
            alt="Capsule Left"
            className="absolute w-24 sm:w-36 md:w-52 left-[20px] sm:left-[20px] bottom-0 rotate-[-20deg] z-0 opacity-85"
            />
            <img
            src={product3}
            alt="Capsule Middle"
            className="absolute w-24 sm:w-36 md:w-52 left-[40%] bottom-[-20px] rotate-[60deg] z-0 opacity-85"
            />
            <img
            src={product1}
            alt="Capsule Right"
            className="absolute w-24 sm:w-36 md:w-52 right-[10px] sm:right-[20px] bottom-0 rotate-[25deg] z-0 opacity-85"
            />
        </section>
        </div>
    );
};

export default Hero;
