import React from 'react';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#111', color: 'white' }}>
            <div style={{ width: '200px', borderRight: '1px solid #333', padding: '20px' }}>
                <h2>Sidebar</h2>
            </div>
            <div style={{ flex: 1, padding: '20px' }}>
                {children}
            </div>
        </div>
    );
};
