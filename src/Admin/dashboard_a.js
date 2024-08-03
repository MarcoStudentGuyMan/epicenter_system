import React, { useState, useEffect } from 'react';
import { IonToggle,IonIcon } from '@ionic/react';
import { easel,personCircle,storefront,people,triangle,prism,mail,chatbubble,newspaper,calculator,exit} from 'ionicons/icons';
import '../Admin/Admin.css'; // Ensure you create this CSS file

function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleResize = () => {
        if (window.innerWidth < 768) { // Adjust the width threshold as needed
            setIsOpen(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); // Check the initial window size

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <IonToggle checked={isOpen} onIonChange={toggleSidebar} />
            </div>
            <div className="sidebar-content">
                <p>Hello, Marco!</p>
                <nav>
                    <ul>
                        <li><b>Home</b></li>
                        <li><IonIcon icon={easel} /> Dashboard</li>

                        <li><b>Account</b></li>
                        <li><IonIcon icon={personCircle} /> Profile</li>

                        <li><b>Environment</b></li>
                        <li><IonIcon icon={storefront} /> Stalls</li>
                        <li><IonIcon icon={people} /> Tenants</li>

                        <li><b>Website Customization</b></li>
                        <li><IonIcon icon={triangle} /> Epicenter Site</li>
                        <li><IonIcon icon={prism} /> Mini Sites</li>

                        <li><b>Communication</b></li>
                        <li><IonIcon icon={mail} /> Email</li>
                        <li><IonIcon icon={chatbubble} /> Forum</li>

                        <li><b>Rent Information</b></li>
                        <li><IonIcon icon={newspaper} /> Rent Balance</li>
                        <li><IonIcon icon={calculator} /> Rent Automation</li>
                        <li><IonIcon icon={exit} /> Logout</li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

function DashboardA() {
    return (
        <div className="app-container">
            <header className="app-header">
                THIS IS A HEADER
            </header>
            <Sidebar />
            <main className="main-content">
                {/* Your main content goes here */}
            </main>
        </div>
    );
}

export default DashboardA;
