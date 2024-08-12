import React from 'react';
import '../styles/Community.css';

function Community() {
    const stalls = [
        { id: 1, name: "CHB", description: "Greek restaurant specializing in Greek delicacies" },
        { id: 2, name: "Catty Cafe", description: "Cat and Mouse themed cafe that also sells milk and cheese" },
        { id: 3, name: "Espresso", description: "Sells strong coffee and other imported ingredients for drinks" }
    ];

    return (
        <div className="community-container">
            <h1>Community</h1>
            <div className="stalls-list">
                {stalls.map(stall => (
                    <div key={stall.id} className="stall">
                        <h2>{stall.name}</h2>
                        <p>{stall.description}</p>
                        <button>View</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Community;
