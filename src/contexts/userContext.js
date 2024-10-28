import { createContext, useContext, useState, useCallback } from 'react';
import { getCurrentUserInfo } from '../services/authServices';

const UserContext = createContext();

function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    const updateUser = useCallback(async () => {
        try {
            const userData = await getCurrentUserInfo();
            setUser(userData);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }, []);

    const value = {
        user,
        setUser,
        updateUser
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

export { UserProvider, useUser };