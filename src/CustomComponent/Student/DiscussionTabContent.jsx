import React from "react";
import { Link } from "react-router-dom";
import acewallshort from "../../assets/acewallshort.png";
import { DiscussionCard } from "../Card";
const DiscussionTabContent = ({ discussions, loading }) => {
  return (
    <div>
      <div className="w-full flex justify-center">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : discussions.length === 0 ? (
          <p className="text-center">No Discussions</p>
        ) : null}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
        {!loading &&
          discussions.map((item) => (
            <DiscussionCard key={item._id} discussion={item} link={`/student/discussions/${item._id}`} />
          ))}
      </div>
    </div>
  );
};

export default DiscussionTabContent;
