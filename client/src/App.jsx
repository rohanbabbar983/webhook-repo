import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  FiUpload,
  FiGitPullRequest,
  FiGitMerge,
} from "react-icons/fi";
import { IoIosRefresh } from "react-icons/io";
import { WEBHOOK_HOST } from "./constants/baseURL";

dayjs.extend(utc);

function formatTimestamp(ts) {
  return dayjs(ts).utc().format("D MMMM YYYY - h:mm A [UTC]");
}

function EventItem({ event }) {
  const { author, action, from_branch, to_branch, timestamp } = event;
  const time = formatTimestamp(timestamp);

  let Icon = FiUpload;
  let authorColor = "text-gray-700";

  if (action === "PULL_REQUEST") {
    Icon = FiGitPullRequest;
    authorColor = "text-blue-600";
  } else if (action === "MERGE") {
    Icon = FiGitMerge;
    authorColor = "text-green-600";
  }

  return (
    <li className="bg-gray-50  p-4 rounded-md shadow-sm flex items-start gap-3">
      <div className="text-xl mt-1 text-black">
        <Icon />
      </div>
      <p className="text-gray-700">
        <span className={`font-medium ${authorColor}`}>"{author}"</span>{" "}
        {action === "PUSH" && (
          <>
            pushed to <span className="font-bold">"{to_branch}"</span> on {time}
          </>
        )}
        {action === "PULL_REQUEST" && (
          <>
            submitted a pull request from{" "}
            <span className="font-bold">"{from_branch}"</span> to{" "}
            <span className="font-bold">"{to_branch}"</span> on {time}
          </>
        )}
        {action === "MERGE" && (
          <>
            merged branch <span className="font-bold">"{from_branch}"</span> to{" "}
            <span className="font-bold">"{to_branch}"</span> on {time}
          </>
        )}
      </p>
    </li>
  );
}

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(15);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${WEBHOOK_HOST}/api/events`
      );
      setEvents(res.data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
      setSecondsLeft(15);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 15000);

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 15));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow-md py-6 px-6 flex border-b-2 border-gray-600 justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          GitHub Activity Feed
        </h1>
        <span className="text-sm flex items-center gap-1 text-gray-500">
          <IoIosRefresh size={20}/> {secondsLeft}s
        </span>
      </header>

      {/* Event Container */}
      <main className="flex-1 overflow-hidden">
        <div className=" h-full">
          <div className="bg-white  shadow-md h-full p-4 overflow-y-auto">
            {loading ? (
              <ul className="space-y-4">
                {Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <li
                      key={i}
                      className="animate-pulse bg-gray-200 h-20 rounded-md w-full"
                    ></li>
                  ))}
              </ul>
            ) : events.length === 0 ? (
              <p className="min-h-screen flex items-center justify-center text-xl md:text-2xl text-gray-500">No events yet...</p>
            ) : (
              <ul className="space-y-4 pr-2 max-h-full">
                {events.map((event, idx) => (
                  <EventItem key={idx} event={event} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
