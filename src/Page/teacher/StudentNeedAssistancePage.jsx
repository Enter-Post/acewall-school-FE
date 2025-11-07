import { useParams } from "react-router-dom";
import StudentAssistanceCard from "@/CustomComponent/teacher/StudentAssistanceCard";

export default function StudentWhoNeedAssistance() {
  const { courseId } = useParams();
  return <StudentAssistanceCard courseId={courseId} title="Student who need assistance" />;
}
