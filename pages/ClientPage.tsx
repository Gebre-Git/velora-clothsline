import React, { useState, useEffect } from 'react';
import OrderModal from '../components/OrderModal';
import ReviewForm from '../components/ReviewForm';
import ReviewCard from '../components/ReviewCard';
import { type Order, OrderStatus, type Review, ReviewStatus } from '../types';

interface ClientPageProps {
  addOrder: (orderData: Omit<Order, 'id' | 'status' | 'userEmail' | 'createdAt'>) => string;
  getOrderById: (orderId: string) => Order | undefined;
  reviews: Review[];
  addReview: (reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>) => void;
}

// Helper component for section titles
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="text-center mb-16 opacity-0" data-animation="animate-fade-in-up">
        <h2 className="text-4xl font-extrabold text-velora-dark">{children}</h2>
    </div>
);

// Helper component for feature items
const Feature: React.FC<{ icon: React.ReactElement; title: string; children: React.ReactNode, animation: string, delay: string }> = ({ icon, title, children, animation, delay }) => (
    <div className="flex opacity-0" data-animation={animation} style={{ animationDelay: delay }}>
        <div className="flex-shrink-0 mr-4">{icon}</div>
        <div>
            <h3 className="text-xl font-bold text-velora-dark">{title}</h3>
            <p className="mt-1 text-gray-600">{children}</p>
        </div>
    </div>
);

// Checkmark Icon
const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 text-velora-green bg-green-100 rounded-full p-1 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);


// Installation Icons
// FIX: Updated icon components to accept a className prop to resolve a TypeScript error with React.cloneElement.
// The hardcoded width and height attributes were removed to allow styling via the passed className.
const MarkIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 4 13V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="m15.5 13.5-3-3L15 8l4 4-2.5 2.5"/><path d="m13.5 15.5 3 3L19 16l-4-4 2.5-2.5"/></svg>;
const DrillIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 9.5 3 21"/><path d="m11 13 2.5 2.5"/><path d="M15 6s-2.1-2-4.5-2-5.5 2.5-5.5 5 2.5 5.5 5 5.5 2-4.5 2-4.5"/><path d="m21 3-9.5 9.5"/></svg>;
const ScrewIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-8.5"/><path d="M12 22a2.5 2.5 0 0 1-2.5-2.5c0-4.5 2.5-8.5 2.5-8.5s2.5 4 2.5 8.5A2.5 2.5 0 0 1 12 22Z"/><path d="M15.5 5.5 12 2 8.5 5.5"/><path d="M12 2v8.5"/></svg>;
const MountIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;

// Installation Step Component
// FIX: Corrected the type of the `icon` prop to `React.ReactElement<{ className?: string }>` to resolve the overload error on `React.cloneElement`.
const InstallationStep: React.FC<{ icon: React.ReactElement<{ className?: string }>; title: string; description: string; delay: string; }> = ({ icon, title, description, delay }) => (
    <div className="text-center p-6 bg-velora-white rounded-xl shadow-lg opacity-0" data-animation="animate-fade-in-up" style={{ animationDelay: delay }}>
        <div className="mx-auto mb-4 text-velora-green h-16 w-16 rounded-full flex items-center justify-center transition-transform duration-500 transform hover:scale-110 hover:rotate-6">
            {React.cloneElement(icon, { className: 'w-10 h-10' })}
        </div>
        <h3 className="text-xl font-bold text-velora-dark">{title}</h3>
        <p className="mt-2 text-gray-500">{description}</p>
    </div>
);

// Testimonial Card Component
const TestimonialCard: React.FC<{ quote: string; author: string; delay: string }> = ({ quote, author, delay }) => (
    <div className="bg-velora-white p-8 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 opacity-0" data-animation="animate-fade-in-up" style={{ animationDelay: delay }}>
        <p className="text-gray-600 italic">"{quote}"</p>
        <p className="text-right font-bold text-velora-green mt-4">- {author}</p>
    </div>
);

