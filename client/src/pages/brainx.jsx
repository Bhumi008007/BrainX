import React, { useState, useEffect } from 'react';
import { dummyPlans } from '../assets/assets';
import Loading from './Loading';

const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    setPlans(dummyPlans);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center justify-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Credit Plans</h2>
      
      <div className="flex flex-col md:flex-row gap-6 max-w-5xl w-full justify-center">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`flex-1 p-6 rounded-2xl border transition-all flex flex-col justify-between ${
              plan.id === 'pro'
                ? 'bg-purple-50 dark:bg-purple-900/30 border-primary shadow-lg scale-105'
                : 'bg-white dark:bg-transparent border-gray-200 dark:border-[#383545]'
            }`}
          >
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{plan.name}</h3>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
                ${plan.price}
                <span className="text-sm font-normal text-gray-500"> / {plan.credits} credits</span>
              </p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <span className="text-primary font-bold">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <button className="w-full py-2.5 bg-primary hover:opacity-90 text-white font-medium rounded-xl text-sm transition-all cursor-pointer">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;