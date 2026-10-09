import React from 'react';

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 px-6 py-28">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            About Proxy
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            Proxy is an attendance proxy management platform designed to make
            managing proxy requests simple and organized for students.
          </p>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-10">
            Instead of coordinating proxy requests through messages or keeping
            track of them manually, Proxy provides a single place where
            students can create, receive, accept, reject, and track their
            proxy requests.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            What can you do with Proxy?
          </h2>

          <div className="grid gap-4 md:grid-cols-2 mb-10">
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Create Proxy Requests
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Select a subject, date, and student to create a proxy request.
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Accept or Reject
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Review incoming requests and decide whether to accept or
                reject them.
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Track Your Proxies
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Keep track of proxies you have marked and proxies marked for
                you.
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Manage Subjects
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Subjects can be organized by course and semester for easier
                proxy management.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Built With
          </h2>

          <div className="flex flex-wrap gap-3">
            {[
              'Next.js',
              'React',
              'MongoDB',
              'Mongoose',
              'NextAuth',
              'Tailwind CSS',
            ].map((technology) => (
              <span
                key={technology}
                className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm"
              >
                {technology}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutPage;
