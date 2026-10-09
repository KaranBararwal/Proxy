import React from 'react';
import {
  FaSignInAlt,
  FaClipboardList,
  FaPaperPlane,
  FaCheckCircle,
  FaHistory,
} from 'react-icons/fa';

const steps = [
  {
    number: '01',
    icon: FaSignInAlt,
    title: 'Sign In',
    description:
      'Sign in to Proxy using your email and password or continue with Google.',
  },
  {
    number: '02',
    icon: FaClipboardList,
    title: 'Choose the Details',
    description:
      'Select the course, semester, subject, date, and the student who will receive the proxy.',
  },
  {
    number: '03',
    icon: FaPaperPlane,
    title: 'Send the Proxy',
    description:
      'Submit the proxy request. The selected student will receive the request in their incoming proxies.',
  },
  {
    number: '04',
    icon: FaCheckCircle,
    title: 'Accept or Reject',
    description:
      'The receiving student can review the request and either accept or reject it.',
  },
  {
    number: '05',
    icon: FaHistory,
    title: 'Track Your Proxies',
    description:
      'View proxies you have marked and proxies that have been marked for you from your dashboard.',
  },
];

const HowItWorksPage = () => {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 px-6 py-28">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How Proxy Works
          </h1>

          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
            Managing attendance proxies in a few simple steps.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">

          {/* Center Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-700 transform -translate-x-1/2" />

          <div className="space-y-10 md:space-y-16">

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={step.number}
                  className="relative grid grid-cols-1 md:grid-cols-2 items-center"
                >

                  {/* LEFT SIDE */}
                  <div
                    className={`${
                      isLeft
                        ? 'md:pr-16'
                        : 'md:col-start-2 md:pl-16'
                    }`}
                  >
                    {isLeft && (
                      <StepCard
                        step={step}
                        Icon={Icon}
                        align="right"
                      />
                    )}
                  </div>

                  {/* CENTER NUMBER */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-600 items-center justify-center z-10 shadow-sm">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                      {step.number}
                    </span>
                  </div>

                  {/* RIGHT SIDE */}
                  <div
                    className={`${
                      !isLeft
                        ? 'md:col-start-2 md:pl-16'
                        : 'md:col-start-2'
                    }`}
                  >
                    {!isLeft && (
                      <StepCard
                        step={step}
                        Icon={Icon}
                        align="left"
                      />
                    )}
                  </div>

                </div>
              );
            })}

          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 md:p-10 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            That&apos;s it.
          </h2>

          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            Proxy keeps your proxy requests organized so you can spend less
            time coordinating attendance and more time focusing on what
            matters.
          </p>
        </div>

      </div>
    </main>
  );
};


/* Step Card */
const StepCard = ({ step, Icon, align }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-7 ${
        align === 'right' ? 'md:text-right' : 'md:text-left'
      }`}
    >
      <div
        className={`flex items-center gap-4 mb-5 ${
          align === 'right' ? 'md:justify-end' : 'md:justify-start'
        }`}
      >
        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <Icon className="text-xl text-gray-700 dark:text-gray-200" />
        </div>

        <span className="text-sm font-semibold tracking-wide text-gray-400 dark:text-gray-500">
          STEP {step.number}
        </span>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {step.title}
      </h2>

      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {step.description}
      </p>
    </div>
  );
};

export default HowItWorksPage;
