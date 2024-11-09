import React from 'react';

const LoadingVideoGenerator = ({ timeToGenerate }) => {
    return (
        <div className="flex flex-col items-center justify-center h-64">
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <p className="mt-4 text-gray-500">Generating video... (~ {Math.floor(timeToGenerate / 1000)} seconds)</p>
        </div>
    );
};

export default LoadingVideoGenerator;