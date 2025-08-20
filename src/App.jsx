import { Route, Routes } from "react-router-dom";
import Layout from "./Page/StudentPortal/Layout";
import Deshboard from "./Page/StudentPortal/Deshboard";
import Mycourses from "./Page/StudentPortal/Courses/MyCourses";
import Assignment from "./Page/StudentPortal/Assessment/Assignment";
import Login from "./Page/Login";
import Announcement from "./Page/StudentPortal/Announcement";
import Account from "./Page/StudentPortal/Account";
import Gradebook from "./Page/StudentPortal/Gradebook";
import SignupPage from "./Page/signup";
import AllCourses from "./Page/AllCourses";
import AllCoursesDetail from "./Page/allCourseDetail";
import MainLayout from "./Page/MainLayout";
import Support from "./Page/Support";
import LandingPage from "./Page/LandingPage";
import Messages from "./Page/StudentPortal/Messages";

import GeneralCourses from "./Page/GeneralCourses";
import GeneralSupport from "./Page/GeneralSupport";
import GeneralCoursesDetail from "./Page/GeneralCourseDetail";
import TeacherDashboard from "./Page/teacher/Dashboard";
import TeacherLayout from "./Page/teacher/Layout";
import TeacherAccount from "./Page/teacher/Account";
import TeacherrAssessment from "./Page/teacher/TeacherAssignment";
import TeacherAnnoucement from "./Page/teacher/TeacherAnnoucement";
import AllStudent from "./Page/teacher/AllStudent";
import StudentProfile from "./Page/teacher/studentProfile";
import TeacherCourses from "./Page/teacher/Courses/TeacherCourses";
import TeacherCourseDetails from "./Page/teacher/Courses/CourseDetail";
import CreateCourses from "./Page/teacher/Courses/CreateCourses";
import CoursesChapter from "./Page/teacher/Courses/CourseChapters";
import TeacherGradebook from "./Page/teacher/Courses/Gradebook";
import TeacherLogin from "./Page/TeacherLogin";
import CreateAssessmentPage from "./Page/teacher/CreateAssessment";
import AdditionalServices from "./Page/AdditionalServices";
import About from "./Page/About";
import ScrollToTop from "./lib/scrolltop";
import ContactUs from "./Page/ContactUs";
import { PrivateRoute, PublicRoute } from "./lib/PrivateRoutes";

import CoursesBasis from "./Page/teacher/Courses/CoursesBasics";
import { useEffect, useContext } from "react";
import { GlobalContext } from "./Context/GlobalProvider";
import LoadingLoader from "./CustomComponent/LoadingLoader";
import MainDetailPage from "./Page/StudentPortal/Courses/MainDetailPage";
import ChapterDetail from "./Page/StudentPortal/Courses/MyCourseDetail";
import NotFoundPage from "./Page/NotFoundPage";
import { io } from "socket.io-client";
import ChatWindow from "./CustomComponent/MessagesCmp.jsx/chat-window";
import AssessmentSubmissionPage from "./Page/StudentPortal/Assessment/AssessmentSubmissionPage";
import SubmittedAssessment from "./Page/teacher/Assessment/submittedAssessment";
import AssessmentReview from "./Page/teacher/Assessment/submittedAssessment";
import AllSubmission from "./Page/teacher/Assessment/allSubmission";
import VerifyOTP from "./Page/VerifyOTP";
import ForgetPassword from "./Page/forgetPassword";
import VerifyForgetPasswordOTP from "./Page/VerifyForgetPasswordOTP";
import NewPassword from "./Page/NewPassword";
import EditGeneralInfo from "./Page/Account/EditGeneralInfo";
import { EditCredentials } from "./Page/Account/EditCredentials";
import StudentCourseGrades from "./Page/teacher/studentCourseGrades";
import TeacherDiscussion from "./Page/teacher/Discussion/TeacherDiscussisons";
import TeacherDiscussionChat from "./Page/teacher/Discussion/TeacherDiscussionChat";
import StudentDiscussion from "./Page/StudentPortal/Student Discussion/StudentDiscussisons";
import StudentDiscussionChat from "./Page/StudentPortal/Student Discussion/StudentDiscussionChat";
import StdPreview from "./Page/teacher/Courses/StdPreview";
import SemesterDetail from "./Page/teacher/Courses/SemesterDetail";
import QuarterDetail from "./Page/teacher/Courses/QuarterDetail";
import StudentSemesterDetail from "./Page/StudentPortal/Courses/StudentSemesterDetail";
import AllChapter from "./Page/StudentPortal/Courses/AllChapter";
import CourseGradebookPage from "./Page/teacher/CourseGradebookPage";
import ViewCoursePostsPage from "./Page/teacher/ViewCoursePosts";
import StdPagesView from "./Page/StudentPortal/StdPagesView";
import EditCourse from "./Page/teacher/Courses/EditCoursesBasics";
import TeacherChapterDetail from "./Page/teacher/Courses/quarter/chapter-detail";
import { AssessmentPage } from "./Page/teacher/Courses/quarter/assessment-dialog";
import StdPreview2 from "./Page/teacher/Courses/StdPreview2";
import StudentSemesterDetailStdPre from "./Page/teacher/Courses/StudentSemesterDetailStdPre";
import AllChapterStdPre from "./Page/teacher/Courses/AllChapterStdPre";
import ChapterDetailStdPre from "./Page/teacher/Courses/MyCourseDetailStdPre";

