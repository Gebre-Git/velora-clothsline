import React, { useEffect } from 'react';

const GuidelineSection: React.FC<{ title: string; children: React.ReactNode; animationDelay?: string; className?: string }> = ({ title, children, animationDelay = '0.2s', className = '' }) => (
    <section className={`mb-16 opacity-0 ${className}`} data-animation="animate-fade-in-up" style={{ animationDelay }}>
        <h2 className="text-3xl font-bold text-velora-dark mb-6 border-l-4 border-velora-green pl-4">{title}</h2>
        <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            {children}
        </div>
    </section>
);

const StepWithImage: React.FC<{ imageSrc: string; alt: string; title: string; children: React.ReactNode; reverse?: boolean }> = ({ imageSrc, alt, title, children, reverse = false }) => (
    <div className={`grid md:grid-cols-2 gap-12 items-center mb-12 opacity-0`} data-animation={reverse ? "animate-slide-in-right" : "animate-slide-in-left"}>
        <div className={` ${reverse ? 'md:order-2' : ''}`}>
            <img src={imageSrc} alt={alt} className="rounded-lg shadow-xl w-full" />
        </div>
        <div className={`space-y-3 ${reverse ? 'md:order-1' : ''}`}>
            <h3 className="text-2xl font-semibold text-velora-dark">{title}</h3>
            {children}
        </div>
    </div>
);

const SafetyIcon: React.FC<{ d: string }> = ({ d }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-velora-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
);


const GuidelinesPage: React.FC = () => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animation = entry.target.getAttribute('data-animation');
                    if (animation) {
                        entry.target.classList.add(animation);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('[data-animation]');
        elements.forEach(el => observer.observe(el));

        return () => elements.forEach(el => observer.unobserve(el));
    }, []);

    return (
        <>
            {/* Page Header */}
            <div className="bg-velora-dark text-white py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-extrabold opacity-0 animate-fade-in-up">VELORA™ User Guidelines</h1>
                    <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Get the most out of your retractable clothesline. Follow these simple steps for safe and efficient use.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <GuidelineSection title="Welcome to Effortless Drying">
                    <p>Thank you for choosing VELORA™. Our retractable clothesline is designed for durability, convenience, and modern aesthetics. These guidelines will help you use and maintain your product for years of reliable service.</p>
                </GuidelineSection>

                <GuidelineSection title="Safety First" animationDelay="0.4s">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="flex items-start space-x-4">
                            <SafetyIcon d="M13 10V3L4 14h7v7l9-11h-7z" />
                            <p>Do not exceed the maximum load capacity of 25 kg to ensure stability.</p>
                        </div>
                         <div className="flex items-start space-x-4">
                            <SafetyIcon d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            <p>Ensure the unit is securely mounted to a solid wall surface before every use.</p>
                        </div>
                        <div className="flex items-start space-x-4">
                            <SafetyIcon d="M12 9v2m0 4h.01" />
                            <p>Keep lines fully retracted when not in use to prevent tripping hazards.</p>
                        </div>
                         <div className="flex items-start space-x-4">
                            <SafetyIcon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <p>This product is not a toy. Supervise children and keep them away from the lines.</p>
                        </div>
                    </div>
                </GuidelineSection>

                <StepWithImage imageSrc="https://i.imgur.com/bW3YqjB.jpeg" alt="Extending the clothesline away from the unit." title="1. Extending & Locking the Lines">
                   <p className="mb-2">Firmly grip the central bar and pull it horizontally away from the housing unit towards the mounting hooks on the opposite wall.</p>
                   <p className="mb-2">Once you reach the hooks, securely loop the bar onto them.</p>
                   <p>Engage the tension lock on the side of the main unit by turning it clockwise until firm. This prevents the lines from sagging and makes them ready for laundry.</p>
                </StepWithImage>

                <StepWithImage imageSrc="https://i.imgur.com/8xLqT98.jpeg" alt="Laundry hanging evenly on the clothesline." title="2. Loading Your Laundry" reverse={true}>
                   <p className="mb-2">For best results, distribute the weight of wet laundry evenly across all five lines. Avoid placing all heavy items (like wet towels or jeans) on a single line.</p>
                   <p>Use clothespins to secure items, especially on windy days if the unit is installed outdoors. Our high-tensile polyester lines perform best with balanced loads.</p>
                </StepWithImage>

                <StepWithImage imageSrc="https://i.imgur.com/gB8sZzJ.jpeg" alt="Retracted clothesline unit looking sleek and compact against a wall." title="3. Retracting the Unit">
                   <p className="mb-2">Remove all laundry and clothespins from the lines.</p>
                   <p className="mb-2">Unlock the tension knob by turning it counter-clockwise. Then, carefully unhook the central bar from the mounting hooks. <strong>Do not let go of the bar.</strong></p>
                   <p>Slowly and steadily guide the bar back towards the main housing. The internal mechanism will retract the lines smoothly and safely.</p>
                </StepWithImage>

                <GuidelineSection title="Care & Maintenance" className="mt-24">
                    <ul className="list-disc list-inside space-y-3">
                        <li>Wipe the lines and the steel casing with a damp cloth periodically to remove any dust or dirt. Avoid using abrasive cleaners.</li>
                        <li>Before retracting, ensure the lines are as clean and dry as possible to prolong their life and prevent mildew.</li>
                        <li>Check the wall mountings occasionally to ensure they remain secure and tighten any screws if necessary.</li>
                    </ul>
                </GuidelineSection>
            </div>
        </>
    );
};

export default GuidelinesPage;
