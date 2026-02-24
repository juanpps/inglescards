import { motion } from 'framer-motion';
import { Mail, MessageCircle, Heart, Globe, Award, Rocket } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export function About() {
    return (
        <div className="max-w-3xl mx-auto space-y-12 pb-24 px-4">
            {/* Hero Section - Reimagined Integration */}
            <section className="relative pt-20 pb-10 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative inline-block group"
                    >
                        {/* Pedestal / Glass Container */}
                        <div className="relative w-40 h-40 mx-auto transition-transform duration-500 group-hover:scale-105">
                            <div className="absolute inset-0 bg-white/5 dark:bg-zinc-900/40 backdrop-blur-xl rounded-[40px] border border-white/10 dark:border-zinc-800/50 shadow-2xl" />

                            {/* Inner Logo */}
                            <div className="absolute inset-0 p-6 flex items-center justify-center">
                                <motion.img
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    src="/jm-logo.png"
                                    alt="JM Code Logo"
                                    className="w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]"
                                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/200?text=JM+Code')}
                                />
                            </div>
                        </div>

                        {/* Decorative ring */}
                        <div className="absolute -inset-4 border border-indigo-500/10 rounded-[56px] scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                    </motion.div>

                    <div className="space-y-4 max-w-sm mx-auto px-6">
                        <p className="text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-[0.4em] text-[10px] leading-relaxed">
                            Transformando problemas reales en
                        </p>
                        <p className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.2em] text-sm">
                            Sistemas de Impacto
                        </p>
                        <div className="h-px w-8 bg-indigo-500/30 mx-auto" />
                    </div>
                </div>
            </section>

            {/* Founder Profile */}
            <section>
                <Card className="border-none rounded-[32px] overflow-hidden shadow-premium bg-zinc-900 text-white">
                    <CardContent className="p-0 flex flex-col md:flex-row">
                        <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                            <img
                                src="/founder.jpg"
                                alt="Juan Miguel Guerrero Tenorio"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400?text=Juan+Miguel')}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-zinc-900" />
                        </div>
                        <div className="md:w-3/5 p-8 md:p-10 space-y-6 flex flex-col justify-center">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">GUERRERO TENORIO JUAN MIGUEL</h2>
                                <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs mt-1">CEO Y FUNDADOR</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-zinc-400 leading-relaxed italic text-lg">
                                    "Sé lo que quieras ser"
                                </p>
                                <p className="text-indigo-400 font-bold text-sm">— Barbie</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 pt-6 border-t border-zinc-800">
                                <a
                                    href="mailto:migueljuanguerrerot@gmail.com"
                                    className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20"
                                >
                                    <Mail className="w-5 h-5" />
                                    <span>Enviar Correo</span>
                                </a>
                                <a
                                    href="https://wa.me/573241241417"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    <span>WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Manifesto Section */}
            <section className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                <Rocket className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-black dark:text-white">Nuestra Esencia</h3>
                        </div>
                        <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                            <p>Somos una empresa de SaaS accesible. Software como servicio, claro y sin enredos. Herramientas digitales que trabajan mientras tú trabajas.</p>
                            <p>Nacimos en tierra caliente, donde el rebusque es talento y la ambición no se esconde. Sabemos lo que es empezar pequeño.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-black dark:text-white">Para el Pueblo</h3>
                        </div>
                        <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                            <p>Construimos para el pequeño. Para el negocio del barrio. Para el independiente que quiere verse profesional. Para la empresa que quiere crecer sin pagar millones.</p>
                            <p>Creemos que la tecnología no debe ser un lujo. Debe ser una palanca.</p>
                        </div>
                    </div>
                </div>

                {/* Main Text Content */}
                <Card className="border-none bg-zinc-50 dark:bg-zinc-800/40 rounded-[32px] p-8 md:p-12 overflow-hidden relative group">
                    <Globe className="absolute -bottom-8 -right-8 w-48 h-48 text-zinc-200 dark:text-zinc-700/20 rotate-12 transition-transform group-hover:rotate-45 duration-1000" />
                    <div className="relative space-y-6 text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed font-medium">
                        <p>En JM Code convertimos problemas reales en sistemas simples. Automatizamos lo repetitivo. Ordenamos el caos. Digitalizamos lo que antes se hacía a mano.</p>
                        <p className="text-indigo-600 dark:text-indigo-400 font-black text-2xl">No vendemos humo. Vendemos soluciones que generan ingresos.</p>
                        <p>Creamos SaaS prácticos, escalables y accesibles. Sin contratos abusivos. Sin precios imposibles. Sin complicaciones innecesarias.</p>
                        <p>Aquí se construye con mentalidad global pero con los pies en el barrio. Cada línea de código es estrategia. Cada producto es una herramienta de crecimiento. Cada cliente es un socio en expansión.</p>
                        <p className="border-l-4 border-indigo-500 pl-6 italic">
                            No estamos aquí para jugar a la empresa. Estamos aquí para crear empresa real. JM Code es disciplina. Es ejecución. Hoy empezamos pequeños... Pero nuestros sistemas están hechos para escalar.
                        </p>
                    </div>
                </Card>
            </section>

            {/* Gratitude Section */}
            <section className="pt-8 text-center space-y-8">
                <div className="flex items-center justify-center gap-2 text-zinc-400">
                    <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-800" />
                    <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
                    <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-800" />
                </div>

                <div className="max-w-xl mx-auto space-y-4">
                    <h3 className="text-2xl font-black dark:text-white">🕊️ Nota de Agradecimiento</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                        Esta aplicación fue creada como un acto de gratitud.
                        A <span className="text-indigo-600 dark:text-indigo-400 font-bold">SeamosGenios</span>, por su trabajo, por sembrar conocimiento y por demostrar que aprender puede ser accesible y transformador.
                    </p>
                </div>

                <div className="pt-12 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                    Porque el futuro no se espera. Se programa.
                </div>
            </section>
        </div>
    );
}
