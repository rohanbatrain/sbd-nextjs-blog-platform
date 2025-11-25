"use client";

import { motion } from "framer-motion";
import { Database, Brain, Code, GitBranch, Star, Users, Shield, Zap, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function Features() {
    const [activeTab, setActiveTab] = useState<'publishing' | 'growth' | 'monetization'>('publishing');

    return (
        <section className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#040508] to-[#0C0F15] justify-center items-center relative py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl bp3:text-3xl bp4:text-4xl font-light mb-6 text-white"
                    >
                        Everything You Need to Write
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-white/70 max-w-3xl mx-auto mb-12"
                    >
                        Powerful tools to help you create, publish, and grow your audience
                    </motion.p>

                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-1 border border-white/10">
                            <div className="flex flex-wrap justify-center gap-2">
                                <button
                                    onClick={() => setActiveTab('publishing')}
                                    className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${activeTab === 'publishing'
                                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                            : 'text-white/70 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    Publishing
                                </button>
                                <button
                                    onClick={() => setActiveTab('growth')}
                                    className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${activeTab === 'growth'
                                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                            : 'text-white/70 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    Growth
                                </button>
                                <button
                                    onClick={() => setActiveTab('monetization')}
                                    className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${activeTab === 'monetization'
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : 'text-white/70 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    Monetization
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Publishing Features Tab */}
                {activeTab === 'publishing' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
                    >
                        <FeatureCard
                            icon={<Code className="w-6 h-6 text-blue-400" />}
                            iconBg="bg-blue-500/20"
                            title="Rich Text Editor"
                            description="A distraction-free writing environment with markdown support, drag-and-drop media, and real-time preview."
                            list={[
                                "Markdown & Rich Text support",
                                "Drag & drop image uploads",
                                "Code syntax highlighting",
                                "Auto-save & version history"
                            ]}
                        />
                        <FeatureCard
                            icon={<GitBranch className="w-6 h-6 text-cyan-400" />}
                            iconBg="bg-cyan-500/20"
                            title="Content Management"
                            description="Organize your posts with tags, categories, and series. Schedule posts for future publication."
                            list={[
                                "Advanced tagging system",
                                "Series & Collections",
                                "Scheduled publishing",
                                "Draft collaboration"
                            ]}
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Star className="w-6 h-6 text-yellow-400" />}
                            iconBg="bg-yellow-500/20"
                            title="Custom Themes"
                            description="Make your blog unique with customizable themes, fonts, and layouts. No coding required."
                            list={[
                                "Dark & Light modes",
                                "Custom fonts & colors",
                                "Layout builder",
                                "Mobile responsive"
                            ]}
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Shield className="w-6 h-6 text-green-400" />}
                            iconBg="bg-green-500/20"
                            title="Media Library"
                            description="Store and manage all your images and assets in one place. Optimized delivery via global CDN."
                            list={[
                                "Unlimited storage",
                                "Automatic image optimization",
                                "Global CDN delivery",
                                "Asset organization"
                            ]}
                            delay={0.3}
                        />
                    </motion.div>
                )}

                {/* Growth Features Tab */}
                {activeTab === 'growth' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
                    >
                        <FeatureCard
                            icon={<TrendingUp className="w-6 h-6 text-purple-400" />}
                            iconBg="bg-purple-500/20"
                            title="SEO Optimization"
                            description="Built-in SEO tools to help your content rank higher. Automatic sitemaps, meta tags, and social previews."
                            list={[
                                "Auto-generated sitemaps",
                                "Custom meta tags",
                                "Social media previews",
                                "Canonical URLs"
                            ]}
                        />
                        <FeatureCard
                            icon={<Users className="w-6 h-6 text-pink-400" />}
                            iconBg="bg-pink-500/20"
                            title="Newsletter Integration"
                            description="Turn readers into subscribers. Collect emails directly from your blog posts and send newsletters."
                            list={[
                                "Built-in signup forms",
                                "Email automation",
                                "Subscriber management",
                                "Export to CSV"
                            ]}
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Database className="w-6 h-6 text-blue-400" />}
                            iconBg="bg-blue-500/20"
                            title="Analytics"
                            description="Understand your audience with privacy-first analytics. Track views, reading time, and traffic sources."
                            list={[
                                "Real-time pageviews",
                                "Reading time tracking",
                                "Referrer analytics",
                                "Privacy-focused"
                            ]}
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<GitBranch className="w-6 h-6 text-orange-400" />}
                            iconBg="bg-orange-500/20"
                            title="Social Sharing"
                            description="Make it easy for readers to share your content. Customizable share buttons and tweetable quotes."
                            list={[
                                "One-click sharing",
                                "Tweetable quotes",
                                "Social cards",
                                "Engagement tracking"
                            ]}
                            delay={0.3}
                        />
                    </motion.div>
                )}

                {/* Monetization Features Tab */}
                {activeTab === 'monetization' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
                    >
                        <FeatureCard
                            icon={<Shield className="w-6 h-6 text-green-400" />}
                            iconBg="bg-green-500/20"
                            title="Memberships"
                            description="Create paid tiers for your most loyal readers. Offer exclusive content and perks."
                            list={[
                                "Recurring subscriptions",
                                "Member-only content",
                                "Tiered access",
                                "Stripe integration"
                            ]}
                        />
                        <FeatureCard
                            icon={<Star className="w-6 h-6 text-yellow-400" />}
                            iconBg="bg-yellow-500/20"
                            title="Digital Products"
                            description="Sell eBooks, courses, and templates directly from your blog. Seamless checkout experience."
                            list={[
                                "Digital downloads",
                                "Secure delivery",
                                "Payment processing",
                                "Sales analytics"
                            ]}
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Users className="w-6 h-6 text-purple-400" />}
                            iconBg="bg-purple-500/20"
                            title="Sponsorships"
                            description="Manage sponsor relationships and display ads without compromising user experience."
                            list={[
                                "Ad placement control",
                                "Sponsor management",
                                "Click tracking",
                                "Custom integrations"
                            ]}
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Database className="w-6 h-6 text-cyan-400" />}
                            iconBg="bg-cyan-500/20"
                            title="Affiliate Tools"
                            description="Built-in tools to manage and track affiliate links. Disclose partnerships automatically."
                            list={[
                                "Link management",
                                "Click tracking",
                                "Auto-disclosure",
                                "Performance reports"
                            ]}
                            delay={0.3}
                        />
                    </motion.div>
                )}
            </div>
        </section>
    );
}

function FeatureCard({ icon, iconBg, title, description, list, delay = 0 }: {
    icon: React.ReactNode,
    iconBg: string,
    title: string,
    description: string,
    list: string[],
    delay?: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 hover:bg-white/10 transition-colors duration-300"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
                    {icon}
                </div>
                <h3 className="text-2xl font-semibold text-white">{title}</h3>
            </div>
            <p className="text-white/80 mb-4">
                {description}
            </p>
            <ul className="text-white/70 space-y-2">
                {list.map((item, i) => (
                    <li key={i}>• {item}</li>
                ))}
            </ul>
        </motion.div>
    );
}
