CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(255) NOT NULL UNIQUE,          -- Username for the user
    stagename VARCHAR(255) NOT NULL UNIQUE,          -- Stagename for the user
    email VARCHAR(255) NOT NULL UNIQUE,             -- Email of the user
    passwordHash VARCHAR(255) NOT NULL,             -- Hashed password for security
    token VARCHAR(255),             -- token
    profilePicture VARCHAR(255),                    -- URL to the profile picture
    bannerPicture VARCHAR(255),                     -- URL to the banner picture
    fullName VARCHAR(255),                          -- Full name of the user
    phone VARCHAR(15),                              -- Phone number
    gender ENUM('male', 'female', 'other') DEFAULT 'other', -- Gender of the user
    bio TEXT,                                       -- Short bio/description of the user
    website VARCHAR(255),                           -- Website or social media link
    dateOfBirth DATE,                               -- Date of birth for age calculations
    city VARCHAR(255),                          -- User's location
    state VARCHAR(255),                          -- User's location
    country VARCHAR(255),                          -- User's location
    role ENUM('fan', 'model', 'admin') DEFAULT 'user', -- Role on the platform
    isVerified BOOLEAN DEFAULT FALSE,               -- Verification status (e.g., KYC)
    followersCount INT DEFAULT 0,                   -- Number of followers
    followingCount INT DEFAULT 0,                   -- Number of people the user is following
    profileViews INT DEFAULT 0,                     -- Total profile views
    liveStreamLink VARCHAR(255),                    -- Link to live stream (for models)
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Account creation timestamp
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Last updated timestamp
    
    -- Other potential fields depending on the specific features of the platform:
    accountStatus ENUM('active', 'inactive', 'banned') DEFAULT 'active', -- Account status
    subscriptionPrice DECIMAL(10, 2) DEFAULT 0.00,  -- Subscription price for models
    termsAccepted BOOLEAN DEFAULT FALSE             -- Has the user accepted the terms
);
