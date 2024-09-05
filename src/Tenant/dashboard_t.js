import React from 'react';
import TenantLayout from '../Tenant/TenantLayout'; // Import the global layout

function DashboardT() {
    return (
        <TenantLayout>
            <div className="tenant-dashboard-content">
                <h2>What do you want to start with?</h2>
                <div className="tenant-options">
                    <div className="option-item" onClick={() => console.log('Rent Balance clicked')}>
                        <span>Rent Balance</span>
                    </div>
                    <div className="option-item" onClick={() => console.log('Mini Site clicked')}>
                        <span>Mini Site</span>
                    </div>
                    <div className="option-item" onClick={() => console.log('Forum clicked')}>
                        <span>Forum</span>
                    </div>
                </div>
            </div>
        </TenantLayout>
    );
}

export default DashboardT;
