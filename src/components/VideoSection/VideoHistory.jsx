import React, { useState, useEffect } from "react";
import {
    getSubjects,
    getChapters,
    getTopics,
    getProblemTypes,
    getInputParam,
    getSolution,
} from "../../services/videoService";
import { getCurrentUser } from "../../services/authServices";
import VideoPlayer from "../VideoPlayer/VideoPlayer";

const VideoHistory = () => {
    const [userId, setUserId] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [topics, setTopics] = useState([]);
    const [problemTypes, setProblemTypes] = useState([]);
    const [inputParams, setInputParams] = useState([]);
    const [solutionLink, setSolutionLink] = useState("");

    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedProblemType, setSelectedProblemType] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");
    // Retrieve user ID on component mount
    useEffect(() => {
        const user = getCurrentUser();
        if (user) {
            setUserId(user.id);
        }
    }, []);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const data = await getSubjects();
                setSubjects(data);
            } catch (error) {
                console.error("Failed to fetch subjects:", error);
            }
        };
        fetchSubjects();
    }, []);

    const handleSubjectClick = async (subjectId) => {
        setSelectedSubject(subjectId);
        setSelectedChapter(null);
        setChapters([]);
        setTopics([]);
        setProblemTypes([]);
        setInputParams([]);
        setSolutionLink("");
        try {
            const data = await getChapters(subjectId);
            setChapters(data);
        } catch (error) {
            console.error("Failed to fetch chapters:", error);
        }
    };

    const handleChapterClick = async (chapterId) => {
        setSelectedChapter(chapterId);
        setSelectedTopic(null);
        setTopics([]);
        setProblemTypes([]);
        setInputParams([]);
        setSolutionLink("");
        try {
            const data = await getTopics(chapterId);
            setTopics(data);
        } catch (error) {
            console.error("Failed to fetch topics:", error);
        }
    };

    const handleTopicClick = async (topicId) => {
        setSelectedTopic(topicId);
        setSelectedProblemType(null);
        setProblemTypes([]);
        setInputParams([]);
        setSolutionLink("");
        try {
            const data = await getProblemTypes(topicId);
            setProblemTypes(data);
        } catch (error) {
            console.error("Failed to fetch problem types:", error);
        }
    };

    const handleProblemTypeClick = async (problemTypeId) => {
        setSelectedProblemType(problemTypeId);
        setInputParams([]);
        setSolutionLink("");
        try {
            if (userId) {
                const data = await getInputParam(problemTypeId, userId);
                setInputParams(data);
            }
        } catch (error) {
            console.error("Failed to fetch input parameters:", error);
        }
    };

    const handleInputParamClick = async (inputParameterId) => {
        try {
            const data = await getSolution(inputParameterId);
            setVideoUrl(data.link);
        } catch (error) {
            console.error("Failed to fetch solution:", error);
        }
    };

    return (
        <div className="space-y-4 p-4">
            <h2 className="text-2xl font-bold">Video History</h2>

            {/* Subjects */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Subjects</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {subjects.map((subject) => (
                        <div
                            key={subject.id}
                            className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100 transition-colors ${selectedSubject === subject.id ? "bg-gray-100" : ""
                                }`}
                            onClick={() => handleSubjectClick(subject.id)}
                        >
                            <h3 className="text-lg font-semibold">{subject.name}</h3>
                            {selectedSubject === subject.id && (
                                <div className="mt-2">
                                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chapters */}
            {selectedSubject && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Chapters</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {chapters.map((chapter) => (
                            <div
                                key={chapter.id}
                                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100 transition-colors ${selectedChapter === chapter.id ? "bg-gray-100" : ""
                                    }`}
                                onClick={() => handleChapterClick(chapter.id)}
                            >
                                <h3 className="text-lg font-semibold">{chapter.name}</h3>
                                {selectedChapter === chapter.id && (
                                    <div className="mt-2">
                                        <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Topics */}
            {selectedChapter && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Topics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {topics.map((topic) => (
                            <div
                                key={topic.id}
                                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100 transition-colors ${selectedTopic === topic.id ? "bg-gray-100" : ""
                                    }`}
                                onClick={() => handleTopicClick(topic.id)}
                            >
                                <h3 className="text-lg font-semibold">{topic.name}</h3>
                                {selectedTopic === topic.id && (
                                    <div className="mt-2">
                                        <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Problem Types */}
            {selectedTopic && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Problem Types</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {problemTypes.map((problemType) => (
                            <div
                                key={problemType.id}
                                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100 transition-colors ${selectedProblemType === problemType.id ? "bg-gray-100" : ""
                                    }`}
                                onClick={() => handleProblemTypeClick(problemType.id)}
                            >
                                <h3 className="text-lg font-semibold">{problemType.name}</h3>
                                {selectedProblemType === problemType.id && (
                                    <div className="mt-2">
                                        <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Parameters */}
            {inputParams.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Input Parameters</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {inputParams.map((inputParam) => (
                            <div
                                key={inputParam.id}
                                className="bg-white rounded-lg shadow-md p-4"
                            >
                                <h4 className="text-lg font-semibold">
                                    {inputParam.name || `Input Param ${inputParam.id}`}
                                </h4>
                                <button
                                    onClick={() => handleInputParamClick(inputParam.id)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-2 w-full"
                                >
                                    View Solution
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Solution */}
            {solutionLink && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Solution</h3>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <a
                            href={solutionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            View Solution
                        </a>
                    </div>
                </div>
            )}
            {videoUrl && <VideoPlayer videoUrl={videoUrl} />}

        </div>
    );
};

const ChevronDownIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

export default VideoHistory;