function App() {
  const { checkAuth, user, Authloading, socket, setSocket, setOnlineUser } =
    useContext(GlobalContext);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) connectsocket();
    return () => {
      if (socket) socket.disconnect();
    };
  }, [user]);

  const connectsocket = () => {
    const newSocket = io(
      // "https://acewall-backend-school-instance-production.up.railway.app",
      import.meta.env.VITE_SOCKET_URL,
      {
        query: { userId: user?._id || "" },
      }
    );

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (usersIds) => {
      setOnlineUser(usersIds);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  };

  if (Authloading) {
    return <LoadingLoader />;
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public-only accessible pages */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} /> {/* This makes / public */}
          <Route path="about" element={<About />} />
          <Route path="AdditionalServices" element={<AdditionalServices />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Unauthenticated-only (login/signup) */}
        <Route
          element={
            <PublicRoute
              user={user}
              redirectTo={
                user?.role === "teacher" ? "/teacher" : "/student/mycourses"
              }
            />
          }
        >
          <Route path="/login" element={<Login />}></Route>
          <Route path="/TeacherLogin" element={<TeacherLogin />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route path="/verifyOTP/:email" element={<VerifyOTP />} />

          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="/Courses">
              <Route index element={<GeneralCourses />}></Route>
              <Route
                path="detail/:id"
                element={<GeneralCoursesDetail />}
              ></Route>
              <Route path="culinaryArts" element={<AllCoursesDetail />} />
            </Route>
            <Route path="/forgetPassword">
              <Route index element={<ForgetPassword />} />
              <Route
                path="verifyOTP/:email"
                element={<VerifyForgetPasswordOTP />}
              />
              <Route path="resetPassword/:email" element={<NewPassword />} />
            </Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/Support" element={<GeneralSupport />}></Route>
            <Route path="/contactUs" element={<ContactUs />}></Route>
            <Route path="/*" element={<NotFoundPage />} />
            <Route
              path="/AdditionalServices"
              element={<AdditionalServices />}
            ></Route>
          </Route>
        </Route>

        {/* Student Routes */}
        <Route
          element={
            <PrivateRoute
              user={user}
              allowedRole="student"
              loading={Authloading}
            />
          }
        >
          <Route path="/student" element={<Layout />}>
            <Route index element={<Deshboard />} />
            <Route path="mycourses">
              <Route index element={<Mycourses />} />
              <Route
                path=":courseId/semester/:semesterId"
                element={<StudentSemesterDetail />}
              />

              <Route path=":courseId/quarter/:quarterId">
                <Route index element={<AllChapter />} />
                <Route path="chapter/:chapterId" element={<ChapterDetail />} />
              </Route>
              <Route path=":id" element={<MainDetailPage />} />
            </Route>

            <Route path="assessment">
              <Route index element={<Assignment />} />
              <Route
                path="submission/:id"
                element={<AssessmentSubmissionPage />}
              />
            </Route>
            <Route path="gradebook" element={<Gradebook />} />
            <Route path="stdPages" element={<StdPagesView />} />
            <Route path="announcements" element={<Announcement />} />
            <Route path="account">
              <Route index element={<Account />} />
              <Route path="editGeneralInfo" element={<EditGeneralInfo />} />
              <Route path="editCredentials" element={<EditCredentials />} />
            </Route>
            <Route path="support" element={<Support />} />
            <Route path="ContactUs" element={<ContactUs />} />
            <Route path="courses/:subcategoryId" element={<AllCourses />} />
            <Route path="course/detail/:id" element={<AllCoursesDetail />} />
            <Route path="messages">
              <Route index element={<Messages />} />
              <Route path=":id" element={<ChatWindow />} />
            </Route>
            <Route path="discussions">
              <Route index element={<StudentDiscussion />} />
              <Route path=":id" element={<StudentDiscussionChat />} />
            </Route>
          </Route>
        </Route>

        {/* Teacher Routes */}
        <Route
          element={
            <PrivateRoute
              user={user}
              allowedRole="teacher"
              loading={Authloading}
            />
          }
        >
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="account">
              <Route index element={<Account />} />
              <Route path="editGeneralInfo" element={<EditGeneralInfo />} />
              <Route path="editCredentials" element={<EditCredentials />} />
            </Route>
            <Route path="assessments">
              <Route index element={<TeacherrAssessment />} />
              <Route path="allsubmissions/:id" element={<AllSubmission />} />
              <Route path=":id" element={<AssessmentReview />} />
              <Route
                path="create/:type/:id/:courseId/:startDate/:endDate"
                element={<CreateAssessmentPage />}
              />
            </Route>
            <Route
              path="/teacher/courses/:courseId/posts/:type/:typeId"
              element={<ViewCoursePostsPage />}
            />
            <Route path="ContactUs" element={<ContactUs />} />
            <Route path="support" element={<Support />} />

            <Route path="Announcements" element={<TeacherAnnoucement />} />
            <Route path="allStudent" element={<AllStudent />} />
            <Route path="studentProfile/:id" element={<StudentProfile />} />
            <Route
              path="courseGrades/:studentId/:courseId"
              element={<StudentCourseGrades />}
            />

            <Route path="messages">
              <Route index element={<Messages />} />
              <Route path=":id" element={<ChatWindow />} />
            </Route>
            <Route
              path="gradebook/:courseId"
              element={<CourseGradebookPage />}
            />

            <Route path="discussions/:semesterId/:quarterId">
              <Route index element={<TeacherDiscussion />} />
              <Route path=":id" element={<TeacherDiscussionChat />} />
            </Route>

            <Route path="courses">
              <Route index element={<TeacherCourses />} />
              <Route
                path="courseDetail/:id"
                element={<TeacherCourseDetails />}

              />
              <Route path="edit/:courseId" element={<EditCourse />} />
              <Route
                path=":courseId/semester/:id"
                element={<SemesterDetail />}
              />
              <Route path=":courseId/quarter/:id" element={<QuarterDetail />} />
              <Route
                path="quarter/:quarterId/chapter/:chapterId"
                element={<TeacherChapterDetail />}
              />
              <Route
                path=":courseId/semesterstdPre/:semesterId"
                element={<StudentSemesterDetailStdPre />}
              />
              <Route path=":courseId/quarterstdpre/:quarterId">
                <Route index element={<AllChapterStdPre />} />
                <Route path="chapterstdpre/:chapterId" element={<ChapterDetailStdPre />} />
              </Route>
              <Route
                path="assessment/:assessmentid"
                element={<AssessmentPage />}
              />
              <Route path="stdPreview/:id" element={<StdPreview />} />
              <Route path="stdPreview2/:id" element={<StdPreview2 />}

              />

              <Route path="createCourses">
                <Route index element={<CoursesBasis />} />
                <Route path="addChapter/:id" element={<CoursesChapter />} />
                {/* <Route path="gradebook" element={<TeacherGradebook />} /> */}
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
