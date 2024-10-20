import React, { useState } from 'react';
import { ChevronRight, Play, Download, Edit3 } from 'lucide-react';

const CreateVideo = () => {
    const [step, setStep] = useState(1);
    const [videoScript, setVideoScript] = useState('');
    const [generatedVideo, setGeneratedVideo] = useState(null);

    const handleScriptSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the script to your backend for processing
        console.log('Submitting script:', videoScript);
        setStep(2);
        // Simulating video generation
        setTimeout(() => {
            setGeneratedVideo('https://example.com/generated-video.mp4');
            setStep(3);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Your Math Video</h1>

                {/* Progress Steps */}
                <div className="flex justify-between mb-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`flex items-center ${i < step ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${i <= step ? 'border-blue-600' : 'border-gray-400'}`}>
                                {i}
                            </div>
                            {i < 3 && <ChevronRight className="mx-2" />}
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <form onSubmit={handleScriptSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="script" className="block text-sm font-medium text-gray-700 mb-2">
                                Enter your video script
                            </label>
                            <textarea
                                id="script"
                                rows="6"
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                                value={videoScript}
                                onChange={(e) => setVideoScript(e.target.value)}
                                placeholder="Enter your math video script here..."
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Generate Video
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-xl">Generating your video...</p>
                    </div>
                )}

                {step === 3 && generatedVideo && (
                    <div className="space-y-6">
                        <div className="aspect-w-16 aspect-h-9">
                            <video controls className="rounded-lg shadow-lg w-full">
                                <source src={generatedVideo} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div className="flex justify-center space-x-4">
                            <button className="flex items-center bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300">
                                <Play className="mr-2" size={20} />
                                Play
                            </button>
                            <button className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
                                <Download className="mr-2" size={20} />
                                Download
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                className="flex items-center bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300"
                            >
                                <Edit3 className="mr-2" size={20} />
                                Edit Script
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateVideo;