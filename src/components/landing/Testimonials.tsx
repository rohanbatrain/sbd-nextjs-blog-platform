"use client";

import { Users, Shield } from "lucide-react";

export default function Testimonials() {
    return (
        <section className="min-h-screen w-full flex flex-col bg-gradient-to-b to-[#040508] from-[#0C0F15] justify-center items-center relative py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-5xl bp3:text-3xl bp4:text-4xl font-light mb-6 text-white">
                        Loved by Writers
                    </h2>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto">
                        Join thousands of creators who have found their home on our platform
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                        <p className="text-white/80 mb-6 italic leading-relaxed">
                            &quot;I used to spend hours managing plugins and themes. Now I just write. The built-in SEO and newsletter tools helped me grow my audience from 0 to 10k in just six months.&quot;
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-white font-semibold">Sarah Jenkins</p>
                                <p className="text-white/60 text-sm">Tech Journalist & Blogger</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                        <p className="text-white/80 mb-6 italic leading-relaxed">
                            &quot;The monetization features are a game changer. Being able to offer paid subscriptions and sell digital products directly from my blog has turned my passion into a full-time career.&quot;
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                                <Shield className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <p className="text-white font-semibold">Marcus Chen</p>
                                <p className="text-white/60 text-sm">Financial Advisor & Author</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
