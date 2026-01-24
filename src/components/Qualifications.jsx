import React, { useState, useEffect } from "react";
import ExperienceCard from "./qualifications/ExperienceCard";
import EducationCard from "./qualifications/EducationCard";
import CertificationCard from "./qualifications/CertificationCard";
import Skills from "./qualifications/Skills";
import api, { unwrapList } from "@/utils/api";

export default function Qualifications() {
  const [activeTab, setActiveTab] = useState("experience");
  const [data, setData] = useState({
    experience: [],
    education: [],
    certifications: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, eduRes, certRes] = await Promise.all([
          api.get("/experiences"),
          api.get("/education"),
          api.get("/certifications")
        ]);

        setData({
          experience: unwrapList(expRes, 'data'),
          education: unwrapList(eduRes, 'data'),
          certifications: unwrapList(certRes, 'data')
        });
      } catch (error) {
        console.error("Error fetching qualifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section
      id="qualifications"
      className="
        py-24
        bg-gray-50 text-gray-900
        dark:bg-gradient-to-b dark:from-[#0b1220] dark:to-[#0f172a]
        dark:text-white
      "
    >
      <div className="max-w-6xl mx-auto px-4">

        {/* Heading */}
        <h2 className="text-4xl font-bold text-center mb-12">
          Qualifications
        </h2>

        {/* Tabs */}
        <div className="flex justify-center gap-10 border-b border-gray-300 dark:border-gray-600 mb-14 overflow-x-auto">
          {[
            { key: "experience", label: "Experience" },
            { key: "education", label: "Education" },
            { key: "certifications", label: "Certifications" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 font-medium transition whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              {activeTab === "experience" &&
                (Array.isArray(data.experience) && data.experience.length > 0
                  ? (data.experience || []).map(item => (
                      <ExperienceCard key={item._id} experience={item} />
                    ))
                  : <p className="text-center text-gray-500 dark:text-gray-400">No experience listed yet.</p>
                )
              }

              {activeTab === "education" &&
                (Array.isArray(data.education) && data.education.length > 0
                  ? (data.education || []).map(item => (
                      <EducationCard key={item._id} education={item} />
                    ))
                  : <p className="text-center text-gray-500 dark:text-gray-400">No education listed yet.</p>
                )
              }

              {activeTab === "certifications" &&
                (Array.isArray(data.certifications) && data.certifications.length > 0
                  ? (data.certifications || []).map(item => (
                      <CertificationCard key={item._id} certification={item} />
                    ))
                  : <p className="text-center text-gray-500 dark:text-gray-400">No certifications listed yet.</p>
                )
              }
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="mt-24">
          <Skills />
        </div>

      </div>
    </section>
  );
}
