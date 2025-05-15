import React, { useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axios from "axios";

export default function Analyze() {
  const [analyzes, setAnalyzes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAnalyzes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/analyzes");
      setAnalyzes(res?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyzes();
  }, []);

  if (loading && !analyzes?.length) {
    return <div className="ml-8">Loading...</div>;
  }

  if (!loading && !analyzes?.length) {
    return <div className="ml-8">No data found</div>;
  }

  return (
    <>
      {analyzes?.length ? (
        <div className="space-y-4  mx-8 mt-6 mb-4">
          {analyzes?.map((summaryData) => {
            return (
              <div key={summaryData?.index} className="flex flex-col gap-3">
                <CardHeader>{summaryData?.index + ")"}</CardHeader>
                <Card className="border-l-4 border-l-emerald-500 bg-emerald-50">
                  <div className="p-6">
                    <h2 className="text-xl font-medium text-slate-700 mb-2">
                      Email summary
                    </h2>
                    <Separator className="bg-emerald-200 mb-4" />
                    <div className="pl-4 border-l-2 border-emerald-500">
                      <p className="text-slate-700">
                        {summaryData?.emailSummary}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Issues Section */}
                <Card className="border-l-4 border-l-cyan-500 bg-cyan-50">
                  <div className="p-6">
                    <h2 className="text-xl font-medium text-slate-700 mb-2">
                      Issues:
                    </h2>
                    <Separator className="bg-cyan-200 mb-4" />
                    <div className="pl-4 border-l-2 border-cyan-500">
                      <p className="text-slate-700">
                        {summaryData?.customerIssue}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Key Insights Section */}
                <Card className="border-l-4 border-l-amber-500 bg-amber-50">
                  <div className="p-6">
                    <h2 className="text-xl font-medium text-slate-700 mb-2">
                      Key Insights:
                    </h2>
                    <Separator className="bg-amber-200 mb-4" />
                    <ul className="space-y-3">
                      {summaryData?.customerInsights.map((insight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mt-2 mr-3"></span>
                          <span className="text-slate-700">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                {/* Reason for Sentiment Section */}
                <Card className="border-l-4 border-l-purple-500 bg-purple-50">
                  <div className="p-6">
                    <h2 className="text-xl font-medium text-slate-700 mb-2">
                      Sentiment:
                    </h2>
                    <Separator className="bg-purple-200 mb-4" />
                    <div className="pl-4 border-l-2 border-purple-500">
                      <p className="text-slate-700">{summaryData?.sentiment}</p>
                    </div>
                  </div>
                </Card>

                {/* Reason for Performance Section */}
                <Card className="border-l-4 border-l-purple-500 bg-purple-50">
                  <div className="p-6">
                    <h2 className="text-xl font-medium text-slate-700 mb-2">
                      Reason for Sentiment:
                    </h2>
                    <Separator className="bg-purple-200 mb-4" />
                    <div className="pl-4 border-l-2 border-purple-500">
                      <p className="text-slate-700">
                        {summaryData?.reasonForSentiment}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="ml-8">No data found</div>
      )}
    </>
  );
}
