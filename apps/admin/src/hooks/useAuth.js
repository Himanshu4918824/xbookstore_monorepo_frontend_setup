import { useContext, createContext } from 'react';

// Create the context object
export const AuthContext = createContext();

// Create and export the custom hook for consuming the context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        // This error will fire if you try to use the hook outside of the provider
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};