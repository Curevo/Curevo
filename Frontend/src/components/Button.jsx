import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

const Button = () => {
  const [animate, setAnimate] = useState(false);

  return (
    <button
      onClick={() => (window.location.href = "./navigation-pages/contact.html")}
      onMouseEnter={() => setAnimate(true)}
      onAnimationEnd={() => setAnimate(false)}
      className="flex items-center justify-between px-4 py-2 rounded-full bg-neutral-900 text-neutral-200 font-medium text-lg transition duration-300"
    >
      <p className="text-base font-bold">Get In Touch</p>
      <div className="ml-3 h-9 w-9 flex items-center justify-center rounded-full bg-white border border-neutral-900 overflow-hidden">
        <div className={animate ? "animate-arrowLoop" : ""}>
          <ArrowUpRight className="text-neutral-900" />
        </div>
      </div>
    </button>
  );
};

export default Button;
