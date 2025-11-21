import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, GraduationCap, BookOpen, Loader } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Link } from "react-router-dom";
import BackButton from "@/CustomComponent/BackButton";

export default function GradingScales() {
  const [gpaScale, setGpaScale] = useState([]);
  const [sblScale, setSblScale] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGpaScale = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("gpa/get");
        setGpaScale(res.data.grade || []);
      } catch (err) {
        console.error("Error fetching GPA scale:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGpaScale();
  }, []);

  useEffect(() => {
    const fetchSBLScale = async () => {
      setLoading(true);
      try {
        // UPDATED ENDPOINT
        const res = await axiosInstance.get("standardGrading/get");

        // UPDATED DATA ACCESS
        setSblScale(res.data.scale || []);
      } catch (err) {
        console.error("Error fetching SBL scale:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSBLScale();
  }, []);

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      await axiosInstance
        .get("gradebook/getGradingScale")
        .then((res) => {
          console.log(res);
          setGrades(res.data.scale);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    };
    fetchGrades();
  }, []);

  return (
    <>
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <BackButton className="mb-10" />

        <Card>
          <CardHeader>
            <section className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg font-bold">GPA Scale</CardTitle>
              </div>
            </section>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <Loader2 className="animate-spin w-6 h-6 mb-2" />
                <p>Loading GPA scale...</p>
              </div>
            ) : gpaScale.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 font-medium text-sm text-gray-500 mb-2 border-b pb-1">
                  <div>GPA</div>
                  <div>Percentage Range</div>
                  <div>Bar</div>
                </div>

                {gpaScale.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-2 items-center border-b border-gray-100 pb-2"
                  >
                    <Badge className="font-bold text-sm px-3 py-1 bg-green-500 text-white">
                      {item.gpa.toFixed(2)}
                    </Badge>
                    <div className="text-sm">
                      {item.minPercentage}% – {item.maxPercentage}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{
                          width: `${item.maxPercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <p>No GPA scale added yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <section className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg font-bold">
                  Standard-Based Learning Scale
                </CardTitle>
              </div>
            </section>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <Loader2 className="animate-spin w-6 h-6 mb-2" />
                <p>Loading SBL scale...</p>
              </div>
            ) : sblScale.length > 0 ? (
              <div className="space-y-3">
                {/* Header Row */}
                <div className="grid grid-cols-4 gap-2 font-medium text-sm text-gray-500 mb-2 border-b pb-1">
                  <div>Points</div>
                  <div>Percentage Range</div>
                  <div>Remarks</div>
                  <div>Bar</div>
                </div>

                {/* Data Rows */}
                {sblScale.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-2 items-center border-b border-gray-100 pb-2"
                  >
                    <Badge className="font-bold text-sm px-3 py-1 bg-green-500 text-white">
                      {item.points}
                    </Badge>

                    <div className="text-sm">
                      {item.minPercentage}% – {item.maxPercentage}%
                    </div>

                    <div className="text-sm text-gray-700">{item.remarks}</div>

                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{
                          width: `${item.maxPercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <p>No Standard-Based Learning scale found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="p-4 md:p-6 max-w-6xl mx-auto">

        <Card>
          <CardHeader>
            <section className="flex justify-between">
              <CardTitle>Grade Scale</CardTitle>
             
            </section>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex flex-col items-center justify-center h-40 text-center text-gray-500">
                <Loader className="animate-spin" />
              </div>
            )}
            {grades?.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 font-medium text-sm text-gray-500 mb-2">
                  <div>Grade</div>
                  <div>Range</div>
                  <div>Percentage</div>
                </div>
                {grades.map((grade, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-2 items-center border-b border-gray-100 pb-2"
                  >
                    <Badge
                      className={`font-bold text-sm px-3 py-1 bg-green-400`}
                    >
                      {grade.grade}
                    </Badge>
                    <div className="text-sm">
                      {grade.min}% - {grade.max}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: `${grade.max - grade.min + 1}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center text-gray-500">
                <p>No grades added yet please create</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
