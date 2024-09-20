import crypto from 'crypto';

const useRandom = (string) => {
    const randomString = crypto.randomBytes(16).toString('hex'); 
    const timestamp = Date.now();
    const combinedString = `${string}-${randomString}-${timestamp}`;
    const uniqueStreamKey = Buffer.from(combinedString).toString('base64');
    return uniqueStreamKey;
};

export default useRandom;