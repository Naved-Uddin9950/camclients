import bcrypt from 'bcrypt';
import AppConstants from '../Constants/AppConstants.js';

const useHash = async (password) => {
    const saltRounds = AppConstants.saltRounds;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
};

export const useCompare = async (password, hash) => {
    const match = await bcrypt.compare(password, hash);
    return match;
};

export default useHash;