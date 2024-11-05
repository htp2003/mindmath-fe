import React from 'react';

const VideoPlayer = ({ videoUrl }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Video Solution</h3>
            <div className="bg-white rounded-lg shadow-md p-4">
                <iframe
                    src={videoUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full aspect-video"
                ></iframe>
            </div>
        </div>
    );
};

export default VideoPlayer;