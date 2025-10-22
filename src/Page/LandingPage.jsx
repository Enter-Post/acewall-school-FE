import { Link } from "react-router-dom";
import { Dot } from "lucide-react";

import { GlobalContext } from "@/Context/GlobalProvider";
import { LandingPageCard } from "@/CustomComponent/Card";
import { useContext } from "react";


const cardData = [
  {
    name: "Academic Tutoring",
    description:
      "Acewall Scholars offers one-on-one tutoring services to support students in their academic journey. Our experienced tutors provide personalized instruction and guidance to help students succeed.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/AdobeStock_357701907-1920w.jpeg",
    buttonUrl: "https://www.acewallscholars.org/academic-tutoring ",
  },
  {
    name: "Mentoring and Mental Health Support - a 360° approach",
    description:
      "Acewall Scholars offers a 360° approach to mentoring and mental health support. Our experienced mentors and mental health professionals provide personalized support and guidance to help students succeed.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/AdobeStock_355386233-834697fd-1920w.jpeg",
    buttonUrl: "https://www.acewallscholars.org/mentoring",
  },
  {
    name: "Parent Aide",
    description:
      "Acewall Scholars’ parent aide program offers a holistic approach to developing effective parenting skills. This program provides education on supporting children through their emotional, physical, mental, and spiritual development.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/shutterstock_2329065089-1920w.jpg",
    buttonUrl: "https://www.acewallscholars.org/parent-aide",
  },
  {
    name: "Test Prep",
    description:
      "Acewall Scholars offers test preparation services to support students in their academic journey. Our experienced tutors provide personalized instruction and guidance to help students succeed.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/row-students-doing-exam-1920w.jpg",
    buttonUrl: "https://www.acewallscholars.org/test-prep",
  },
  {
    name: "Internship Support/Placement",
    description:
      "Acewall Scholars will assist students with finding summer programs, internships, and/or apprenticeships, as well as volunteering experience in fields of interest.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/internship+support-placement-1920w.jpg",
    buttonUrl: "https://www.acewallscholars.org/internship-support/placement",
  },
  {
    name: "College Counseling",
    description:
      "Our college counseling service assists and empowers both students and parents by providing the necessary guidance and information to assist in navigating the college process.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/college+counseling-1920w.jpg",
    buttonUrl: "https://www.acewallscholars.org/college-counseling",
  },
];

const LandingPage = () => {
  // const navigate = useNavigate();
  const { user, } = useContext(GlobalContext);

 



  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="h-[50vh] sm:h-[70vh] md:h-[60vh] lg:h-[70vh] bg-cover bg-start bg-no-repeat bg-[url('assets/hero.webp')]">
        <div className="h-full w-full bg-black/50 flex items-start justify-start">
          <div className="flex flex-col mt-10 justify-center items-center px-2 md:px-10 md:mt-16 text-center">
            <h1 className="text-white text-lg sm:text-3xl font-semibold tracking-wide">
              Where the vision is realized. Where the dream is achieved.
            </h1>
            <div className="flex items-center justify-center flex-wrap sm:flex-row flex-col gap-x-2 text-white ml-2">
              <div className="flex items-center text-md whitespace-nowrap">
                <p>Imagine</p>
                <Dot size={28} strokeWidth={3} className="-mx-1.5" />
                <p>Believe</p>
                <Dot size={28} strokeWidth={3} className="-mx-1.5" />
                <p>Create</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Buttons Section */}
      {!user && (
        <div className="bg-black flex flex-col lg:flex-row flex-wrap items-center justify-center gap-6 p-10 w-full">
          <div className="w-full lg:w-auto text-center lg:text-left">
            <h1 className="text-white text-xl font-semibold whitespace-nowrap">
              Choose Your Path
            </h1>
          </div>

          {/* Login as Teacher Button */}
          <div className="w-full lg:w-[200px]">
            <Link to="/TeacherLogin">
              <button
                type="button"
                className="text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-sm px-4 py-2 w-full"
              >
                Login as Teacher
              </button>
            </Link>
          </div>

          {/* Login as Student Button */}
          <div className="w-full lg:w-[200px]">
            <Link to="/login">
              <button
                type="button"
                className="text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-sm px-4 py-2 w-full"
              >
                Login as Student
              </button>
            </Link>
          </div>

          {/* Getting Started Button */}
          <div className="w-full lg:w-[200px]">
            <Link to="/contact">
              <button
                type="button"
                className="text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-sm px-4 py-2 w-full"
              >
                Get Started Today
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Services Cards */}
      <section className="flex justify-center mt-10">
        <div
          id="additionalServices"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-3 w-[95%] md:w-[80%]"
        >
          {cardData.map((card, index) => (
            <div key={index} className="h-full">
              <LandingPageCard
                name={card.name}
                description={card.description}
                imageUrl={card.imageUrl}
                buttonUrl={card.buttonUrl}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
