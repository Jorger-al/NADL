import React from 'react';
import { Link } from 'react-router-dom';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { Footer } from '@/components/layout/Footer';

export default function ReturnToHome() {
    return (
        <div className="bg-[#f3f4f6] min-h-screen font-body flex flex-col text-[#222]">
            <TopNavBar />

            <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-6">
                <div className="w-full max-w-[600px] text-center">

                    <h1 className="text-7xl md:text-8xl font-extralight text-[#2f4050] tracking-tight font-display my-[10px]">
                        404
                    </h1>

                    <div className="w-[200px] h-[3px] bg-[#705a44] mx-auto my-[20px]"></div>

                    <h2 className="text-2xl md:text-3xl font-light text-[#2f4050] tracking-tight font-display my-[26px]">
                        Page Not Found
                    </h2>

                    <p className="text-[#4b5563] text-[15px] leading-[1.85] font-light max-w-[480px] mx-auto my-[20px]">
                        The page you are looking for does not exist or has been moved.
                    </p>

                    <div className="pt-4">
                        <Link
                            to="/"
                            className="inline-block border border-[#2f4050] bg-transparent text-[#2f4050] px-8 py-3 text-[13px] font-medium tracking-[0.1em] uppercase transition-all duration-300 hover:bg-[#2f4050] hover:text-white"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