const ClientPage: React.FC<ClientPageProps> = ({ addOrder, getOrderById, reviews, addReview }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);

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


  useEffect(() => {
    if (!submittedOrderId) return;

    const interval = setInterval(() => {
      const order = getOrderById(submittedOrderId);
      if (order && order.status !== orderStatus) {
        setOrderStatus(order.status);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [submittedOrderId, getOrderById, orderStatus]);

  const handleOrderSubmit = (orderData: Omit<Order, 'id' | 'status' | 'userEmail' | 'createdAt'>) => {
    const newId = addOrder(orderData);
    setSubmittedOrderId(newId);
    setOrderStatus(OrderStatus.PENDING);
    setIsModalOpen(false);
  };
  
  const getStatusMessage = () => {
    if (!orderStatus) return null;
    
    let bgColor, title, message;
    switch(orderStatus) {
      case OrderStatus.PENDING:
        bgColor = 'bg-yellow-100 border-yellow-500 text-yellow-800';
        title = 'Order Received!';
        message = 'Your order is pending confirmation. We will review it shortly.';
        break;
      case OrderStatus.CONFIRMED:
        bgColor = 'bg-green-100 border-green-500 text-green-800';
        title = 'Order Confirmed!';
        message = 'Great news! Your order has been confirmed. We will call you soon to arrange delivery.';
        break;
      case OrderStatus.REJECTED:
        bgColor = 'bg-red-100 border-red-500 text-red-800';
        title = 'Order Update';
        message = 'Unfortunately, we were unable to process your order at this time. Please contact support for more information.';
        break;
    }

    return (
      <div className={`border-l-4 p-4 mt-8 rounded-md shadow-md ${bgColor}`} role="alert">
        <p className="font-bold">{title}</p>
        <p>{message}</p>
      </div>
    );
  };
  
  const approvedReviews = reviews.filter(review => review.status === ReviewStatus.APPROVED);

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[70vh] md:h-[90vh] bg-cover bg-center text-white flex items-center" style={{ backgroundImage: "url('https://i.imgur.com/8xLqT98.jpeg')" }}>
        <div className="absolute inset-0 bg-velora-dark bg-opacity-60"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Effortless Drying, Reimagined.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Discover VELORA™, the sleek, space-saving retractable clothesline. Strong, durable, and disappears when you don't need it.
          </p>
          <div className="mt-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-velora-green hover:bg-velora-dark text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg animate-pulsate"
            >
              Order Your VELORA™ Today
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {submittedOrderId && getStatusMessage()}
      </div>

       {/* Features Section */}
      <div className="py-16 md:py-24 bg-velora-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle>The Ultimate Space-Saving Solution</SectionTitle>
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="opacity-0" data-animation="animate-slide-in-left">
                    <img src="https://i.imgur.com/bW3YqjB.jpeg" alt="VELORA Retractable Clothesline in use" className="rounded-2xl shadow-2xl w-full" />
                </div>
                <div className="space-y-8">
                   <Feature icon={<CheckIcon/>} title="Generous Drying Space" animation="animate-slide-in-right" delay="0s">Our models offer up to 20 meters of line length, perfect for families of any size.</Feature>
                   <Feature icon={<CheckIcon/>} title="Robust & Durable" animation="animate-slide-in-right" delay="0.2s">Built with a steel housing and high-tensile polyester lines to support heavy loads up to 25 kg.</Feature>
                   <Feature icon={<CheckIcon/>} title="Sleek, Modern Design" animation="animate-slide-in-right" delay="0.4s">Available in multiple finishes to complement any home decor, from classic white to woodland gray.</Feature>
                   <Feature icon={<CheckIcon/>} title="All-Weather Reliability" animation="animate-slide-in-right" delay="0.6s">Designed for both indoor and outdoor use, with weather-resistant materials for lasting durability.</Feature>
                </div>
            </div>
        </div>
      </div>
      
      {/* Why Choose Section */}
      <div className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <SectionTitle>Upgrade Your Space</SectionTitle>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8 opacity-0" data-animation="animate-slide-in-left">
                     <Feature icon={<CheckIcon/>} title="Reclaim Your Space" animation="animate-slide-in-left" delay="0.2s">Eliminate bulky racks. VELORA™ retracts completely, giving you back your balcony, garden, or laundry room.</Feature>
                     <Feature icon={<CheckIcon/>} title="Enhance Home Aesthetics" animation="animate-slide-in-left" delay="0.4s">Our minimalist design blends seamlessly with your home, unlike traditional, unsightly clotheslines.</Feature>
                     <Feature icon={<CheckIcon/>} title="Eco-Friendly Choice" animation="animate-slide-in-left" delay="0.6s">Air-dry your clothes to save energy, reduce your carbon footprint, and be gentler on your fabrics.</Feature>
                  </div>
                   <div className="opacity-0" data-animation="animate-slide-in-right">
                    <img src="https://i.imgur.com/gB8sZzJ.jpeg" alt="VELORA retracted and blending in" className="rounded-2xl shadow-2xl w-full" />
                </div>
              </div>
          </div>
      </div>


       {/* Installation Section */}
       <div className="py-16 md:py-24 bg-velora-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <SectionTitle>Installs in Minutes</SectionTitle>
               <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto text-center -mt-12 mb-16 opacity-0" data-animation="animate-fade-in-up" style={{animationDelay: '0.2s'}}>With our simple instructions and included hardware, your VELORA™ will be ready in four easy steps.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                 <InstallationStep icon={<MarkIcon/>} title="Mark Locations" description="Use the provided drilling template to mark exactly where the holes need to go." delay="0.2s" />
                 <InstallationStep icon={<DrillIcon/>} title="Drill & Insert" description="Drill the holes and securely insert the heavy-duty wall plugs." delay="0.4s" />
                 <InstallationStep icon={<ScrewIcon/>} title="Partial Screw-In" description="Partially tighten the top screws, leaving enough space to hang the rack." delay="0.6s" />
                 <InstallationStep icon={<MountIcon/>} title="Mount & Tighten" description="Mount the rack onto the top screws and tighten all screws securely for a safe hold." delay="0.8s" />
              </div>
          </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <SectionTitle>What Our Customers Say</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <TestimonialCard quote="Absolutely love my VELORA! It's so discreet and holds a surprising amount of laundry. My balcony has never looked better." author="Sarah J." delay="0.2s" />
                  <TestimonialCard quote="The installation was a breeze. The quality is top-notch, far better than any other clothesline I've used. Highly recommend." author="Mike R." delay="0.4s" />
                  <TestimonialCard quote="A game-changer for our small apartment. We get our laundry dried without sacrificing our living space. Brilliant design!" author="Emily & Tom" delay="0.6s" />
              </div>
          </div>
      </div>

      {/* Reviews Section */}
      <div className="py-16 md:py-24 bg-velora-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>Share Your Experience</SectionTitle>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="opacity-0" data-animation="animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-2xl font-bold text-velora-dark mb-6">Leave a Review</h3>
                <ReviewForm onSubmit={addReview} />
            </div>
            <div className="opacity-0" data-animation="animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
                <h3 className="text-2xl font-bold text-velora-dark mb-6">Recent Reviews</h3>
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4">
                    {approvedReviews.length > 0 ? (
                        approvedReviews.map((review) => <ReviewCard key={review.id} review={review} />)
                    ) : (
                        <p className="text-gray-500">No approved reviews yet. Be the first to share your thoughts!</p>
                    )}
                </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tech Specs Section */}
      <div className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <SectionTitle>Technical Specifications</SectionTitle>
              <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden opacity-0" data-animation="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="divide-y divide-gray-200">
                    <div className="grid grid-cols-3 gap-4 px-6 py-4"><span className="font-semibold text-gray-500">Feature</span><span className="col-span-2 font-medium text-velora-dark">Specification</span></div>
                    <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50"><span className="font-semibold text-gray-500">Dimensions (Retracted)</span><span className="col-span-2 text-velora-text">29.4 x 6.3 x 6 cm</span></div>
                    <div className="grid grid-cols-3 gap-4 px-6 py-4"><span className="font-semibold text-gray-500">Total Line Length</span><span className="col-span-2 text-velora-text">20 Meters (4m x 5 lines)</span></div>
                    <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50"><span className="font-semibold text-gray-500">Maximum Load Capacity</span><span className="col-span-2 text-velora-text">25 kg</span></div>
                    <div className="grid grid-cols-3 gap-4 px-6 py-4"><span className="font-semibold text-gray-500">Casing Material</span><span className="col-span-2 text-velora-text">High-Impact Steel Alloy</span></div>
                     <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50"><span className="font-semibold text-gray-500">Line Material</span><span className="col-span-2 text-velora-text">High-Tensile Polyester</span></div>
                    <div className="grid grid-cols-3 gap-4 px-6 py-4"><span className="font-semibold text-gray-500">Available Colors</span><span className="col-span-2 text-velora-text">White, Classic Cream, Woodland Gray</span></div>
                </div>
              </div>
          </div>
      </div>


       {/* Gallery Section */}
      <div className="py-16 md:py-24 bg-velora-dark text-velora-light">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
               <SectionTitle>See It in Action</SectionTitle>
               <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto text-center -mt-12 mb-16 opacity-0" data-animation="animate-fade-in-up" style={{animationDelay: '0.2s'}}>From balconies to laundry rooms, see how VELORA™ seamlessly integrates into any home.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="opacity-0" data-animation="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    <img src="https://i.imgur.com/8xLqT98.jpeg" alt="Clothes drying on VELORA" className="rounded-lg shadow-lg aspect-square object-cover" />
                  </div>
                  <div className="opacity-0" data-animation="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                    <img src="https://i.imgur.com/bW3YqjB.jpeg" alt="VELORA fully extended" className="rounded-lg shadow-lg aspect-square object-cover" />
                  </div>
                  <div className="opacity-0" data-animation="animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                     <img src="https://i.imgur.com/gB8sZzJ.jpeg" alt="VELORA retracted" className="rounded-lg shadow-lg aspect-square object-cover" />
                  </div>
              </div>
          </div>
      </div>


      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleOrderSubmit}
      />
    </>
  );
};

export default ClientPage;