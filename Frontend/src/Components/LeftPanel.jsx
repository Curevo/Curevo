import React from "react";

export default function LeftPanel() {
    return (
        <div
            className="w-1/2 bg-cover bg-center relative hidden lg:block p-10 opacity-85 rounded-[50px] border-[20px] border-blue-900"
            style={{ backgroundImage: "url('/Assets/leftPanel.jpg')" }}
        >
            <img className='w-36' src="/Assets/Curevo-logo.png" alt="Logo of curevo"/>
            <button className="absolute top-10 right-8  bg-white text-sm px-3 py-2 rounded-full hover:bg-slate-600 hover:text-white duration-300" onClick={() => window.location.href = '/'}>
            Back to website →
            </button>
            <div className="absolute bottom-8 left-8 text-white text-xl font-medium leading-snug">
            Curing Lives,
            <br />
            One Step at a Time
            </div>
        </div>
    );
}