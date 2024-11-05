// import React, { useState, useEffect } from 'react';
// import { fetchVideoHistory } from '../../services/videoService';

// const VideoHistory = () => {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [videoHistory, setVideoHistory] = useState([]);
//     const [expandedVideo, setExpandedVideo] = useState(null);

//     useEffect(() => {
//         loadVideoHistory();
//     }, []);

//     const loadVideoHistory = async () => {
//         try {
//             setLoading(true);
//             const userId = localStorage.getItem("userId"); // Adjust based on how you store userId
//             const videos = await fetchVideoHistory(userId);
//             setVideoHistory(videos);
//         } catch (error) {
//             setError('Failed to load video history');
//             console.error('Error loading video history:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="text-red-500 text-center p-4">
//                 {error}
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-4">
//             <h2 className="text-2xl font-bold mb-4">Your Video History</h2>

//             {videoHistory.length === 0 ? (
//                 <div className="text-center py-8 text-gray-500">
//                     No videos found in your history
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {videoHistory.map((video, index) => (
//                         <div
//                             key={video.inputParameterId}
//                             className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200"
//                         >
//                             <div className="space-y-2">
//                                 <h3 className="font-semibold text-lg">
//                                     {video.subject} - {video.chapter}
//                                 </h3>
//                                 <div className="text-sm text-gray-600">
//                                     <p>Topic: {video.topic}</p>
//                                     <p>Problem Type: {video.problemType}</p>
//                                     <p>Created: {new Date(video.createdAt).toLocaleDateString()}</p>
//                                     {video.input && (
//                                         <p className="truncate">Input: {video.input}</p>
//                                     )}
//                                 </div>

//                                 <button
//                                     onClick={() => setExpandedVideo(expandedVideo === index ? null : index)}
//                                     className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//                                 >
//                                     {expandedVideo === index ? 'Hide Video' : 'Watch Video'}
//                                 </button>
//                             </div>

//                             {expandedVideo === index && (
//                                 <div className="mt-4">
//                                     <video
//                                         controls
//                                         className="w-full rounded-lg shadow"
//                                         src={video.videoUrl}
//                                     >
//                                         Your browser does not support the video tag.
//                                     </video>
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default VideoHistory;