import React, { useState, useEffect } from 'react';
import { ChevronRight, Play, Download } from 'lucide-react';
import { getCurrentUser } from '../../services/authServices';
import {
    getSubjects,
    getChapters,
    getTopics,
    getProblemTypes,
    submitInput,
    getSolution
} from '../../services/videoService';
import LoadingVideoGenerator from '../../components/LoadingVideoGenerator/LoadingVideoGenerator';

const CreateVideo = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);

    // Filter states
    const [subjects, setSubjects] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [topics, setTopics] = useState([]);
    const [problemTypes, setProblemTypes] = useState([]);

    // Selected values
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedProblemType, setSelectedProblemType] = useState(null);
    const [inputs, setInputs] = useState([]);
    const [numberOfInputs, setNumberOfInputs] = useState(0);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser?.id) {
            // Nếu không tìm thấy người dùng, chuyển hướng đến trang đăng nhập hoặc hiển thị thông báo lỗi
            // Ví dụ:
            setError('Please login to continue');
        }
    }, []);

    // Fetch initial subjects
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const data = await getSubjects();
                setSubjects(data);
            } catch (err) {
                setError('Failed to load subjects');
                console.error(err);
            }
        };
        fetchSubjects();
    }, []);

    // Fetch chapters when subject changes
    useEffect(() => {
        if (selectedSubject) {
            const fetchChapters = async () => {
                try {
                    const data = await getChapters(selectedSubject);
                    setChapters(data);
                    // Reset subsequent selections
                    setSelectedChapter(null);
                    setSelectedTopic(null);
                    setSelectedProblemType(null);
                    setTopics([]);
                    setProblemTypes([]);
                } catch (err) {
                    setError('Failed to load chapters');
                    console.error(err);
                }
            };
            fetchChapters();
        }
    }, [selectedSubject]);

    // Fetch topics when chapter changes
    useEffect(() => {
        if (selectedChapter) {
            const fetchTopics = async () => {
                try {
                    const data = await getTopics(selectedChapter);
                    setTopics(data);
                    // Reset subsequent selections
                    setSelectedTopic(null);
                    setSelectedProblemType(null);
                    setProblemTypes([]);
                } catch (err) {
                    setError('Failed to load topics');
                    console.error(err);
                }
            };
            fetchTopics();
        }
    }, [selectedChapter]);

    // Fetch problem types when topic changes
    useEffect(() => {
        if (selectedTopic) {
            const fetchProblemTypes = async () => {
                try {
                    const data = await getProblemTypes(selectedTopic);
                    setProblemTypes(data);
                    setSelectedProblemType(null);
                    setInputs([]);
                    setNumberOfInputs(0);
                } catch (err) {
                    setError('Failed to load problem types');
                    console.error(err);
                }
            };
            fetchProblemTypes();
        }
    }, [selectedTopic]);

    useEffect(() => {
        if (selectedProblemType) {
            const problemType = problemTypes.find(pt => pt.id === selectedProblemType);
            if (problemType) {
                setNumberOfInputs(problemType.numberOfInputs);
                setInputs(new Array(problemType.numberOfInputs).fill(''));
            }
        }
    }, [selectedProblemType, problemTypes]);

    const handleInputChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const currentUser = getCurrentUser();
            const inputResult = await submitInput(selectedProblemType, currentUser.id, inputs);
            setStep(2);

            setTimeout(async () => {
                try {
                    const solution = await getSolution(inputResult.id);
                    setVideoUrl(solution.link);
                    setStep(3);
                } catch (err) {
                    setError(`Server is busy, please try again later`);
                    setStep(1);
                }
            }, 65000);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderInputFields = () => {
        const problemType = problemTypes.find(pt => pt.id === selectedProblemType);
        if (!problemType) return null;

        return (
            <div className="space-y-4">
                <div className="text-sm text-gray-600 mb-2">
                    {problemType.description}
                </div>
                {inputs.map((input, index) => (
                    <div key={index}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Parameter {index + 1}
                        </label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                            value={input}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            placeholder={`Enter parameter ${index + 1}`}
                            required
                            disabled={loading}
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Your Math Video</h1>

                {/* Progress Steps */}
                <div className="flex justify-between mb-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`flex items-center ${i <= step ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${i <= step ? 'border-blue-600' : 'border-gray-400'
                                }`}>
                                {i}
                            </div>
                            {i < 3 && <ChevronRight className="mx-2" />}
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Subject Selection */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Select a Subject</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {subjects.map((subject) => (
                                    <div
                                        key={subject.id}
                                        className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100 transition-colors ${selectedSubject === subject.id ? "bg-gray-100" : ""
                                            }`}
                                        onClick={() => setSelectedSubject(subject.id)}
                                    >
                                        <h3 className="text-lg font-semibold">{subject.name}</h3>
                                        {selectedSubject === subject.id && (
                                            <div className="mt-2">
                                                <ChevronRight className="w-5 h-5 text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chapter Selection */}
                        {selectedSubject && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Select a Chapter</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {chapters.map((chapter) => (
                                        <div
                                            key={chapter.id}
                                            className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100 transition-colors ${selectedChapter === chapter.id ? "bg-gray-100" : ""
                                                }`}
                                            onClick={() => setSelectedChapter(chapter.id)}
                                        >
                                            <h3 className="text-lg font-semibold">{chapter.name}</h3>
                                            {selectedChapter === chapter.id && (
                                                <div className="mt-2">
                                                    <ChevronRight className="w-5 h-5 text-gray-500" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Topic Selection */}
                        {selectedChapter && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Select a Topic</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {topics.map((topic) => (
                                        <div
                                            key={topic.id}
                                            className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100 transition-colors ${selectedTopic === topic.id ? "bg-gray-100" : ""
                                                }`}
                                            onClick={() => setSelectedTopic(topic.id)}
                                        >
                                            <h3 className="text-lg font-semibold">{topic.name}</h3>
                                            {selectedTopic === topic.id && (
                                                <div className="mt-2">
                                                    <ChevronRight className="w-5 h-5 text-gray-500" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Problem Type Selection */}
                        {selectedTopic && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Select a Problem Type</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {problemTypes.map((type) => (
                                        <div
                                            key={type.id}
                                            className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100 transition-colors ${selectedProblemType === type.id ? "bg-gray-100" : ""
                                                }`}
                                            onClick={() => setSelectedProblemType(type.id)}
                                        >
                                            <h3 className="text-lg font-semibold">{type.name}</h3>
                                            {selectedProblemType === type.id && (
                                                <div className="mt-2">
                                                    <ChevronRight className="w-5 h-5 text-gray-500" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input Parameter */}
                        {selectedProblemType && renderInputFields()}

                        {selectedProblemType && (
                            <button
                                type="submit"
                                className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                disabled={loading || inputs.some(input => !input)}
                            >
                                {loading ? 'Processing...' : 'Generate Video'}
                            </button>
                        )}
                    </form>
                )}

                {/* Loading State */}
                {step === 2 && (
                    <LoadingVideoGenerator timeToGenerate={65000} />
                )}

                {/* Video Result */}
                {step === 3 && videoUrl && (
                    <div className="space-y-6">
                        <div className="aspect-w-16 aspect-h-9">
                            <video controls className="rounded-lg shadow-lg w-full">
                                <source src={videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div className="flex justify-center space-x-4">
                            <a
                                href={videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                            >
                                <Play className="mr-2" size={20} />
                                Open in New Tab
                            </a>
                            <a
                                href={videoUrl}
                                download
                                className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                            >
                                <Download className="mr-2" size={20} />
                                Download
                            </a>
                            <button
                                onClick={() => {
                                    setStep(1);
                                    setVideoUrl(null);
                                    setInput('');
                                }}
                                className="flex items-center bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300"
                            >
                                Create Another Video
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateVideo;