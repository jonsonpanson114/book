import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
    sidebarContent?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, sidebarContent }) => {
    return (
        <div style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>
            <h1>RAW LAYOUT TEST</h1>
            <div style={{ marginTop: '20px', border: '1px solid white' }}>
                {children}
            </div>
        </div>
    );
};
