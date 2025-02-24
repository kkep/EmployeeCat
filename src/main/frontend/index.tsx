import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Cat } from 'Frontend/views/Cat';
import { EmployeeView } from 'Frontend/views/Employee';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/employee" replace={true} />,
    },
    {
        path: '/employee',
        element: <EmployeeView />
    },
    {
        path: '/cat',
        element: <Cat />
    }
]);

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
