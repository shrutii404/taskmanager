import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Tasks from '../components/Tasks';
import MainLayout from '../layouts/MainLayout';

const Home = () => {
  const authState = useSelector((state) => state.authReducer);
  const { isLoggedIn } = authState;

  useEffect(() => {
    document.title = authState.isLoggedIn ? `${authState.user.name}'s tasks` : 'Task Manager';
  }, [authState]);

  return (
    <MainLayout>
      <style>
        {`
          @font-face {
            font-family: 'TheFont';
            src: url('https://garet.typeforward.com/assets/fonts/shared/TFMixVF.woff2') format('woff2');
          }

          .breathe-animation {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            height: 100vh;
            background-color: black;
          }

          .breathe-animation span {
            font-family: 'TheFont';
            font-size: clamp(10vw, 20vw, 50vh);
            color: white;
            text-align: center;
            animation: letter-breathe 3s ease-in-out infinite;
          }

          .main {
            position: relative;
            overflow: hidden;
          }

          .roller {
            display: block;
            height: 4.5em; /* Adjust height based on the number of lines */
            line-height: 1.5em;
            position: relative;
            overflow: hidden;
            width: 100%;
            margin: 0 auto;
          }

          .roller span {
            position: absolute;
            top: 0;
            font-weight: bold; /* Ensure bold text */
            animation: slide 6s infinite; /* Adjust duration for speed */
          }

          @keyframes slide {
            0% { top: 0; }
            25% { top: -1.5em; } /* Move up one line */
            50% { top: -3em; }  /* Move up two lines */
            75% { top: -1.5em; } /* Back to one line */
            100% { top: 0; }    /* Back to start */
          }

          @keyframes letter-breathe {
            from,
            to {
              font-variation-settings: 'wght' 100;
            }
            50% {
              font-variation-settings: 'wght' 900;
            }
          }
        `}
      </style>
      {!isLoggedIn ? (
        <div
          className="relative h-screen bg-cover bg-center text-white breathe-animation"
          style={{
            backgroundImage: `url('/photo.jpg')`,
          }}
        >
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black opacity-50"></div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
            <div className="main mt-16"> {/* Adjusted margin-top to move text into blank space */}
              <div className="roller">
                <span>
                  Discover the Ultimate Task Management Solution<br />
                  Streamline Your Workflow<br />
                  Boost Productivity and Collaboration
                </span>
              </div>
            </div>
            <p className="text-lg font-bold mb-6 max-w-2xl mt-4">
              Designed to boost employee productivity and collaboration within
              your organization.
            </p>
            <div className="text-xl font-bold italic text-gray-200 mb-8">
              "Efficiency is doing better what is already being done." – Peter Drucker
            </div>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-bold"
            >
              Join Now
            </Link>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-lg mt-8 mx-8 border-b border-b-gray-300">
            Welcome {authState.user.name}
          </h1>
          <Tasks />
        </>
      )}
    </MainLayout>
  );
};

export default Home;